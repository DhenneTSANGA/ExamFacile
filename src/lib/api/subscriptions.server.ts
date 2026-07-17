import { prisma } from "@/lib/prisma.server";

export type SubscriptionInput = {
  userId: string;
  plan?: "FREE" | "PREMIUM";
  status?: "ACTIVE" | "CANCELLED" | "EXPIRED";
  expiresAt?: string | null;
};

export async function listSubscriptions(userId?: string) {
  return prisma.subscription.findMany({
    where: userId ? { userId } : undefined,
    include: { user: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getSubscription(id: string) {
  return prisma.subscription.findUnique({
    where: { id },
    include: { user: { select: { id: true, name: true, email: true } } },
  });
}

export async function createSubscription(data: SubscriptionInput) {
  return prisma.subscription.create({
    data: {
      userId: data.userId,
      plan: data.plan ?? "FREE",
      status: data.status ?? "ACTIVE",
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
    },
    include: { user: { select: { id: true, name: true, email: true } } },
  });
}

export async function updateSubscription(id: string, data: Partial<Omit<SubscriptionInput, "userId">>) {
  return prisma.subscription.update({
    where: { id },
    data: {
      ...data,
      expiresAt: data.expiresAt === undefined ? undefined : data.expiresAt ? new Date(data.expiresAt) : null,
    },
    include: { user: { select: { id: true, name: true, email: true } } },
  });
}

export async function deleteSubscription(id: string) {
  return prisma.subscription.delete({ where: { id } });
}
