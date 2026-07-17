import { prisma } from "@/lib/prisma.server";

export type BadgeInput = {
  id: string;
  name: string;
  emoji: string;
  description: string;
  sortOrder?: number;
};

export async function listBadges() {
  return prisma.badge.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { userBadges: true } } },
  });
}

export async function getBadge(id: string) {
  return prisma.badge.findUnique({
    where: { id },
    include: { _count: { select: { userBadges: true } } },
  });
}

export async function createBadge(data: BadgeInput) {
  return prisma.badge.create({
    data: {
      id: data.id,
      name: data.name,
      emoji: data.emoji,
      description: data.description,
      sortOrder: data.sortOrder ?? 0,
    },
  });
}

export async function updateBadge(id: string, data: Partial<Omit<BadgeInput, "id">>) {
  return prisma.badge.update({
    where: { id },
    data,
  });
}

export async function deleteBadge(id: string) {
  return prisma.badge.delete({ where: { id } });
}
