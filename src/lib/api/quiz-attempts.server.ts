import { prisma } from "@/lib/prisma.server";

export type QuizAttemptInput = {
  userId: string;
  chapterId: string;
  score: number;
  totalQuestions: number;
  timeSeconds: number;
};

export async function listQuizAttempts(filters?: { userId?: string; chapterId?: string }) {
  return prisma.quizAttempt.findMany({
    where: {
      userId: filters?.userId,
      chapterId: filters?.chapterId,
    },
    include: {
      chapter: { select: { id: true, title: true, subjectId: true } },
      user: { select: { id: true, name: true } },
      _count: { select: { answers: true } },
    },
    orderBy: { completedAt: "desc" },
  });
}

export async function getQuizAttempt(id: string) {
  return prisma.quizAttempt.findUnique({
    where: { id },
    include: {
      chapter: { select: { id: true, title: true, subjectId: true } },
      user: { select: { id: true, name: true } },
      answers: { include: { question: true }, orderBy: { question: { sortOrder: "asc" } } },
    },
  });
}

export async function createQuizAttempt(data: QuizAttemptInput) {
  return prisma.quizAttempt.create({
    data: {
      userId: data.userId,
      chapterId: data.chapterId,
      score: data.score,
      totalQuestions: data.totalQuestions,
      timeSeconds: data.timeSeconds,
    },
  });
}

export async function updateQuizAttempt(id: string, data: Partial<Omit<QuizAttemptInput, "userId" | "chapterId">>) {
  return prisma.quizAttempt.update({ where: { id }, data });
}

export async function deleteQuizAttempt(id: string) {
  return prisma.quizAttempt.delete({ where: { id } });
}

export async function assertQuizAttemptOwner(id: string, userId: string) {
  const attempt = await prisma.quizAttempt.findUnique({ where: { id }, select: { userId: true } });
  if (!attempt) return false;
  return attempt.userId === userId;
}
