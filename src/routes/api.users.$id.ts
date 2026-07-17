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
  deleteUser,
  getUser,
  updateUser,
  type UserUpdateInput,
} from "@/lib/api/users.server";

export const Route = createFileRoute("/api/users/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        try {
          const auth = requireApiAuth();
          if (auth instanceof Response) return auth;

          const user = await getUser(params.id);
          if (!user) return jsonError("Utilisateur introuvable.", 404);
          return jsonOk(user);
        } catch (error) {
          return handleApiError(error);
        }
      },
      PUT: async ({ params, request }) => {
        try {
          const auth = requireApiAuth();
          if (auth instanceof Response) return auth;

          const body = await parseJson<UserUpdateInput>(request);
          if (!body) return jsonError("Corps JSON invalide.", 422);

          const user = await updateUser(params.id, body);
          return jsonOk(user);
        } catch (error) {
          return handleApiError(error);
        }
      },
      PATCH: async ({ params, request }) => {
        try {
          const auth = requireApiAuth();
          if (auth instanceof Response) return auth;

          const body = await parseJson<UserUpdateInput>(request);
          if (!body) return jsonError("Corps JSON invalide.", 422);

          const user = await updateUser(params.id, body);
          return jsonOk(user);
        } catch (error) {
          return handleApiError(error);
        }
      },
      DELETE: async ({ params }) => {
        try {
          const auth = requireApiAuth();
          if (auth instanceof Response) return auth;

          await deleteUser(params.id);
          return jsonNoContent();
        } catch (error) {
          return handleApiError(error);
        }
      },
    },
  },
});
