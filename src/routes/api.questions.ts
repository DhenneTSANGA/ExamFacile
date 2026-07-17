import { createFileRoute } from "@tanstack/react-router";
import {
  getSearchParam,
  handleApiError,
  jsonError,
  jsonOk,
  parseJson,
  requireApiAuth,
} from "@/lib/api/helpers.server";
import {
  createQuestion,
  listQuestions,
  type QuestionInput,
} from "@/lib/api/questions.server";

export const Route = createFileRoute("/api/questions")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const chapterId = getSearchParam(request, "chapterId");
          const questions = await listQuestions(chapterId);
          return jsonOk(questions);
        } catch (error) {
          return handleApiError(error);
        }
      },
      POST: async ({ request }) => {
        try {
          const auth = requireApiAuth();
          if (auth instanceof Response) return auth;

          const body = await parseJson<QuestionInput>(request);
          if (!body?.chapterId || !body.question || !body.options || body.correctIndex == null || !body.explanation) {
            return jsonError("Champs requis : chapterId, question, options, correctIndex, explanation.", 422);
          }

          const question = await createQuestion(body);
          return jsonOk(question, 201);
        } catch (error) {
          return handleApiError(error);
        }
      },
    },
  },
});
