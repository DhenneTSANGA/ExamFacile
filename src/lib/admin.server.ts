import { prisma } from "@/lib/prisma.server";
import { requireSessionUserId } from "@/lib/session.server";

export async function requireAdminUserId(): Promise<string> {
  const userId = requireSessionUserId();
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
  if (!user || user.role !== "ADMIN") {
    throw new Error("Accès réservé aux administrateurs.");
  }
  return userId;
}

export async function isAdminUser(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
  return user?.role === "ADMIN";
}
