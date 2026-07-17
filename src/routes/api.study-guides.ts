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
  createStudyGuide,
  listStudyGuides,
  type StudyGuideInput,
} from "@/lib/api/study-guides.server";

export const Route = createFileRoute("/api/study-guides")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const chapterId = getSearchParam(request, "chapterId");
          const guides = await listStudyGuides(chapterId);
          return jsonOk(guides);
        } catch (error) {
          return handleApiError(error);
        }
      },
      POST: async ({ request }) => {
        try {
          const auth = requireApiAuth();
          if (auth instanceof Response) return auth;

          const body = await parseJson<StudyGuideInput>(request);
          if (!body?.chapterId || !body.keyConcepts || !body.examTips || !body.commonMistakes || !body.importantFacts) {
            return jsonError("Champs requis : chapterId, keyConcepts, examTips, commonMistakes, importantFacts.", 422);
          }

          const guide = await createStudyGuide(body);
          return jsonOk(guide, 201);
        } catch (error) {
          return handleApiError(error);
        }
      },
    },
  },
});
