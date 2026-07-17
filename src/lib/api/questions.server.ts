import { prisma } from "@/lib/prisma.server";

export type QuestionInput = {
  chapterId: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  sortOrder?: number;
};

export async function listQuestions(chapterId?: string) {
  return prisma.question.findMany({
    where: chapterId ? { chapterId } : undefined,
    orderBy: [{ chapterId: "asc" }, { sortOrder: "asc" }],
    include: {
      chapter: { select: { id: true, title: true, subjectId: true } },
    },
  });
}

export async function getQuestion(id: string) {
  return prisma.question.findUnique({
    where: { id },
    include: {
      chapter: { select: { id: true, title: true, subjectId: true } },
    },
  });
}

export async function createQuestion(data: QuestionInput) {
  if (data.options.length < 2) throw new Error("Au moins 2 options sont requises.");
  if (data.correctIndex < 0 || data.correctIndex >= data.options.length) {
    throw new Error("correctIndex invalide pour le nombre d'options.");
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
}

export async function updateQuestion(id: string, data: Partial<Omit<QuestionInput, "chapterId">>) {
  if (data.options && data.correctIndex !== undefined) {
    if (data.correctIndex < 0 || data.correctIndex >= data.options.length) {
      throw new Error("correctIndex invalide pour le nombre d'options.");
    }
  }

  return prisma.question.update({
    where: { id },
    data: {
      ...data,
      options: data.options,
    },
  });
}

export async function deleteQuestion(id: string) {
  return prisma.question.delete({ where: { id } });
}
