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
  deleteStudyGuideDefinition,
  getStudyGuideDefinition,
  updateStudyGuideDefinition,
  type StudyGuideDefinitionInput,
} from "@/lib/api/study-guide-definitions.server";

export const Route = createFileRoute("/api/study-guide-definitions/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        try {
          const definition = await getStudyGuideDefinition(params.id);
          if (!definition) return jsonError("Définition introuvable.", 404);
          return jsonOk(definition);
        } catch (error) {
          return handleApiError(error);
        }
      },
      PUT: async ({ params, request }) => {
        try {
          const auth = requireApiAuth();
          if (auth instanceof Response) return auth;

          const body = await parseJson<Partial<Omit<StudyGuideDefinitionInput, "studyGuideId">>>(request);
          if (!body) return jsonError("Corps JSON invalide.", 422);

          const definition = await updateStudyGuideDefinition(params.id, body);
          return jsonOk(definition);
        } catch (error) {
          return handleApiError(error);
        }
      },
      PATCH: async ({ params, request }) => {
        try {
          const auth = requireApiAuth();
          if (auth instanceof Response) return auth;

          const body = await parseJson<Partial<Omit<StudyGuideDefinitionInput, "studyGuideId">>>(request);
          if (!body) return jsonError("Corps JSON invalide.", 422);

          const definition = await updateStudyGuideDefinition(params.id, body);
          return jsonOk(definition);
        } catch (error) {
          return handleApiError(error);
        }
      },
      DELETE: async ({ params }) => {
        try {
          const auth = requireApiAuth();
          if (auth instanceof Response) return auth;

          await deleteStudyGuideDefinition(params.id);
          return jsonNoContent();
        } catch (error) {
          return handleApiError(error);
        }
      },
    },
  },
});
