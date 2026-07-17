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
  createQuizAnswer,
  listQuizAnswers,
  type QuizAnswerInput,
} from "@/lib/api/quiz-answers.server";
import { assertQuizAttemptOwner } from "@/lib/api/quiz-attempts.server";

export const Route = createFileRoute("/api/quiz-answers")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const userId = resolveScopedUserId(request);
          if (userId instanceof Response) return userId;

          const attemptId = getSearchParam(request, "attemptId");
          const questionId = getSearchParam(request, "questionId");

          if (attemptId) {
            const owned = await assertQuizAttemptOwner(attemptId, userId);
            if (!owned) return jsonError("Tentative introuvable.", 404);
          }

          const answers = await listQuizAnswers({ attemptId, questionId });
          const filtered = attemptId ? answers : answers.filter((a) => a.attempt.userId === userId);
          return jsonOk(filtered);
        } catch (error) {
          return handleApiError(error);
        }
      },
      POST: async ({ request }) => {
        try {
          const auth = requireApiAuth();
          if (auth instanceof Response) return auth;

          const body = await parseJson<QuizAnswerInput>(request);
          if (!body?.attemptId || !body.questionId || body.selectedIndex == null || body.isCorrect == null) {
            return jsonError("Champs requis : attemptId, questionId, selectedIndex, isCorrect.", 422);
          }

          const owned = await assertQuizAttemptOwner(body.attemptId, auth);
          if (!owned) return jsonError("Tentative introuvable.", 404);

          const answer = await createQuizAnswer(body);
          return jsonOk(answer, 201);
        } catch (error) {
          return handleApiError(error);
        }
      },
    },
  },
});
