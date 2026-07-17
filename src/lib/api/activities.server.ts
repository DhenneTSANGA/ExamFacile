import { prisma } from "@/lib/prisma.server";

export type ActivityInput = {
  userId: string;
  type: "QUIZ" | "LESSON" | "BADGE" | "CHAPTER";
  title: string;
  detail?: string | null;
  icon?: string | null;
  metadata?: Record<string, unknown> | null;
};

export async function listActivities(filters?: { userId?: string; type?: string }) {
  return prisma.activity.findMany({
    where: {
      userId: filters?.userId,
      type: filters?.type as "QUIZ" | "LESSON" | "BADGE" | "CHAPTER" | undefined,
    },
    include: { user: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getActivity(id: string) {
  return prisma.activity.findUnique({
    where: { id },
    include: { user: { select: { id: true, name: true } } },
  });
}

export async function createActivity(data: ActivityInput) {
  return prisma.activity.create({
    data: {
      userId: data.userId,
      type: data.type,
      title: data.title,
      detail: data.detail ?? null,
      icon: data.icon ?? null,
      metadata: data.metadata ?? undefined,
    },
  });
}

export async function updateActivity(id: string, data: Partial<Omit<ActivityInput, "userId">>) {
  return prisma.activity.update({ where: { id }, data });
}

export async function deleteActivity(id: string) {
  return prisma.activity.delete({ where: { id } });
}

export async function getActivityOwnerUserId(id: string) {
  const row = await prisma.activity.findUnique({ where: { id }, select: { userId: true } });
  return row?.userId;
}
