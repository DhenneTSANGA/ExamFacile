import { prisma } from "@/lib/prisma.server";

export type LessonSectionInput = {
  lessonId: string;
  heading: string;
  body: string;
  sortOrder?: number;
};

export async function listLessonSections(lessonId?: string) {
  return prisma.lessonSection.findMany({
    where: lessonId ? { lessonId } : undefined,
    orderBy: [{ lessonId: "asc" }, { sortOrder: "asc" }],
    include: { lesson: { select: { id: true, chapterId: true } } },
  });
}

export async function getLessonSection(id: string) {
  return prisma.lessonSection.findUnique({
    where: { id },
    include: { lesson: { select: { id: true, chapterId: true } } },
  });
}

export async function createLessonSection(data: LessonSectionInput) {
  return prisma.lessonSection.create({
    data: {
      lessonId: data.lessonId,
      heading: data.heading,
      body: data.body,
      sortOrder: data.sortOrder ?? 0,
    },
  });
}

export async function updateLessonSection(id: string, data: Partial<Omit<LessonSectionInput, "lessonId">>) {
  return prisma.lessonSection.update({ where: { id }, data });
}

export async function deleteLessonSection(id: string) {
  return prisma.lessonSection.delete({ where: { id } });
}
