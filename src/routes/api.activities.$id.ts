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
  deleteActivity,
  getActivity,
  getActivityOwnerUserId,
  updateActivity,
  type ActivityInput,
} from "@/lib/api/activities.server";

export const Route = createFileRoute("/api/activities/$id")({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        try {
          const userId = resolveScopedUserId(request);
          if (userId instanceof Response) return userId;

          const activity = await getActivity(params.id);
          if (!activity) return jsonError("Activité introuvable.", 404);

          const denied = assertResourceOwner(activity.userId, userId);
          if (denied) return denied;

          return jsonOk(activity);
        } catch (error) {
          return handleApiError(error);
        }
      },
      PUT: async ({ params, request }) => {
        try {
          const auth = requireApiAuth();
          if (auth instanceof Response) return auth;

          const ownerId = await getActivityOwnerUserId(params.id);
          const denied = assertResourceOwner(ownerId, auth);
          if (denied) return denied;

          const body = await parseJson<Partial<Omit<ActivityInput, "userId">>>(request);
          if (!body) return jsonError("Corps JSON invalide.", 422);

          const activity = await updateActivity(params.id, body);
          return jsonOk(activity);
        } catch (error) {
          return handleApiError(error);
        }
      },
      PATCH: async ({ params, request }) => {
        try {
          const auth = requireApiAuth();
          if (auth instanceof Response) return auth;

          const ownerId = await getActivityOwnerUserId(params.id);
          const denied = assertResourceOwner(ownerId, auth);
          if (denied) return denied;

          const body = await parseJson<Partial<Omit<ActivityInput, "userId">>>(request);
          if (!body) return jsonError("Corps JSON invalide.", 422);

          const activity = await updateActivity(params.id, body);
          return jsonOk(activity);
        } catch (error) {
          return handleApiError(error);
        }
      },
      DELETE: async ({ params }) => {
        try {
          const auth = requireApiAuth();
          if (auth instanceof Response) return auth;

          const ownerId = await getActivityOwnerUserId(params.id);
          const denied = assertResourceOwner(ownerId, auth);
          if (denied) return denied;

          await deleteActivity(params.id);
          return jsonNoContent();
        } catch (error) {
          return handleApiError(error);
        }
      },
    },
  },
});
