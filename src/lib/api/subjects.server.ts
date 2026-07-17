import { prisma } from "@/lib/prisma.server";

export type SubjectInput = {
  id: string;
  name: string;
  icon: string;
  color: string;
  gradient: string;
  description: string;
  sortOrder?: number;
};

export async function listSubjects(includeChapters = false) {
  return prisma.subject.findMany({
    orderBy: { sortOrder: "asc" },
    include: includeChapters
      ? { chapters: { orderBy: { sortOrder: "asc" } }, _count: { select: { chapters: true } } }
      : { _count: { select: { chapters: true } } },
  });
}

export async function getSubject(id: string, includeChapters = false) {
  return prisma.subject.findUnique({
    where: { id },
    include: includeChapters
      ? { chapters: { orderBy: { sortOrder: "asc" } }, _count: { select: { chapters: true } } }
      : { _count: { select: { chapters: true } } },
  });
}

export async function createSubject(data: SubjectInput) {
  return prisma.subject.create({
    data: {
      id: data.id,
      name: data.name,
      icon: data.icon,
      color: data.color,
      gradient: data.gradient,
      description: data.description,
      sortOrder: data.sortOrder ?? 0,
    },
  });
}

export async function updateSubject(id: string, data: Partial<Omit<SubjectInput, "id">>) {
  return prisma.subject.update({
    where: { id },
    data,
  });
}

export async function deleteSubject(id: string) {
  return prisma.subject.delete({ where: { id } });
}
