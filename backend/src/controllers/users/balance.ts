import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import { prisma } from "../../lib/prisma";

export async function balance(request: FastifyRequest, reply: FastifyReply) {
  const { user } = request.routeOptions.config;
  if (!user) return reply.status(401).send({ message: "Not Authorized" });

  const userData = await prisma.users.findUnique({
    where: {
      id: user.id,
    },
    select: {
      balance: true,
    },
  });
  if (!userData) return reply.status(400).send({ message: "User Not Found" });

  return reply.status(200).send({ balance: userData.balance });
}

export const balanceResponseSchema = {
  401: z.object({
    message: z.literal("Not Authorized"),
  }),
  400: z.object({
    message: z.literal("User Not Found"),
  }),
  200: z.object({
    balance: z.number(),
  }),
};
