import { prisma } from "@/lib/prisma.server";

export type UserBadgeInput = {
  userId: string;
  badgeId: string;
  progress?: number;
  unlockedAt?: string | null;
};

export async function listUserBadges(filters?: { userId?: string; badgeId?: string }) {
  return prisma.userBadge.findMany({
    where: {
      userId: filters?.userId,
      badgeId: filters?.badgeId,
    },
    include: {
      badge: true,
      user: { select: { id: true, name: true } },
    },
    orderBy: { badge: { sortOrder: "asc" } },
  });
}

export async function getUserBadge(id: string) {
  return prisma.userBadge.findUnique({
    where: { id },
    include: { badge: true, user: { select: { id: true, name: true } } },
  });
}

export async function createUserBadge(data: UserBadgeInput) {
  return prisma.userBadge.create({
    data: {
      userId: data.userId,
      badgeId: data.badgeId,
      progress: data.progress ?? 0,
      unlockedAt: data.unlockedAt ? new Date(data.unlockedAt) : null,
    },
    include: { badge: true },
  });
}

export async function updateUserBadge(id: string, data: Partial<Omit<UserBadgeInput, "userId" | "badgeId">>) {
  return prisma.userBadge.update({
    where: { id },
    data: {
      ...data,
      unlockedAt: data.unlockedAt === undefined ? undefined : data.unlockedAt ? new Date(data.unlockedAt) : null,
    },
    include: { badge: true },
  });
}

export async function deleteUserBadge(id: string) {
  return prisma.userBadge.delete({ where: { id } });
}

export async function getUserBadgeOwnerUserId(id: string) {
  const row = await prisma.userBadge.findUnique({ where: { id }, select: { userId: true } });
  return row?.userId;
}
