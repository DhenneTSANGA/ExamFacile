import { createFileRoute } from "@tanstack/react-router";
import {
  getSearchParam,
  handleApiError,
  jsonError,
  jsonNoContent,
  jsonOk,
  parseJson,
  requireApiAuth,
} from "@/lib/api/helpers.server";
import {
  deleteChapter,
  getChapter,
  updateChapter,
  type ChapterInput,
} from "@/lib/api/chapters.server";

export const Route = createFileRoute("/api/chapters/$id")({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        try {
          const detailed = getSearchParam(request, "include") === "all";
          const chapter = await getChapter(params.id, detailed);
          if (!chapter) return jsonError("Chapitre introuvable.", 404);
          return jsonOk(chapter);
        } catch (error) {
          return handleApiError(error);
        }
      },
      PUT: async ({ params, request }) => {
        try {
          const auth = requireApiAuth();
          if (auth instanceof Response) return auth;

          const body = await parseJson<Partial<Omit<ChapterInput, "id">>>(request);
          if (!body) return jsonError("Corps JSON invalide.", 422);

          const chapter = await updateChapter(params.id, body);
          return jsonOk(chapter);
        } catch (error) {
          return handleApiError(error);
        }
      },
      PATCH: async ({ params, request }) => {
        try {
          const auth = requireApiAuth();
          if (auth instanceof Response) return auth;

          const body = await parseJson<Partial<Omit<ChapterInput, "id">>>(request);
          if (!body) return jsonError("Corps JSON invalide.", 422);

          const chapter = await updateChapter(params.id, body);
          return jsonOk(chapter);
        } catch (error) {
          return handleApiError(error);
        }
      },
      DELETE: async ({ params }) => {
        try {
          const auth = requireApiAuth();
          if (auth instanceof Response) return auth;

          await deleteChapter(params.id);
          return jsonNoContent();
        } catch (error) {
          return handleApiError(error);
        }
      },
    },
  },
});
