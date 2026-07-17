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
  deleteQuizAnswer,
  getQuizAnswer,
  getQuizAnswerOwnerUserId,
  updateQuizAnswer,
  type QuizAnswerInput,
} from "@/lib/api/quiz-answers.server";

export const Route = createFileRoute("/api/quiz-answers/$id")({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        try {
          const userId = resolveScopedUserId(request);
          if (userId instanceof Response) return userId;

          const answer = await getQuizAnswer(params.id);
          if (!answer) return jsonError("Réponse introuvable.", 404);

          const denied = assertResourceOwner(answer.attempt.userId, userId);
          if (denied) return denied;

          return jsonOk(answer);
        } catch (error) {
          return handleApiError(error);
        }
      },
      PUT: async ({ params, request }) => {
        try {
          const auth = requireApiAuth();
          if (auth instanceof Response) return auth;

          const ownerId = await getQuizAnswerOwnerUserId(params.id);
          const denied = assertResourceOwner(ownerId, auth);
          if (denied) return denied;

          const body = await parseJson<Partial<Omit<QuizAnswerInput, "attemptId" | "questionId">>>(request);
          if (!body) return jsonError("Corps JSON invalide.", 422);

          const answer = await updateQuizAnswer(params.id, body);
          return jsonOk(answer);
        } catch (error) {
          return handleApiError(error);
        }
      },
      PATCH: async ({ params, request }) => {
        try {
          const auth = requireApiAuth();
          if (auth instanceof Response) return auth;

          const ownerId = await getQuizAnswerOwnerUserId(params.id);
          const denied = assertResourceOwner(ownerId, auth);
          if (denied) return denied;

          const body = await parseJson<Partial<Omit<QuizAnswerInput, "attemptId" | "questionId">>>(request);
          if (!body) return jsonError("Corps JSON invalide.", 422);

          const answer = await updateQuizAnswer(params.id, body);
          return jsonOk(answer);
        } catch (error) {
          return handleApiError(error);
        }
      },
      DELETE: async ({ params }) => {
        try {
          const auth = requireApiAuth();
          if (auth instanceof Response) return auth;

          const ownerId = await getQuizAnswerOwnerUserId(params.id);
          const denied = assertResourceOwner(ownerId, auth);
          if (denied) return denied;

          await deleteQuizAnswer(params.id);
          return jsonNoContent();
        } catch (error) {
          return handleApiError(error);
        }
      },
    },
  },
});
