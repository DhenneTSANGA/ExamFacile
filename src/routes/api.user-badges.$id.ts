import { createFileRoute } from "@tanstack/react-router";
import {
  assertResourceOwner,
  handleApiError,
  jsonError,
  jsonNoContent,
  jsonOk,
  parseJson,
  requireApiAuth,
  resolveScopedUserId,
} from "@/lib/api/helpers.server";
import {
  deleteUserBadge,
  getUserBadge,
  getUserBadgeOwnerUserId,
  updateUserBadge,
  type UserBadgeInput,
} from "@/lib/api/user-badges.server";

export const Route = createFileRoute("/api/user-badges/$id")({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        try {
          const userId = resolveScopedUserId(request);
          if (userId instanceof Response) return userId;

          const userBadge = await getUserBadge(params.id);
          if (!userBadge) return jsonError("Badge utilisateur introuvable.", 404);

          const denied = assertResourceOwner(userBadge.userId, userId);
          if (denied) return denied;

          return jsonOk(userBadge);
        } catch (error) {
          return handleApiError(error);
        }
      },
      PUT: async ({ params, request }) => {
        try {
          const auth = requireApiAuth();
          if (auth instanceof Response) return auth;

          const ownerId = await getUserBadgeOwnerUserId(params.id);
          const denied = assertResourceOwner(ownerId, auth);
          if (denied) return denied;

          const body = await parseJson<Partial<Omit<UserBadgeInput, "userId" | "badgeId">>>(request);
          if (!body) return jsonError("Corps JSON invalide.", 422);

          const userBadge = await updateUserBadge(params.id, body);
          return jsonOk(userBadge);
        } catch (error) {
          return handleApiError(error);
        }
      },
      PATCH: async ({ params, request }) => {
        try {
          const auth = requireApiAuth();
          if (auth instanceof Response) return auth;

          const ownerId = await getUserBadgeOwnerUserId(params.id);
          const denied = assertResourceOwner(ownerId, auth);
          if (denied) return denied;

          const body = await parseJson<Partial<Omit<UserBadgeInput, "userId" | "badgeId">>>(request);
          if (!body) return jsonError("Corps JSON invalide.", 422);

          const userBadge = await updateUserBadge(params.id, body);
          return jsonOk(userBadge);
        } catch (error) {
          return handleApiError(error);
        }
      },
      DELETE: async ({ params }) => {
        try {
          const auth = requireApiAuth();
          if (auth instanceof Response) return auth;

          const ownerId = await getUserBadgeOwnerUserId(params.id);
          const denied = assertResourceOwner(ownerId, auth);
          if (denied) return denied;

          await deleteUserBadge(params.id);
          return jsonNoContent();
        } catch (error) {
          return handleApiError(error);
        }
      },
    },
  },
});
