import { createFileRoute } from "@tanstack/react-router";
import {
  getSearchParam,
  handleApiError,
  jsonError,
  jsonOk,
  parseJson,
  resolveScopedUserId,
} from "@/lib/api/helpers.server";
import {
  createUserBadge,
  listUserBadges,
  type UserBadgeInput,
} from "@/lib/api/user-badges.server";

export const Route = createFileRoute("/api/user-badges")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const userId = resolveScopedUserId(request);
          if (userId instanceof Response) return userId;

          const badgeId = getSearchParam(request, "badgeId");
          const badges = await listUserBadges({ userId, badgeId });
          return jsonOk(badges);
        } catch (error) {
          return handleApiError(error);
        }
      },
      POST: async ({ request }) => {
        try {
          const body = await parseJson<UserBadgeInput>(request);
          if (!body?.userId || !body.badgeId) {
            return jsonError("Champs requis : userId, badgeId.", 422);
          }

          const userId = resolveScopedUserId(request, body.userId);
          if (userId instanceof Response) return userId;

          const userBadge = await createUserBadge(body);
          return jsonOk(userBadge, 201);
        } catch (error) {
          return handleApiError(error);
        }
      },
    },
  },
});
