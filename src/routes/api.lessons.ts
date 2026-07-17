import { createFileRoute } from "@tanstack/react-router";
import {
  getSearchParam,
  handleApiError,
  jsonError,
  jsonOk,
  parseJson,
  requireApiAuth,
} from "@/lib/api/helpers.server";
import { createLesson, listLessons, type LessonInput } from "@/lib/api/lessons.server";

export const Route = createFileRoute("/api/lessons")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const chapterId = getSearchParam(request, "chapterId");
          const lessons = await listLessons(chapterId);
          return jsonOk(lessons);
        } catch (error) {
          return handleApiError(error);
        }
      },
      POST: async ({ request }) => {
        try {
          const auth = requireApiAuth();
          if (auth instanceof Response) return auth;

          const body = await parseJson<LessonInput>(request);
          if (!body?.chapterId || body.readingTime == null || !body.intro || !body.summary) {
            return jsonError("Champs requis : chapterId, readingTime, intro, summary.", 422);
          }

          const lesson = await createLesson(body);
          return jsonOk(lesson, 201);
        } catch (error) {
          return handleApiError(error);
        }
      },
    },
  },
});
