import { FastifyInstance } from "fastify";

import { isUser } from "../../middlewares/isUser";
import {
  register,
  registerBodySchema,
  registerResponseSchema,
} from "./register";
import { login, loginBodySchema, loginResponseSchema } from "./login";
import { logout, logoutResponseSchema } from "./logout";
import { balance, balanceResponseSchema } from "./balance";
import { entry, entryResponseSchema } from "./entry";

export async function usersController(app: FastifyInstance) {
  app.post(
    "/register",
    {
      schema: {
        tags: ["Users"],
        summary: "Sign Up",
        body: registerBodySchema,
        response: registerResponseSchema,
      },
    },
    register
  );
  app.post(
    "/login",
    {
      schema: {
        tags: ["Users"],
        summary: "Sign In",
        body: loginBodySchema,
        response: loginResponseSchema,
      },
    },
    login
  );
  app.get(
    "/logout",
    {
      schema: {
        tags: ["Users"],
        summary: "Logout",
        response: logoutResponseSchema,
      },
    },
    logout
  );
  app.get(
    "/balance",
    {
      onRequest: [isUser],
      schema: {
        tags: ["Users"],
        summary: "Get User Balance",
        response: balanceResponseSchema,
      },
    },
    balance
  );
  app.patch(
    "/new-entry/:entryValue",
    {
      onRequest: [isUser],
      schema: {
        tags: ["Users"],
        summary: "Handle User Entry",
        response: entryResponseSchema,
      },
    },
    entry
  );
}
