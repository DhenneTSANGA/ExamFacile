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
  deleteSubject,
  getSubject,
  updateSubject,
  type SubjectInput,
} from "@/lib/api/subjects.server";

export const Route = createFileRoute("/api/subjects/$id")({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        try {
          const includeChapters = getSearchParam(request, "include") === "chapters";
          const subject = await getSubject(params.id, includeChapters);
          if (!subject) return jsonError("Matière introuvable.", 404);
          return jsonOk(subject);
        } catch (error) {
          return handleApiError(error);
        }
      },
      PUT: async ({ params, request }) => {
        try {
          const auth = requireApiAuth();
          if (auth instanceof Response) return auth;

          const body = await parseJson<Partial<Omit<SubjectInput, "id">>>(request);
          if (!body) return jsonError("Corps JSON invalide.", 422);

          const subject = await updateSubject(params.id, body);
          return jsonOk(subject);
        } catch (error) {
          return handleApiError(error);
        }
      },
      PATCH: async ({ params, request }) => {
        try {
          const auth = requireApiAuth();
          if (auth instanceof Response) return auth;

          const body = await parseJson<Partial<Omit<SubjectInput, "id">>>(request);
          if (!body) return jsonError("Corps JSON invalide.", 422);

          const subject = await updateSubject(params.id, body);
          return jsonOk(subject);
        } catch (error) {
          return handleApiError(error);
        }
      },
      DELETE: async ({ params }) => {
        try {
          const auth = requireApiAuth();
          if (auth instanceof Response) return auth;

          await deleteSubject(params.id);
          return jsonNoContent();
        } catch (error) {
          return handleApiError(error);
        }
      },
    },
  },
});
