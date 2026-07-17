import { prisma } from "@/lib/prisma.server";

export type StudyGuideInput = {
  chapterId: string;
  keyConcepts: string[];
  examTips: string[];
  commonMistakes: string[];
  importantFacts: string[];
};

export async function listStudyGuides(chapterId?: string) {
  return prisma.studyGuide.findMany({
    where: chapterId ? { chapterId } : undefined,
    include: {
      chapter: { select: { id: true, title: true, subjectId: true } },
      definitions: { orderBy: { sortOrder: "asc" } },
    },
    orderBy: { createdAt: "asc" },
  });
}

export async function getStudyGuide(id: string) {
  return prisma.studyGuide.findUnique({
    where: { id },
    include: {
      chapter: { select: { id: true, title: true, subjectId: true } },
      definitions: { orderBy: { sortOrder: "asc" } },
    },
  });
}

export async function createStudyGuide(data: StudyGuideInput) {
  return prisma.studyGuide.create({
    data: {
      chapterId: data.chapterId,
      keyConcepts: data.keyConcepts,
      examTips: data.examTips,
      commonMistakes: data.commonMistakes,
      importantFacts: data.importantFacts,
    },
    include: { definitions: true },
  });
}

export async function updateStudyGuide(id: string, data: Partial<Omit<StudyGuideInput, "chapterId">>) {
  return prisma.studyGuide.update({
    where: { id },
    data,
    include: { definitions: { orderBy: { sortOrder: "asc" } } },
  });
}

export async function deleteStudyGuide(id: string) {
  return prisma.studyGuide.delete({ where: { id } });
}
