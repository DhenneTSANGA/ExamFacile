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
  createActivity,
  listActivities,
  type ActivityInput,
} from "@/lib/api/activities.server";

export const Route = createFileRoute("/api/activities")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const userId = resolveScopedUserId(request);
          if (userId instanceof Response) return userId;

          const type = getSearchParam(request, "type");
          const activities = await listActivities({ userId, type });
          return jsonOk(activities);
        } catch (error) {
          return handleApiError(error);
        }
      },
      POST: async ({ request }) => {
        try {
          const body = await parseJson<ActivityInput>(request);
          if (!body?.userId || !body.type || !body.title) {
            return jsonError("Champs requis : userId, type, title.", 422);
          }

          const userId = resolveScopedUserId(request, body.userId);
          if (userId instanceof Response) return userId;

          const activity = await createActivity(body);
          return jsonOk(activity, 201);
        } catch (error) {
          return handleApiError(error);
        }
      },
    },
  },
});
