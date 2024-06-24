import { FastifyReply, FastifyRequest } from "fastify";

export async function logout(request: FastifyRequest, reply: FastifyReply) {
  reply.clearCookie("grafico_user");

  return reply.status(204).send();
}
