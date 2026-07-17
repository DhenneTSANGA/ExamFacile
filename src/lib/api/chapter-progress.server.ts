import { prisma } from "@/lib/prisma.server";

export type ChapterProgressInput = {
  userId: string;
  chapterId: string;
  progress?: number;
  completed?: boolean;
  completedAt?: string | null;
};

export async function listChapterProgress(filters?: { userId?: string; chapterId?: string }) {
  return prisma.chapterProgress.findMany({
    where: {
      userId: filters?.userId,
      chapterId: filters?.chapterId,
    },
    include: {
      chapter: { select: { id: true, title: true, subjectId: true } },
      user: { select: { id: true, name: true } },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getChapterProgress(id: string) {
  return prisma.chapterProgress.findUnique({
    where: { id },
    include: {
      chapter: { select: { id: true, title: true, subjectId: true } },
      user: { select: { id: true, name: true } },
    },
  });
}

export async function createChapterProgress(data: ChapterProgressInput) {
  return prisma.chapterProgress.create({
    data: {
      userId: data.userId,
      chapterId: data.chapterId,
      progress: data.progress ?? 0,
      completed: data.completed ?? false,
      completedAt: data.completedAt ? new Date(data.completedAt) : null,
    },
  });
}

export async function updateChapterProgress(id: string, data: Partial<Omit<ChapterProgressInput, "userId" | "chapterId">>) {
  return prisma.chapterProgress.update({
    where: { id },
    data: {
      ...data,
      completedAt: data.completedAt === undefined ? undefined : data.completedAt ? new Date(data.completedAt) : null,
    },
  });
}

export async function deleteChapterProgress(id: string) {
  return prisma.chapterProgress.delete({ where: { id } });
}

export async function getChapterProgressOwnerUserId(id: string) {
  const row = await prisma.chapterProgress.findUnique({ where: { id }, select: { userId: true } });
  return row?.userId;
}
