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
  assertQuizAttemptOwner,
  deleteQuizAttempt,
  getQuizAttempt,
  updateQuizAttempt,
} from "@/lib/api/quiz-attempts.server";

export const Route = createFileRoute("/api/quiz-attempts/$id")({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        try {
          const userId = resolveScopedUserId(request);
          if (userId instanceof Response) return userId;

          const attempt = await getQuizAttempt(params.id);
          if (!attempt) return jsonError("Tentative introuvable.", 404);

          const denied = assertResourceOwner(attempt.userId, userId);
          if (denied) return denied;

          return jsonOk(attempt);
        } catch (error) {
          return handleApiError(error);
        }
      },
      PUT: async ({ params, request }) => {
        try {
          const auth = requireApiAuth();
          if (auth instanceof Response) return auth;

          const owned = await assertQuizAttemptOwner(params.id, auth);
          if (!owned) return jsonError("Tentative introuvable.", 404);

          const body = await parseJson<{ score?: number; totalQuestions?: number; timeSeconds?: number }>(request);
          if (!body) return jsonError("Corps JSON invalide.", 422);

          const attempt = await updateQuizAttempt(params.id, body);
          return jsonOk(attempt);
        } catch (error) {
          return handleApiError(error);
        }
      },
      PATCH: async ({ params, request }) => {
        try {
          const auth = requireApiAuth();
          if (auth instanceof Response) return auth;

          const owned = await assertQuizAttemptOwner(params.id, auth);
          if (!owned) return jsonError("Tentative introuvable.", 404);

          const body = await parseJson<{ score?: number; totalQuestions?: number; timeSeconds?: number }>(request);
          if (!body) return jsonError("Corps JSON invalide.", 422);

          const attempt = await updateQuizAttempt(params.id, body);
          return jsonOk(attempt);
        } catch (error) {
          return handleApiError(error);
        }
      },
      DELETE: async ({ params, request }) => {
        try {
          const auth = requireApiAuth();
          if (auth instanceof Response) return auth;

          const owned = await assertQuizAttemptOwner(params.id, auth);
          if (!owned) return jsonError("Tentative introuvable.", 404);

          await deleteQuizAttempt(params.id);
          return jsonNoContent();
        } catch (error) {
          return handleApiError(error);
        }
      },
    },
  },
});
