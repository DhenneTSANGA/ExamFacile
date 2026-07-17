import { createFileRoute } from "@tanstack/react-router";
import {
  handleApiError,
  jsonError,
  jsonNoContent,
  jsonOk,
  parseJson,
  requireApiAuth,
} from "@/lib/api/helpers.server";
import {
  deleteBadge,
  getBadge,
  updateBadge,
  type BadgeInput,
} from "@/lib/api/badges.server";

export const Route = createFileRoute("/api/badges/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        try {
          const badge = await getBadge(params.id);
          if (!badge) return jsonError("Badge introuvable.", 404);
          return jsonOk(badge);
        } catch (error) {
          return handleApiError(error);
        }
      },
      PUT: async ({ params, request }) => {
        try {
          const auth = requireApiAuth();
          if (auth instanceof Response) return auth;

          const body = await parseJson<Partial<Omit<BadgeInput, "id">>>(request);
          if (!body) return jsonError("Corps JSON invalide.", 422);

          const badge = await updateBadge(params.id, body);
          return jsonOk(badge);
        } catch (error) {
          return handleApiError(error);
        }
      },
      PATCH: async ({ params, request }) => {
        try {
          const auth = requireApiAuth();
          if (auth instanceof Response) return auth;

          const body = await parseJson<Partial<Omit<BadgeInput, "id">>>(request);
          if (!body) return jsonError("Corps JSON invalide.", 422);

          const badge = await updateBadge(params.id, body);
          return jsonOk(badge);
        } catch (error) {
          return handleApiError(error);
        }
      },
      DELETE: async ({ params }) => {
        try {
          const auth = requireApiAuth();
          if (auth instanceof Response) return auth;

          await deleteBadge(params.id);
          return jsonNoContent();
        } catch (error) {
          return handleApiError(error);
        }
      },
    },
  },
});
