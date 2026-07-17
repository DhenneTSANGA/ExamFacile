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
  createChapter,
  listChapters,
  type ChapterInput,
} from "@/lib/api/chapters.server";

export const Route = createFileRoute("/api/chapters")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const subjectId = getSearchParam(request, "subjectId");
          const chapters = await listChapters(subjectId);
          return jsonOk(chapters);
        } catch (error) {
          return handleApiError(error);
        }
      },
      POST: async ({ request }) => {
        try {
          const auth = requireApiAuth();
          if (auth instanceof Response) return auth;

          const body = await parseJson<ChapterInput>(request);
          if (!body?.id || !body.subjectId || !body.title || body.duration == null) {
            return jsonError("Champs requis : id, subjectId, title, duration.", 422);
          }

          const chapter = await createChapter(body);
          return jsonOk(chapter, 201);
        } catch (error) {
          return handleApiError(error);
        }
      },
    },
  },
});
