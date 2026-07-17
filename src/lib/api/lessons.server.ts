import { prisma } from "@/lib/prisma.server";

export type LessonInput = {
  chapterId: string;
  readingTime: number;
  intro: string;
  summary: string;
};

export async function listLessons(chapterId?: string) {
  return prisma.lesson.findMany({
    where: chapterId ? { chapterId } : undefined,
    include: {
      chapter: { select: { id: true, title: true, subjectId: true } },
      sections: { orderBy: { sortOrder: "asc" } },
    },
    orderBy: { createdAt: "asc" },
  });
}

export async function getLesson(id: string) {
  return prisma.lesson.findUnique({
    where: { id },
    include: {
      chapter: { select: { id: true, title: true, subjectId: true } },
      sections: { orderBy: { sortOrder: "asc" } },
    },
  });
}

export async function createLesson(data: LessonInput) {
  return prisma.lesson.create({
    data: {
      chapterId: data.chapterId,
      readingTime: data.readingTime,
      intro: data.intro,
      summary: data.summary,
    },
    include: { sections: true },
  });
}

export async function updateLesson(id: string, data: Partial<LessonInput>) {
  return prisma.lesson.update({
    where: { id },
    data,
    include: { sections: { orderBy: { sortOrder: "asc" } } },
  });
}

export async function deleteLesson(id: string) {
  return prisma.lesson.delete({ where: { id } });
}
