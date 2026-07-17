import { createFileRoute } from "@tanstack/react-router";
import {
  handleApiError,
  jsonError,
  jsonOk,
  parseJson,
  requireApiAuth,
} from "@/lib/api/helpers.server";
import {
  createUser,
  listUsers,
  type UserInput,
} from "@/lib/api/users.server";

export const Route = createFileRoute("/api/users")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const auth = requireApiAuth();
          if (auth instanceof Response) return auth;

          const users = await listUsers();
          return jsonOk(users);
        } catch (error) {
          return handleApiError(error);
        }
      },
      POST: async ({ request }) => {
        try {
          const body = await parseJson<UserInput>(request);
          if (!body?.email || !body.password || !body.name) {
            return jsonError("Champs requis : email, password, name.", 422);
          }

          const user = await createUser(body);
          return jsonOk(user, 201);
        } catch (error) {
          return handleApiError(error);
        }
      },
    },
  },
});
