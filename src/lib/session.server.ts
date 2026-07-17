import { getCookie, setCookie, deleteCookie } from "@tanstack/react-start/server";

export const SESSION_COOKIE = "examfacile-session";

export function getSessionUserId(): string | undefined {
  return getCookie(SESSION_COOKIE) ?? undefined;
}

export function setSessionUserId(userId: string) {
  setCookie(SESSION_COOKIE, userId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export function clearSession() {
  deleteCookie(SESSION_COOKIE, { path: "/" });
}

export function requireSessionUserId(): string {
  const userId = getSessionUserId();
  if (!userId) throw new Error("Non authentifié");
  return userId;
}
