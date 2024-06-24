import { FastifyInstance } from "fastify";

import { logout } from "./logout";
import login from "./login";
import register from "./register";

export async function usersController(app: FastifyInstance) {
  app.post("/register", register);
  app.post("/login", login);
  app.get("/logout", logout);
}
