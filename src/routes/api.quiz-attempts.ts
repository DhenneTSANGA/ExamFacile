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
  createQuizAttempt,
  listQuizAttempts,
  type QuizAttemptInput,
} from "@/lib/api/quiz-attempts.server";

export const Route = createFileRoute("/api/quiz-attempts")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const userId = resolveScopedUserId(request);
          if (userId instanceof Response) return userId;

          const chapterId = getSearchParam(request, "chapterId");
          const attempts = await listQuizAttempts({ userId, chapterId });
          return jsonOk(attempts);
        } catch (error) {
          return handleApiError(error);
        }
      },
      POST: async ({ request }) => {
        try {
          const body = await parseJson<QuizAttemptInput>(request);
          if (!body?.userId || !body.chapterId || body.score == null || body.totalQuestions == null || body.timeSeconds == null) {
            return jsonError("Champs requis : userId, chapterId, score, totalQuestions, timeSeconds.", 422);
          }

          const userId = resolveScopedUserId(request, body.userId);
          if (userId instanceof Response) return userId;

          const attempt = await createQuizAttempt(body);
          return jsonOk(attempt, 201);
        } catch (error) {
          return handleApiError(error);
        }
      },
    },
  },
});
