import { FastifyInstance } from "fastify";

import {
  register,
  registerBodySchema,
  registerResponseSchema,
} from "./register";
import { login, loginBodySchema, loginResponseSchema } from "./login";
import { logout, logoutResponseSchema } from "./logout";

export async function usersController(app: FastifyInstance) {
  app.post(
    "/register",
    {
      schema: {
        body: registerBodySchema,
        response: registerResponseSchema,
        tags: ["Users"],
        summary: "Sign Up",
      },
    },
    register
  );
  app.post(
    "/login",
    {
      schema: {
        body: loginBodySchema,
        response: loginResponseSchema,
        tags: ["Users"],
        summary: "Sign In",
      },
    },
    login
  );
  app.get(
    "/logout",
    {
      schema: {
        response: logoutResponseSchema,
        tags: ["Users"],
        summary: "Logout",
      },
    },
    logout
  );
}
