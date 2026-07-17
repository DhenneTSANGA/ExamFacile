import { createServerFn } from "@tanstack/react-start";
import { prisma } from "@/lib/prisma.server";
import { hashPassword, verifyPassword } from "@/lib/password.server";
import { clearSession, getSessionUserId, requireSessionUserId, setSessionUserId } from "@/lib/session.server";
import type { UserProfile } from "@/types/app";

function toUserProfile(user: {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  series: string;
  level: number;
  points: number;
  streak: number;
  quizCompleted: number;
  subscription: { plan: string } | null;
}): UserProfile {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar || user.name.charAt(0).toUpperCase(),
    role: user.role === "ADMIN" ? "ADMIN" : "USER",
    series: user.series,
    level: user.level,
    points: user.points,
    streak: user.streak,
    quizCompleted: user.quizCompleted,
    plan: user.subscription?.plan === "PREMIUM" ? "PREMIUM" : "FREE",
  };
}

async function fetchUserProfile(userId: string): Promise<UserProfile | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { subscription: true },
  });
  return user ? toUserProfile(user) : null;
}

export const registerFn = createServerFn({ method: "POST" })
  .validator((data: { name: string; email: string; password: string; series?: string }) => data)
  .handler(async ({ data }) => {
    const existing = await prisma.user.findUnique({ where: { email: data.email.toLowerCase() } });
    if (existing) throw new Error("Un compte existe déjà avec cet e-mail.");

    const passwordHash = await hashPassword(data.password);
    const series = (data.series ?? "A1") as "A1" | "A2" | "C" | "D" | "E" | "F" | "G" | "H";

    const user = await prisma.user.create({
      data: {
        name: data.name.trim(),
        email: data.email.toLowerCase().trim(),
        passwordHash,
        avatar: data.name.trim().charAt(0).toUpperCase(),
        series,
        subscription: { create: { plan: "FREE", status: "ACTIVE" } },
      },
      include: { subscription: true },
    });

    const badges = await prisma.badge.findMany();
    if (badges.length > 0) {
      await prisma.userBadge.createMany({
        data: badges.map((b) => ({ userId: user.id, badgeId: b.id, progress: 0 })),
      });
    }

    setSessionUserId(user.id);
    return toUserProfile(user);
  });

export const loginFn = createServerFn({ method: "POST" })
  .validator((data: { email: string; password: string }) => data)
  .handler(async ({ data }) => {
    const user = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase().trim() },
      include: { subscription: true },
    });
    if (!user || !(await verifyPassword(data.password, user.passwordHash))) {
      throw new Error("E-mail ou mot de passe incorrect.");
    }
    setSessionUserId(user.id);
    return toUserProfile(user);
  });

export const logoutFn = createServerFn({ method: "POST" }).handler(async () => {
  clearSession();
  return { ok: true as const };
});

export const getCurrentUserFn = createServerFn({ method: "GET" }).handler(async () => {
  const userId = getSessionUserId();
  if (!userId) return null;
  return fetchUserProfile(userId);
});

export const updateProfileFn = createServerFn({ method: "POST" })
  .validator((data: { name: string; email: string; series: string }) => data)
  .handler(async ({ data }) => {
    const userId = requireSessionUserId();
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name.trim(),
        email: data.email.toLowerCase().trim(),
        series: data.series as "A1" | "A2" | "C" | "D" | "E" | "F" | "G" | "H",
        avatar: data.name.trim().charAt(0).toUpperCase(),
      },
      include: { subscription: true },
    });
    return toUserProfile(user);
  });

export const upgradePremiumFn = createServerFn({ method: "POST" }).handler(async () => {
  const userId = requireSessionUserId();
  const subscription = await prisma.subscription.upsert({
    where: { userId },
    update: { plan: "PREMIUM", status: "ACTIVE", expiresAt: new Date(Date.now() + 30 * 86_400_000) },
    create: { userId, plan: "PREMIUM", status: "ACTIVE", expiresAt: new Date(Date.now() + 30 * 86_400_000) },
  });
  return { plan: subscription.plan };
});
