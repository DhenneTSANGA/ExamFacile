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
  deleteStudyGuide,
  getStudyGuide,
  updateStudyGuide,
  type StudyGuideInput,
} from "@/lib/api/study-guides.server";

export const Route = createFileRoute("/api/study-guides/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        try {
          const guide = await getStudyGuide(params.id);
          if (!guide) return jsonError("Fiche introuvable.", 404);
          return jsonOk(guide);
        } catch (error) {
          return handleApiError(error);
        }
      },
      PUT: async ({ params, request }) => {
        try {
          const auth = requireApiAuth();
          if (auth instanceof Response) return auth;

          const body = await parseJson<Partial<Omit<StudyGuideInput, "chapterId">>>(request);
          if (!body) return jsonError("Corps JSON invalide.", 422);

          const guide = await updateStudyGuide(params.id, body);
          return jsonOk(guide);
        } catch (error) {
          return handleApiError(error);
        }
      },
      PATCH: async ({ params, request }) => {
        try {
          const auth = requireApiAuth();
          if (auth instanceof Response) return auth;

          const body = await parseJson<Partial<Omit<StudyGuideInput, "chapterId">>>(request);
          if (!body) return jsonError("Corps JSON invalide.", 422);

          const guide = await updateStudyGuide(params.id, body);
          return jsonOk(guide);
        } catch (error) {
          return handleApiError(error);
        }
      },
      DELETE: async ({ params }) => {
        try {
          const auth = requireApiAuth();
          if (auth instanceof Response) return auth;

          await deleteStudyGuide(params.id);
          return jsonNoContent();
        } catch (error) {
          return handleApiError(error);
        }
      },
    },
  },
});
