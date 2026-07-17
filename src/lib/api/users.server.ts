import { prisma } from "@/lib/prisma.server";
import { hashPassword } from "@/lib/password.server";

const userSelect = {
  id: true,
  email: true,
  name: true,
  avatar: true,
  role: true,
  series: true,
  level: true,
  points: true,
  streak: true,
  quizCompleted: true,
  lastActiveAt: true,
  createdAt: true,
  updatedAt: true,
  subscription: { select: { plan: true, status: true, expiresAt: true } },
} as const;

export type UserInput = {
  email: string;
  password: string;
  name: string;
  avatar?: string;
  series?: string;
};

export type UserUpdateInput = {
  email?: string;
  password?: string;
  name?: string;
  avatar?: string;
  series?: string;
  level?: number;
  points?: number;
  streak?: number;
  quizCompleted?: number;
};

export async function listUsers() {
  return prisma.user.findMany({
    orderBy: { points: "desc" },
    select: userSelect,
  });
}

export async function getUser(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: userSelect,
  });
}

export async function createUser(data: UserInput) {
  const passwordHash = await hashPassword(data.password);
  return prisma.user.create({
    data: {
      email: data.email.toLowerCase().trim(),
      passwordHash,
      name: data.name.trim(),
      avatar: data.avatar ?? data.name.trim().charAt(0).toUpperCase(),
      series: (data.series ?? "A1") as "A1" | "A2" | "C" | "D" | "E" | "F" | "G" | "H",
      subscription: { create: { plan: "FREE", status: "ACTIVE" } },
    },
    select: userSelect,
  });
}

export async function updateUser(id: string, data: UserUpdateInput) {
  const { password, series, ...rest } = data;
  const updateData: Record<string, unknown> = { ...rest };

  if (data.email) updateData.email = data.email.toLowerCase().trim();
  if (data.name) updateData.name = data.name.trim();
  if (series) updateData.series = series;
  if (password) updateData.passwordHash = await hashPassword(password);

  return prisma.user.update({
    where: { id },
    data: updateData,
    select: userSelect,
  });
}

export async function deleteUser(id: string) {
  return prisma.user.delete({ where: { id } });
}
