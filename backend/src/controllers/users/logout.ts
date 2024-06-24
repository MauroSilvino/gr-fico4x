import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function logout(request: FastifyRequest, reply: FastifyReply) {
  reply.clearCookie("grafico_user");

  return reply.status(204).send();
}

export const logoutResponseSchema = {
  204: z.undefined(),
};
