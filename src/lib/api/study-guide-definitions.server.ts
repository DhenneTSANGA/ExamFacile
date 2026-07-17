import { prisma } from "@/lib/prisma.server";

export type StudyGuideDefinitionInput = {
  studyGuideId: string;
  term: string;
  definition: string;
  sortOrder?: number;
};

export async function listStudyGuideDefinitions(studyGuideId?: string) {
  return prisma.studyGuideDefinition.findMany({
    where: studyGuideId ? { studyGuideId } : undefined,
    orderBy: [{ studyGuideId: "asc" }, { sortOrder: "asc" }],
    include: { studyGuide: { select: { id: true, chapterId: true } } },
  });
}

export async function getStudyGuideDefinition(id: string) {
  return prisma.studyGuideDefinition.findUnique({
    where: { id },
    include: { studyGuide: { select: { id: true, chapterId: true } } },
  });
}

export async function createStudyGuideDefinition(data: StudyGuideDefinitionInput) {
  return prisma.studyGuideDefinition.create({
    data: {
      studyGuideId: data.studyGuideId,
      term: data.term,
      definition: data.definition,
      sortOrder: data.sortOrder ?? 0,
    },
  });
}

export async function updateStudyGuideDefinition(id: string, data: Partial<Omit<StudyGuideDefinitionInput, "studyGuideId">>) {
  return prisma.studyGuideDefinition.update({ where: { id }, data });
}

export async function deleteStudyGuideDefinition(id: string) {
  return prisma.studyGuideDefinition.delete({ where: { id } });
}
