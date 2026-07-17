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
  deleteDailyStat,
  getDailyStat,
  getDailyStatOwnerUserId,
  updateDailyStat,
  type DailyStatInput,
} from "@/lib/api/daily-stats.server";

export const Route = createFileRoute("/api/daily-stats/$id")({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        try {
          const userId = resolveScopedUserId(request);
          if (userId instanceof Response) return userId;

          const stat = await getDailyStat(params.id);
          if (!stat) return jsonError("Statistique introuvable.", 404);

          const denied = assertResourceOwner(stat.userId, userId);
          if (denied) return denied;

          return jsonOk(stat);
        } catch (error) {
          return handleApiError(error);
        }
      },
      PUT: async ({ params, request }) => {
        try {
          const auth = requireApiAuth();
          if (auth instanceof Response) return auth;

          const ownerId = await getDailyStatOwnerUserId(params.id);
          const denied = assertResourceOwner(ownerId, auth);
          if (denied) return denied;

          const body = await parseJson<Partial<Omit<DailyStatInput, "userId" | "date">>>(request);
          if (!body) return jsonError("Corps JSON invalide.", 422);

          const stat = await updateDailyStat(params.id, body);
          return jsonOk(stat);
        } catch (error) {
          return handleApiError(error);
        }
      },
      PATCH: async ({ params, request }) => {
        try {
          const auth = requireApiAuth();
          if (auth instanceof Response) return auth;

          const ownerId = await getDailyStatOwnerUserId(params.id);
          const denied = assertResourceOwner(ownerId, auth);
          if (denied) return denied;

          const body = await parseJson<Partial<Omit<DailyStatInput, "userId" | "date">>>(request);
          if (!body) return jsonError("Corps JSON invalide.", 422);

          const stat = await updateDailyStat(params.id, body);
          return jsonOk(stat);
        } catch (error) {
          return handleApiError(error);
        }
      },
      DELETE: async ({ params }) => {
        try {
          const auth = requireApiAuth();
          if (auth instanceof Response) return auth;

          const ownerId = await getDailyStatOwnerUserId(params.id);
          const denied = assertResourceOwner(ownerId, auth);
          if (denied) return denied;

          await deleteDailyStat(params.id);
          return jsonNoContent();
        } catch (error) {
          return handleApiError(error);
        }
      },
    },
  },
});
