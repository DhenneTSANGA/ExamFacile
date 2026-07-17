import { createFileRoute } from "@tanstack/react-router";
import {
  handleApiError,
  jsonError,
  jsonNoContent,
  jsonOk,
  parseJson,
  requireApiAuth,
} from "@/lib/api/helpers.server";
import {
  deleteQuestion,
  getQuestion,
  updateQuestion,
  type QuestionInput,
} from "@/lib/api/questions.server";

export const Route = createFileRoute("/api/questions/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        try {
          const question = await getQuestion(params.id);
          if (!question) return jsonError("Question introuvable.", 404);
          return jsonOk(question);
        } catch (error) {
          return handleApiError(error);
        }
      },
      PUT: async ({ params, request }) => {
        try {
          const auth = requireApiAuth();
          if (auth instanceof Response) return auth;

          const body = await parseJson<Partial<Omit<QuestionInput, "chapterId">>>(request);
          if (!body) return jsonError("Corps JSON invalide.", 422);

          const question = await updateQuestion(params.id, body);
          return jsonOk(question);
        } catch (error) {
          return handleApiError(error);
        }
      },
      PATCH: async ({ params, request }) => {
        try {
          const auth = requireApiAuth();
          if (auth instanceof Response) return auth;

          const body = await parseJson<Partial<Omit<QuestionInput, "chapterId">>>(request);
          if (!body) return jsonError("Corps JSON invalide.", 422);

          const question = await updateQuestion(params.id, body);
          return jsonOk(question);
        } catch (error) {
          return handleApiError(error);
        }
      },
      DELETE: async ({ params }) => {
        try {
          const auth = requireApiAuth();
          if (auth instanceof Response) return auth;

          await deleteQuestion(params.id);
          return jsonNoContent();
        } catch (error) {
          return handleApiError(error);
        }
      },
    },
  },
});
