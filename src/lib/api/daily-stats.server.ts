import { prisma } from "@/lib/prisma.server";

export type DailyStatInput = {
  userId: string;
  date: string;
  points?: number;
  minutes?: number;
};

export async function listDailyStats(filters?: { userId?: string; from?: string; to?: string }) {
  const dateFilter =
    filters?.from || filters?.to
      ? {
          gte: filters.from ? new Date(filters.from) : undefined,
          lte: filters.to ? new Date(filters.to) : undefined,
        }
      : undefined;

  return prisma.dailyStat.findMany({
    where: {
      userId: filters?.userId,
      date: dateFilter,
    },
    include: { user: { select: { id: true, name: true } } },
    orderBy: { date: "desc" },
  });
}

export async function getDailyStat(id: string) {
  return prisma.dailyStat.findUnique({
    where: { id },
    include: { user: { select: { id: true, name: true } } },
  });
}

export async function createDailyStat(data: DailyStatInput) {
  return prisma.dailyStat.create({
    data: {
      userId: data.userId,
      date: new Date(data.date),
      points: data.points ?? 0,
      minutes: data.minutes ?? 0,
    },
  });
}

export async function updateDailyStat(id: string, data: Partial<Omit<DailyStatInput, "userId" | "date">>) {
  return prisma.dailyStat.update({ where: { id }, data });
}

export async function deleteDailyStat(id: string) {
  return prisma.dailyStat.delete({ where: { id } });
}

export async function getDailyStatOwnerUserId(id: string) {
  const row = await prisma.dailyStat.findUnique({ where: { id }, select: { userId: true } });
  return row?.userId;
}
