import { prisma } from "@/lib/prisma.server";

export type QuizAnswerInput = {
  attemptId: string;
  questionId: string;
  selectedIndex: number;
  isCorrect: boolean;
};

export async function listQuizAnswers(filters?: { attemptId?: string; questionId?: string }) {
  return prisma.quizAnswer.findMany({
    where: {
      attemptId: filters?.attemptId,
      questionId: filters?.questionId,
    },
    include: {
      attempt: { select: { id: true, userId: true, chapterId: true } },
      question: { select: { id: true, question: true, correctIndex: true } },
    },
    orderBy: { id: "asc" },
  });
}

export async function getQuizAnswer(id: string) {
  return prisma.quizAnswer.findUnique({
    where: { id },
    include: {
      attempt: { select: { id: true, userId: true, chapterId: true } },
      question: true,
    },
  });
}

export async function createQuizAnswer(data: QuizAnswerInput) {
  return prisma.quizAnswer.create({ data });
}

export async function updateQuizAnswer(id: string, data: Partial<Omit<QuizAnswerInput, "attemptId" | "questionId">>) {
  return prisma.quizAnswer.update({ where: { id }, data });
}

export async function deleteQuizAnswer(id: string) {
  return prisma.quizAnswer.delete({ where: { id } });
}

export async function getQuizAnswerOwnerUserId(id: string) {
  const answer = await prisma.quizAnswer.findUnique({
    where: { id },
    select: { attempt: { select: { userId: true } } },
  });
  return answer?.attempt.userId;
}
