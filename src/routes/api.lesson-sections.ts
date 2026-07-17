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
  createLessonSection,
  listLessonSections,
  type LessonSectionInput,
} from "@/lib/api/lesson-sections.server";

export const Route = createFileRoute("/api/lesson-sections")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const lessonId = getSearchParam(request, "lessonId");
          const sections = await listLessonSections(lessonId);
          return jsonOk(sections);
        } catch (error) {
          return handleApiError(error);
        }
      },
      POST: async ({ request }) => {
        try {
          const auth = requireApiAuth();
          if (auth instanceof Response) return auth;

          const body = await parseJson<LessonSectionInput>(request);
          if (!body?.lessonId || !body.heading || !body.body) {
            return jsonError("Champs requis : lessonId, heading, body.", 422);
          }

          const section = await createLessonSection(body);
          return jsonOk(section, 201);
        } catch (error) {
          return handleApiError(error);
        }
      },
    },
  },
});
