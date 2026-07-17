import { createFileRoute } from "@tanstack/react-router";
import {
  handleApiError,
  jsonError,
  jsonOk,
  parseJson,
  requireApiAuth,
} from "@/lib/api/helpers.server";
import {
  createBadge,
  listBadges,
  type BadgeInput,
} from "@/lib/api/badges.server";

export const Route = createFileRoute("/api/badges")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const badges = await listBadges();
          return jsonOk(badges);
        } catch (error) {
          return handleApiError(error);
        }
      },
      POST: async ({ request }) => {
        try {
          const auth = requireApiAuth();
          if (auth instanceof Response) return auth;

          const body = await parseJson<BadgeInput>(request);
          if (!body?.id || !body.name || !body.emoji || !body.description) {
            return jsonError("Champs requis : id, name, emoji, description.", 422);
          }

          const badge = await createBadge(body);
          return jsonOk(badge, 201);
        } catch (error) {
          return handleApiError(error);
        }
      },
    },
  },
});
