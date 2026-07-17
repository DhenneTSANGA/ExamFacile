import { createFileRoute } from "@tanstack/react-router";
import {
  handleApiError,
  jsonError,
  jsonNoContent,
  jsonOk,
  parseJson,
  requireApiAuth,
} from "@/lib/api/helpers.server";
import { deleteLesson, getLesson, updateLesson, type LessonInput } from "@/lib/api/lessons.server";

export const Route = createFileRoute("/api/lessons/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        try {
          const lesson = await getLesson(params.id);
          if (!lesson) return jsonError("Leçon introuvable.", 404);
          return jsonOk(lesson);
        } catch (error) {
          return handleApiError(error);
        }
      },
      PUT: async ({ params, request }) => {
        try {
          const auth = requireApiAuth();
          if (auth instanceof Response) return auth;

          const body = await parseJson<Partial<LessonInput>>(request);
          if (!body) return jsonError("Corps JSON invalide.", 422);

          const lesson = await updateLesson(params.id, body);
          return jsonOk(lesson);
        } catch (error) {
          return handleApiError(error);
        }
      },
      PATCH: async ({ params, request }) => {
        try {
          const auth = requireApiAuth();
          if (auth instanceof Response) return auth;

          const body = await parseJson<Partial<LessonInput>>(request);
          if (!body) return jsonError("Corps JSON invalide.", 422);

          const lesson = await updateLesson(params.id, body);
          return jsonOk(lesson);
        } catch (error) {
          return handleApiError(error);
        }
      },
      DELETE: async ({ params }) => {
        try {
          const auth = requireApiAuth();
          if (auth instanceof Response) return auth;

          await deleteLesson(params.id);
          return jsonNoContent();
        } catch (error) {
          return handleApiError(error);
        }
      },
    },
  },
});
