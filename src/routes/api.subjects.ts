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
  createSubject,
  listSubjects,
  type SubjectInput,
} from "@/lib/api/subjects.server";

export const Route = createFileRoute("/api/subjects")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const includeChapters = getSearchParam(request, "include") === "chapters";
          const subjects = await listSubjects(includeChapters);
          return jsonOk(subjects);
        } catch (error) {
          return handleApiError(error);
        }
      },
      POST: async ({ request }) => {
        try {
          const auth = requireApiAuth();
          if (auth instanceof Response) return auth;

          const body = await parseJson<SubjectInput>(request);
          if (!body?.id || !body.name || !body.icon || !body.color || !body.gradient || !body.description) {
            return jsonError("Champs requis : id, name, icon, color, gradient, description.", 422);
          }

          const subject = await createSubject(body);
          return jsonOk(subject, 201);
        } catch (error) {
          return handleApiError(error);
        }
      },
    },
  },
});
