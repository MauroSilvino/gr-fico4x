import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import { prisma } from "../../lib/prisma";

const EntryParams = z.object({
  entryValue: z.coerce.number().positive(),
});

export async function entry(request: FastifyRequest, reply: FastifyReply) {
  const { user } = request.routeOptions.config;
  if (!user) return reply.status(401).send({ message: "Not Authorized" });

  const { entryValue } = EntryParams.parse(request.params);

  const userEntry = await prisma.users.findUnique({
    where: {
      id: user.id,
    },
    select: {
      balance: true,
    },
  });
  if (!userEntry) return reply.status(400).send({ message: "User Not Found" });
  /* Verificar se o usuário tem saldo suficiente */
  if (userEntry.balance < entryValue)
    return reply.status(400).send({ message: "Insufficient Balance" });

  /* Subtrair o saldo atual do valor da entrada */
  const newBalance = userEntry.balance - entryValue;

  await prisma.users.update({
    where: {
      id: user.id,
    },
    data: {
      balance: newBalance,
    },
  });

  return reply.status(200).send({ message: "OK", newBalance });
}

export const entryResponseSchema = {
  401: z.object({
    message: z.literal("Not Authorized"),
  }),
  400: z.object({
    message: z.enum(["User Not Found", "Insufficient Balance"]),
  }),
  200: z.object({
    message: z.literal("OK"),
    newBalance: z.number().positive(),
  }),
};
