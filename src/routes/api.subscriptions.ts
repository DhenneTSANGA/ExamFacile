import { createFileRoute } from "@tanstack/react-router";
import {
  getSearchParam,
  handleApiError,
  jsonError,
  jsonOk,
  parseJson,
  requireApiAuth,
  resolveScopedUserId,
} from "@/lib/api/helpers.server";
import {
  createSubscription,
  listSubscriptions,
  type SubscriptionInput,
} from "@/lib/api/subscriptions.server";

export const Route = createFileRoute("/api/subscriptions")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const userId = resolveScopedUserId(request);
          if (userId instanceof Response) return userId;
          const subscriptions = await listSubscriptions(userId);
          return jsonOk(subscriptions);
        } catch (error) {
          return handleApiError(error);
        }
      },
      POST: async ({ request }) => {
        try {
          const body = await parseJson<SubscriptionInput>(request);
          if (!body?.userId) return jsonError("Champ requis : userId.", 422);

          const userId = resolveScopedUserId(request, body.userId);
          if (userId instanceof Response) return userId;

          const subscription = await createSubscription(body);
          return jsonOk(subscription, 201);
        } catch (error) {
          return handleApiError(error);
        }
      },
    },
  },
});
