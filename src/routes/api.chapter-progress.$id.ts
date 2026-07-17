import { createFileRoute } from "@tanstack/react-router";
import {
  assertResourceOwner,
  handleApiError,
  jsonError,
  jsonNoContent,
  jsonOk,
  parseJson,
  requireApiAuth,
  resolveScopedUserId,
} from "@/lib/api/helpers.server";
import {
  deleteChapterProgress,
  getChapterProgress,
  getChapterProgressOwnerUserId,
  updateChapterProgress,
  type ChapterProgressInput,
} from "@/lib/api/chapter-progress.server";

export const Route = createFileRoute("/api/chapter-progress/$id")({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        try {
          const userId = resolveScopedUserId(request);
          if (userId instanceof Response) return userId;

          const progress = await getChapterProgress(params.id);
          if (!progress) return jsonError("Progression introuvable.", 404);

          const denied = assertResourceOwner(progress.userId, userId);
          if (denied) return denied;

          return jsonOk(progress);
        } catch (error) {
          return handleApiError(error);
        }
      },
      PUT: async ({ params, request }) => {
        try {
          const auth = requireApiAuth();
          if (auth instanceof Response) return auth;

          const ownerId = await getChapterProgressOwnerUserId(params.id);
          const denied = assertResourceOwner(ownerId, auth);
          if (denied) return denied;

          const body = await parseJson<Partial<Omit<ChapterProgressInput, "userId" | "chapterId">>>(request);
          if (!body) return jsonError("Corps JSON invalide.", 422);

          const progress = await updateChapterProgress(params.id, body);
          return jsonOk(progress);
        } catch (error) {
          return handleApiError(error);
        }
      },
      PATCH: async ({ params, request }) => {
        try {
          const auth = requireApiAuth();
          if (auth instanceof Response) return auth;

          const ownerId = await getChapterProgressOwnerUserId(params.id);
          const denied = assertResourceOwner(ownerId, auth);
          if (denied) return denied;

          const body = await parseJson<Partial<Omit<ChapterProgressInput, "userId" | "chapterId">>>(request);
          if (!body) return jsonError("Corps JSON invalide.", 422);

          const progress = await updateChapterProgress(params.id, body);
          return jsonOk(progress);
        } catch (error) {
          return handleApiError(error);
        }
      },
      DELETE: async ({ params }) => {
        try {
          const auth = requireApiAuth();
          if (auth instanceof Response) return auth;

          const ownerId = await getChapterProgressOwnerUserId(params.id);
          const denied = assertResourceOwner(ownerId, auth);
          if (denied) return denied;

          await deleteChapterProgress(params.id);
          return jsonNoContent();
        } catch (error) {
          return handleApiError(error);
        }
      },
    },
  },
});
