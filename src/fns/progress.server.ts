import { createServerFn } from "@tanstack/react-start";
import { prisma } from "@/lib/prisma.server";
import {
  computeStreak,
  formatRelativeTime,
  lessonXp,
  levelFromPoints,
  quizXp,
  DAY_LABELS,
} from "@/lib/gamification";
import { requireSessionUserId } from "@/lib/session.server";
import type {
  ActivityView,
  BadgeView,
  LeaderEntry,
  QuizResultView,
  WeeklyStatView,
} from "@/types/app";

function todayDate(): Date {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

async function upsertDailyStat(userId: string, points: number, minutes: number) {
  const date = todayDate();
  await prisma.dailyStat.upsert({
    where: { userId_date: { userId, date } },
    update: { points: { increment: points }, minutes: { increment: minutes } },
    create: { userId, date, points, minutes },
  });
}

async function recordActivity(userId: string, type: "QUIZ" | "LESSON" | "BADGE" | "CHAPTER", title: string, detail: string, icon: string) {
  await prisma.activity.create({ data: { userId, type, title, detail, icon } });
}

async function refreshBadges(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return;

  const updates: { badgeId: string; progress: number }[] = [
    { badgeId: "motivated", progress: Math.min(100, Math.round((user.streak / 7) * 100)) },
    { badgeId: "expert", progress: Math.min(100, Math.round((user.quizCompleted / 5) * 100)) },
    { badgeId: "studious", progress: Math.min(100, Math.round((user.quizCompleted / 50) * 100)) },
    { badgeId: "legend", progress: Math.min(100, Math.round((user.level / 30) * 100)) },
  ];

  const rank = await prisma.user.count({ where: { points: { gt: user.points } } });
  updates.push({ badgeId: "elite", progress: rank < 10 ? 100 : Math.max(0, 100 - rank * 5) });

  for (const u of updates) {
    const existing = await prisma.userBadge.findUnique({
      where: { userId_badgeId: { userId, badgeId: u.badgeId } },
    });
    if (!existing) continue;

    const unlocked = u.progress >= 100;
    const wasLocked = !existing.unlockedAt;

    await prisma.userBadge.update({
      where: { id: existing.id },
      data: {
        progress: u.progress,
        unlockedAt: unlocked ? (existing.unlockedAt ?? new Date()) : null,
      },
    });

    if (unlocked && wasLocked) {
      const badge = await prisma.badge.findUnique({ where: { id: u.badgeId } });
      if (badge) {
        await recordActivity(userId, "BADGE", `Débloqué : ${badge.name}`, badge.emoji, "🏆");
      }
    }
  }
}

async function getLeaderboardData(userId: string, filter: string): Promise<LeaderEntry[]> {
  const series = filter.startsWith("Série ") ? filter.replace("Série ", "") : null;
  const users = await prisma.user.findMany({
    where: series ? { series: series as "A1" | "A2" | "C" | "D" | "E" | "F" | "G" | "H" } : undefined,
    orderBy: { points: "desc" },
    take: 50,
  });

  return users.map((u, i) => ({
    rank: i + 1,
    name: u.name,
    series: u.series,
    points: u.points,
    isUser: u.id === userId,
  }));
}

export const completeLessonFn = createServerFn({ method: "POST" })
  .validator((data: { chapterId: string; minutes?: number }) => data)
  .handler(async ({ data }) => {
    const userId = requireSessionUserId();
    const chapter = await prisma.chapter.findUnique({ where: { id: data.chapterId } });
    if (!chapter) throw new Error("Chapitre introuvable.");

    const xp = lessonXp(data.minutes ?? chapter.duration);
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("Utilisateur introuvable.");

    const streak = computeStreak(user.lastActiveAt, user.streak);
    const newPoints = user.points + xp;
    const newLevel = levelFromPoints(newPoints);

    await prisma.$transaction([
      prisma.chapterProgress.upsert({
        where: { userId_chapterId: { userId, chapterId: data.chapterId } },
        update: { progress: 50, completed: false },
        create: { userId, chapterId: data.chapterId, progress: 50, completed: false },
      }),
      prisma.user.update({
        where: { id: userId },
        data: { points: newPoints, level: newLevel, streak, lastActiveAt: new Date() },
      }),
    ]);

    await upsertDailyStat(userId, xp, data.minutes ?? chapter.duration);
    await recordActivity(userId, "LESSON", `Terminé : ${chapter.title}`, `+${xp} XP`, "📖");
    await refreshBadges(userId);

    return { xp };
  });

export const submitQuizFn = createServerFn({ method: "POST" })
  .validator((data: { chapterId: string; answers: number[]; timeSeconds: number }) => data)
  .handler(async ({ data }) => {
    const userId = requireSessionUserId();
    const chapter = await prisma.chapter.findUnique({
      where: { id: data.chapterId },
      include: { questions: { orderBy: { sortOrder: "asc" } } },
    });
    if (!chapter || chapter.questions.length === 0) throw new Error("Quiz indisponible.");

    const questions = chapter.questions;
    let score = 0;
    const answerRows: { questionId: string; selectedIndex: number; isCorrect: boolean }[] = [];

    questions.forEach((q, i) => {
      const selected = data.answers[i] ?? -1;
      const isCorrect = selected === q.correctIndex;
      if (isCorrect) score += 1;
      answerRows.push({ questionId: q.id, selectedIndex: selected, isCorrect });
    });

    const xp = quizXp(score, questions.length);
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("Utilisateur introuvable.");

    const streak = computeStreak(user.lastActiveAt, user.streak);
    const newPoints = user.points + xp;
    const newLevel = levelFromPoints(newPoints);
    const pct = Math.round((score / questions.length) * 100);
    const chapterCompleted = pct >= 70;

    const attempt = await prisma.$transaction(async (tx) => {
      const att = await tx.quizAttempt.create({
        data: {
          userId,
          chapterId: data.chapterId,
          score,
          totalQuestions: questions.length,
          timeSeconds: data.timeSeconds,
          answers: { create: answerRows },
        },
      });

      await tx.chapterProgress.upsert({
        where: { userId_chapterId: { userId, chapterId: data.chapterId } },
        update: {
          progress: Math.max(pct, chapterCompleted ? 100 : pct),
          completed: chapterCompleted,
          completedAt: chapterCompleted ? new Date() : undefined,
        },
        create: {
          userId,
          chapterId: data.chapterId,
          progress: pct,
          completed: chapterCompleted,
          completedAt: chapterCompleted ? new Date() : null,
        },
      });

      await tx.user.update({
        where: { id: userId },
        data: {
          points: newPoints,
          level: newLevel,
          streak,
          quizCompleted: { increment: 1 },
          lastActiveAt: new Date(),
        },
      });

      return att;
    });

    await upsertDailyStat(userId, xp, Math.ceil(data.timeSeconds / 60));
    await recordActivity(userId, "QUIZ", `Quiz ${chapter.title}`, `${score}/${questions.length}`, "🎯");
    await refreshBadges(userId);

    return {
      attemptId: attempt.id,
      chapterId: chapter.id,
      chapterTitle: chapter.title,
      score,
      total: questions.length,
      time: data.timeSeconds,
      answers: data.answers,
      questions: questions.map((q) => ({
        id: q.id,
        question: q.question,
        options: q.options as string[],
        correct: q.correctIndex,
        explanation: q.explanation,
      })),
    } satisfies QuizResultView;
  });

export const getQuizResultFn = createServerFn({ method: "GET" })
  .validator((data: { attemptId: string }) => data)
  .handler(async ({ data }) => {
    const userId = requireSessionUserId();
    const attempt = await prisma.quizAttempt.findFirst({
      where: { id: data.attemptId, userId },
      include: {
        chapter: true,
        answers: { include: { question: true }, orderBy: { question: { sortOrder: "asc" } } },
      },
    });
    if (!attempt) return null;

    return {
      attemptId: attempt.id,
      chapterId: attempt.chapterId,
      chapterTitle: attempt.chapter.title,
      score: attempt.score,
      total: attempt.totalQuestions,
      time: attempt.timeSeconds,
      answers: attempt.answers.map((a) => a.selectedIndex),
      questions: attempt.answers.map((a) => ({
        id: a.question.id,
        question: a.question.question,
        options: a.question.options as string[],
        correct: a.question.correctIndex,
        explanation: a.question.explanation,
      })),
    } satisfies QuizResultView;
  });

export const getDashboardFn = createServerFn({ method: "GET" }).handler(async () => {
  const userId = requireSessionUserId();
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { subscription: true },
  });
  if (!user) throw new Error("Utilisateur introuvable.");

  const [subjects, activities, dailyStats, rank] = await Promise.all([
    prisma.subject.findMany({ orderBy: { sortOrder: "asc" }, include: { _count: { select: { chapters: true } }, chapters: { select: { id: true } } } }),
    prisma.activity.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 4 }),
    prisma.dailyStat.findMany({
      where: { userId, date: { gte: new Date(Date.now() - 7 * 86_400_000) } },
      orderBy: { date: "asc" },
    }),
    prisma.user.count({ where: { points: { gt: user.points } } }),
  ]);

  const progressRows = await prisma.chapterProgress.findMany({ where: { userId } });
  const progressByChapter = new Map(progressRows.map((p) => [p.chapterId, p.progress]));

  const subjectViews = subjects.map((s) => {
    const chapterIds = s.chapters.map((c) => c.id);
    const total = chapterIds.reduce((sum, id) => sum + (progressByChapter.get(id) ?? 0), 0);
    return {
      id: s.id,
      name: s.name,
      icon: s.icon,
      color: s.color,
      gradient: s.gradient,
      description: s.description,
      chaptersCount: s._count.chapters,
      progress: s._count.chapters ? Math.round(total / s._count.chapters) : 0,
    };
  });

  const weeklyMap = new Map<string, WeeklyStatView>();
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    weeklyMap.set(key, { day: DAY_LABELS[d.getDay()], points: 0, minutes: 0 });
  }
  for (const stat of dailyStats) {
    const key = stat.date.toISOString().slice(0, 10);
    const row = weeklyMap.get(key);
    if (row) {
      row.points = stat.points;
      row.minutes = stat.minutes;
    }
  }

  const activityViews: ActivityView[] = activities.map((a) => ({
    id: a.id,
    type: a.type,
    title: a.title,
    score: a.detail ?? "",
    time: formatRelativeTime(a.createdAt),
    icon: a.icon ?? "📌",
  }));

  const leaderboard = await getLeaderboardData(userId, "National");

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar || user.name.charAt(0),
      series: user.series,
      level: user.level,
      points: user.points,
      streak: user.streak,
      quizCompleted: user.quizCompleted,
      plan: user.subscription?.plan === "PREMIUM" ? ("PREMIUM" as const) : ("FREE" as const),
    },
    weeklyProgress: [...weeklyMap.values()],
    recentActivity: activityViews,
    subjects: subjectViews,
    rank: rank + 1,
    leaderboardPreview: leaderboard.slice(3, 7),
    weeklyXp: [...weeklyMap.values()].reduce((s, d) => s + d.points, 0),
  };
});

export const getLeaderboardFn = createServerFn({ method: "GET" })
  .validator((data: { filter: string }) => data)
  .handler(async ({ data }) => {
    const userId = requireSessionUserId();
    return getLeaderboardData(userId, data.filter);
  });

export const getBadgesFn = createServerFn({ method: "GET" }).handler(async () => {
  const userId = requireSessionUserId();
  const badges = await prisma.badge.findMany({ orderBy: { sortOrder: "asc" } });
  const userBadges = await prisma.userBadge.findMany({ where: { userId } });
  const map = new Map(userBadges.map((ub) => [ub.badgeId, ub]));

  return badges.map((b) => {
    const ub = map.get(b.id);
    return {
      id: b.id,
      name: b.name,
      emoji: b.emoji,
      description: b.description,
      unlocked: (ub?.progress ?? 0) >= 100,
      progress: ub?.progress ?? 0,
    } satisfies BadgeView;
  });
});
