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
  deleteLessonSection,
  getLessonSection,
  updateLessonSection,
  type LessonSectionInput,
} from "@/lib/api/lesson-sections.server";

export const Route = createFileRoute("/api/lesson-sections/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        try {
          const section = await getLessonSection(params.id);
          if (!section) return jsonError("Section introuvable.", 404);
          return jsonOk(section);
        } catch (error) {
          return handleApiError(error);
        }
      },
      PUT: async ({ params, request }) => {
        try {
          const auth = requireApiAuth();
          if (auth instanceof Response) return auth;

          const body = await parseJson<Partial<Omit<LessonSectionInput, "lessonId">>>(request);
          if (!body) return jsonError("Corps JSON invalide.", 422);

          const section = await updateLessonSection(params.id, body);
          return jsonOk(section);
        } catch (error) {
          return handleApiError(error);
        }
      },
      PATCH: async ({ params, request }) => {
        try {
          const auth = requireApiAuth();
          if (auth instanceof Response) return auth;

          const body = await parseJson<Partial<Omit<LessonSectionInput, "lessonId">>>(request);
          if (!body) return jsonError("Corps JSON invalide.", 422);

          const section = await updateLessonSection(params.id, body);
          return jsonOk(section);
        } catch (error) {
          return handleApiError(error);
        }
      },
      DELETE: async ({ params }) => {
        try {
          const auth = requireApiAuth();
          if (auth instanceof Response) return auth;

          await deleteLessonSection(params.id);
          return jsonNoContent();
        } catch (error) {
          return handleApiError(error);
        }
      },
    },
  },
});
