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
  createStudyGuideDefinition,
  listStudyGuideDefinitions,
  type StudyGuideDefinitionInput,
} from "@/lib/api/study-guide-definitions.server";

export const Route = createFileRoute("/api/study-guide-definitions")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const studyGuideId = getSearchParam(request, "studyGuideId");
          const definitions = await listStudyGuideDefinitions(studyGuideId);
          return jsonOk(definitions);
        } catch (error) {
          return handleApiError(error);
        }
      },
      POST: async ({ request }) => {
        try {
          const auth = requireApiAuth();
          if (auth instanceof Response) return auth;

          const body = await parseJson<StudyGuideDefinitionInput>(request);
          if (!body?.studyGuideId || !body.term || !body.definition) {
            return jsonError("Champs requis : studyGuideId, term, definition.", 422);
          }

          const definition = await createStudyGuideDefinition(body);
          return jsonOk(definition, 201);
        } catch (error) {
          return handleApiError(error);
        }
      },
    },
  },
});
