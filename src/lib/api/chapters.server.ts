import { prisma } from "@/lib/prisma.server";

export type ChapterInput = {
  id: string;
  subjectId: string;
  title: string;
  duration: number;
  sortOrder?: number;
};

export async function listChapters(subjectId?: string) {
  return prisma.chapter.findMany({
    where: subjectId ? { subjectId } : undefined,
    orderBy: [{ subjectId: "asc" }, { sortOrder: "asc" }],
    include: {
      subject: { select: { id: true, name: true } },
      _count: { select: { questions: true } },
    },
  });
}

export async function getChapter(id: string, detailed = false) {
  return prisma.chapter.findUnique({
    where: { id },
    include: detailed
      ? {
          subject: true,
          lesson: { include: { sections: { orderBy: { sortOrder: "asc" } } } },
          studyGuide: { include: { definitions: { orderBy: { sortOrder: "asc" } } } },
          questions: { orderBy: { sortOrder: "asc" } },
        }
      : {
          subject: { select: { id: true, name: true } },
          _count: { select: { questions: true } },
        },
  });
}

export async function createChapter(data: ChapterInput) {
  return prisma.chapter.create({
    data: {
      id: data.id,
      subjectId: data.subjectId,
      title: data.title,
      duration: data.duration,
      sortOrder: data.sortOrder ?? 0,
    },
  });
}

export async function updateChapter(id: string, data: Partial<Omit<ChapterInput, "id">>) {
  return prisma.chapter.update({
    where: { id },
    data,
  });
}

export async function deleteChapter(id: string) {
  return prisma.chapter.delete({ where: { id } });
}
