import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { prisma } from "../../lib/prisma";

export const loginBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function login(request: FastifyRequest, reply: FastifyReply) {
  const { email, password } = loginBodySchema.parse(request.body);

  const user = await prisma.users.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      password: true,
    },
  });
  if (!user) return reply.status(400).send({ message: "Invalid Credentials" });

  const passwordsMatch = await bcrypt.compare(password, user.password);
  if (passwordsMatch === false)
    return reply.status(400).send({ message: "Invalid Credentials" });

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!);

  reply.setCookie("grafico_user", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 dias
  });

  return reply.status(204).send();
}

export const loginResponseSchema = {
  400: z.object({
    message: z.literal("Invalid Credentials"),
  }),
  204: z.undefined(),
};
