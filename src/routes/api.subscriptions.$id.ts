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
  deleteSubscription,
  getSubscription,
  updateSubscription,
  type SubscriptionInput,
} from "@/lib/api/subscriptions.server";

export const Route = createFileRoute("/api/subscriptions/$id")({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        try {
          const userId = resolveScopedUserId(request);
          if (userId instanceof Response) return userId;

          const subscription = await getSubscription(params.id);
          if (!subscription) return jsonError("Abonnement introuvable.", 404);

          const denied = assertResourceOwner(subscription.userId, userId);
          if (denied) return denied;

          return jsonOk(subscription);
        } catch (error) {
          return handleApiError(error);
        }
      },
      PUT: async ({ params, request }) => {
        try {
          const auth = requireApiAuth();
          if (auth instanceof Response) return auth;

          const existing = await getSubscription(params.id);
          if (!existing) return jsonError("Abonnement introuvable.", 404);
          const denied = assertResourceOwner(existing.userId, auth);
          if (denied) return denied;

          const body = await parseJson<Partial<Omit<SubscriptionInput, "userId">>>(request);
          if (!body) return jsonError("Corps JSON invalide.", 422);

          const subscription = await updateSubscription(params.id, body);
          return jsonOk(subscription);
        } catch (error) {
          return handleApiError(error);
        }
      },
      PATCH: async ({ params, request }) => {
        try {
          const auth = requireApiAuth();
          if (auth instanceof Response) return auth;

          const existing = await getSubscription(params.id);
          if (!existing) return jsonError("Abonnement introuvable.", 404);
          const denied = assertResourceOwner(existing.userId, auth);
          if (denied) return denied;

          const body = await parseJson<Partial<Omit<SubscriptionInput, "userId">>>(request);
          if (!body) return jsonError("Corps JSON invalide.", 422);

          const subscription = await updateSubscription(params.id, body);
          return jsonOk(subscription);
        } catch (error) {
          return handleApiError(error);
        }
      },
      DELETE: async ({ params, request }) => {
        try {
          const auth = requireApiAuth();
          if (auth instanceof Response) return auth;

          const existing = await getSubscription(params.id);
          if (!existing) return jsonError("Abonnement introuvable.", 404);
          const denied = assertResourceOwner(existing.userId, auth);
          if (denied) return denied;

          await deleteSubscription(params.id);
          return jsonNoContent();
        } catch (error) {
          return handleApiError(error);
        }
      },
    },
  },
});
