import { getSessionUserId } from "@/lib/session.server";

export type ApiErrorBody = { error: string; details?: unknown };

export function jsonOk<T>(data: T, status = 200) {
  return Response.json(data, { status });
}

export function jsonError(message: string, status = 400, details?: unknown) {
  return Response.json({ error: message, details } satisfies ApiErrorBody, { status });
}

export function jsonNoContent() {
  return new Response(null, { status: 204 });
}

export async function parseJson<T = Record<string, unknown>>(request: Request): Promise<T | null> {
  try {
    return (await request.json()) as T;
  } catch {
    return null;
  }
}

export function requireApiAuth(): string | Response {
  const userId = getSessionUserId();
  if (!userId) return jsonError("Authentification requise.", 401);
  return userId;
}

/** Restreint l'accès aux données de l'utilisateur connecté. */
export function resolveScopedUserId(request: Request, bodyUserId?: string): string | Response {
  const auth = requireApiAuth();
  if (auth instanceof Response) return auth;
  const queryUserId = getSearchParam(request, "userId");
  const target = bodyUserId ?? queryUserId ?? auth;
  if (target !== auth) return jsonError("Accès non autorisé.", 403);
  return auth;
}

export function assertResourceOwner(ownerUserId: string | undefined, sessionUserId: string): Response | null {
  if (!ownerUserId) return jsonError("Ressource introuvable.", 404);
  if (ownerUserId !== sessionUserId) return jsonError("Accès non autorisé.", 403);
  return null;
}

export function handleApiError(error: unknown) {
  if (error instanceof Response) return error;
  if (error instanceof Error) {
    if (error.message.includes("Unique constraint")) {
      return jsonError("Cet enregistrement existe déjà.", 409);
    }
    if (error.message.includes("Foreign key constraint")) {
      return jsonError("Référence invalide (relation introuvable).", 400);
    }
    if (error.message.includes("Record to update not found") || error.message.includes("Record to delete does not exist")) {
      return jsonError("Ressource introuvable.", 404);
    }
    return jsonError(error.message, 400);
  }
  return jsonError("Erreur serveur.", 500);
}

export function getSearchParam(request: Request, key: string): string | undefined {
  const value = new URL(request.url).searchParams.get(key);
  return value && value.length > 0 ? value : undefined;
}
