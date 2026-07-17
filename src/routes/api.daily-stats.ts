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
  createDailyStat,
  listDailyStats,
  type DailyStatInput,
} from "@/lib/api/daily-stats.server";

export const Route = createFileRoute("/api/daily-stats")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const userId = resolveScopedUserId(request);
          if (userId instanceof Response) return userId;

          const from = getSearchParam(request, "from");
          const to = getSearchParam(request, "to");
          const stats = await listDailyStats({ userId, from, to });
          return jsonOk(stats);
        } catch (error) {
          return handleApiError(error);
        }
      },
      POST: async ({ request }) => {
        try {
          const body = await parseJson<DailyStatInput>(request);
          if (!body?.userId || !body.date) {
            return jsonError("Champs requis : userId, date.", 422);
          }

          const userId = resolveScopedUserId(request, body.userId);
          if (userId instanceof Response) return userId;

          const stat = await createDailyStat(body);
          return jsonOk(stat, 201);
        } catch (error) {
          return handleApiError(error);
        }
      },
    },
  },
});
