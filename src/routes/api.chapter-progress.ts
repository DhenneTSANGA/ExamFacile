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
  createChapterProgress,
  listChapterProgress,
  type ChapterProgressInput,
} from "@/lib/api/chapter-progress.server";

export const Route = createFileRoute("/api/chapter-progress")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const userId = resolveScopedUserId(request);
          if (userId instanceof Response) return userId;

          const chapterId = getSearchParam(request, "chapterId");
          const progress = await listChapterProgress({ userId, chapterId });
          return jsonOk(progress);
        } catch (error) {
          return handleApiError(error);
        }
      },
      POST: async ({ request }) => {
        try {
          const body = await parseJson<ChapterProgressInput>(request);
          if (!body?.userId || !body.chapterId) {
            return jsonError("Champs requis : userId, chapterId.", 422);
          }

          const userId = resolveScopedUserId(request, body.userId);
          if (userId instanceof Response) return userId;

          const progress = await createChapterProgress(body);
          return jsonOk(progress, 201);
        } catch (error) {
          return handleApiError(error);
        }
      },
    },
  },
});
