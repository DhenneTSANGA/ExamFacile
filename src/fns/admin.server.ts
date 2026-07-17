import { createServerFn } from "@tanstack/react-start";
import { requireAdminUserId } from "@/lib/admin.server";
import { prisma } from "@/lib/prisma.server";
import { buildLessonContent, buildQuizQuestions, buildStudyGuideContent } from "@/lib/content-templates";

export const getAdminStatsFn = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdminUserId();
  const [subjects, chapters, questions, users, badges, attempts] = await Promise.all([
    prisma.subject.count(),
    prisma.chapter.count(),
    prisma.question.count(),
    prisma.user.count(),
    prisma.badge.count(),
    prisma.quizAttempt.count(),
  ]);
  return { subjects, chapters, questions, users, badges, attempts };
});

export const adminListSubjectsFn = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdminUserId();
  return prisma.subject.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { chapters: true } } },
  });
});

export const adminGetSubjectFn = createServerFn({ method: "GET" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    await requireAdminUserId();
    return prisma.subject.findUnique({
      where: { id: data.id },
      include: {
        chapters: { orderBy: { sortOrder: "asc" }, include: { _count: { select: { questions: true } } } },
      },
    });
  });

type SubjectInput = {
  id: string;
  name: string;
  icon: string;
  color: string;
  gradient: string;
  description: string;
  sortOrder?: number;
};

export const adminSaveSubjectFn = createServerFn({ method: "POST" })
  .validator((data: SubjectInput) => data)
  .handler(async ({ data }) => {
    await requireAdminUserId();
    return prisma.subject.upsert({
      where: { id: data.id },
      update: {
        name: data.name,
        icon: data.icon,
        color: data.color,
        gradient: data.gradient,
        description: data.description,
        sortOrder: data.sortOrder ?? 0,
      },
      create: {
        id: data.id,
        name: data.name,
        icon: data.icon,
        color: data.color,
        gradient: data.gradient,
        description: data.description,
        sortOrder: data.sortOrder ?? 0,
      },
    });
  });

export const adminDeleteSubjectFn = createServerFn({ method: "POST" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    await requireAdminUserId();
    await prisma.subject.delete({ where: { id: data.id } });
    return { ok: true as const };
  });

type ChapterInput = {
  id: string;
  subjectId: string;
  title: string;
  duration: number;
  sortOrder?: number;
  withContent?: boolean;
};

export const adminSaveChapterFn = createServerFn({ method: "POST" })
  .validator((data: ChapterInput) => data)
  .handler(async ({ data }) => {
    await requireAdminUserId();
    const chapter = await prisma.chapter.upsert({
      where: { id: data.id },
      update: {
        subjectId: data.subjectId,
        title: data.title,
        duration: data.duration,
        sortOrder: data.sortOrder ?? 0,
      },
      create: {
        id: data.id,
        subjectId: data.subjectId,
        title: data.title,
        duration: data.duration,
        sortOrder: data.sortOrder ?? 0,
      },
    });

    if (data.withContent) {
      const lesson = buildLessonContent(data.title, data.duration);
      const guide = buildStudyGuideContent(data.title);
      const questions = buildQuizQuestions(data.title);

      await prisma.lesson.upsert({
        where: { chapterId: chapter.id },
        update: { readingTime: lesson.readingTime, intro: lesson.intro, summary: lesson.summary },
        create: {
          chapterId: chapter.id,
          readingTime: lesson.readingTime,
          intro: lesson.intro,
          summary: lesson.summary,
          sections: { create: lesson.sections },
        },
      });

      await prisma.studyGuide.upsert({
        where: { chapterId: chapter.id },
        update: {
          keyConcepts: guide.keyConcepts,
          examTips: guide.examTips,
          commonMistakes: guide.commonMistakes,
          importantFacts: guide.importantFacts,
        },
        create: {
          chapterId: chapter.id,
          keyConcepts: guide.keyConcepts,
          examTips: guide.examTips,
          commonMistakes: guide.commonMistakes,
          importantFacts: guide.importantFacts,
          definitions: { create: guide.definitions },
        },
      });

      const existing = await prisma.question.count({ where: { chapterId: chapter.id } });
      if (existing === 0) {
        await prisma.question.createMany({
          data: questions.map((q, i) => ({
            chapterId: chapter.id,
            question: q.question,
            options: q.options,
            correctIndex: q.correctIndex,
            explanation: q.explanation,
            sortOrder: i,
          })),
        });
      }
    }

    return chapter;
  });

export const adminDeleteChapterFn = createServerFn({ method: "POST" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    await requireAdminUserId();
    await prisma.chapter.delete({ where: { id: data.id } });
    return { ok: true as const };
  });

export const adminGetChapterFn = createServerFn({ method: "GET" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    await requireAdminUserId();
    return prisma.chapter.findUnique({
      where: { id: data.id },
      include: {
        subject: true,
        lesson: { include: { sections: { orderBy: { sortOrder: "asc" } } } },
        studyGuide: { include: { definitions: { orderBy: { sortOrder: "asc" } } } },
        questions: { orderBy: { sortOrder: "asc" } },
      },
    });
  });

type LessonInput = {
  chapterId: string;
  readingTime: number;
  intro: string;
  summary: string;
  sections: { heading: string; body: string; sortOrder?: number }[];
};

export const adminSaveLessonFn = createServerFn({ method: "POST" })
  .validator((data: LessonInput) => data)
  .handler(async ({ data }) => {
    await requireAdminUserId();
    const lesson = await prisma.lesson.upsert({
      where: { chapterId: data.chapterId },
      update: { readingTime: data.readingTime, intro: data.intro, summary: data.summary },
      create: {
        chapterId: data.chapterId,
        readingTime: data.readingTime,
        intro: data.intro,
        summary: data.summary,
      },
    });

    await prisma.lessonSection.deleteMany({ where: { lessonId: lesson.id } });
    if (data.sections.length > 0) {
      await prisma.lessonSection.createMany({
        data: data.sections.map((s, i) => ({
          lessonId: lesson.id,
          heading: s.heading,
          body: s.body,
          sortOrder: s.sortOrder ?? i,
        })),
      });
    }

    return lesson;
  });

type QuestionInput = {
  id?: string;
  chapterId: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  sortOrder?: number;
};

export const adminSaveQuestionFn = createServerFn({ method: "POST" })
  .validator((data: QuestionInput) => data)
  .handler(async ({ data }) => {
    await requireAdminUserId();
    if (data.id) {
      return prisma.question.update({
        where: { id: data.id },
        data: {
          question: data.question,
          options: data.options,
          correctIndex: data.correctIndex,
          explanation: data.explanation,
          sortOrder: data.sortOrder ?? 0,
        },
      });
    }
    return prisma.question.create({
      data: {
        chapterId: data.chapterId,
        question: data.question,
        options: data.options,
        correctIndex: data.correctIndex,
        explanation: data.explanation,
        sortOrder: data.sortOrder ?? 0,
      },
    });
  });

export const adminDeleteQuestionFn = createServerFn({ method: "POST" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    await requireAdminUserId();
    await prisma.question.delete({ where: { id: data.id } });
    return { ok: true as const };
  });

export const adminListBadgesFn = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdminUserId();
  return prisma.badge.findMany({ orderBy: { sortOrder: "asc" } });
});

type BadgeInput = {
  id: string;
  name: string;
  emoji: string;
  description: string;
  sortOrder?: number;
};

export const adminSaveBadgeFn = createServerFn({ method: "POST" })
  .validator((data: BadgeInput) => data)
  .handler(async ({ data }) => {
    await requireAdminUserId();
    return prisma.badge.upsert({
      where: { id: data.id },
      update: { name: data.name, emoji: data.emoji, description: data.description, sortOrder: data.sortOrder ?? 0 },
      create: { id: data.id, name: data.name, emoji: data.emoji, description: data.description, sortOrder: data.sortOrder ?? 0 },
    });
  });

export const adminDeleteBadgeFn = createServerFn({ method: "POST" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    await requireAdminUserId();
    await prisma.badge.delete({ where: { id: data.id } });
    return { ok: true as const };
  });

export const adminListUsersFn = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdminUserId();
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      series: true,
      level: true,
      points: true,
      createdAt: true,
      subscription: { select: { plan: true } },
    },
    take: 100,
  });
});
