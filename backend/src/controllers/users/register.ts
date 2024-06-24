import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import bcrypt from "bcrypt";

import { prisma } from "../../lib/prisma";

const registerSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  repeatPassword: z.string(),
});

export default async function register(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { name, email, password, repeatPassword } = registerSchema.parse(
    request.body
  );

  if (password !== repeatPassword)
    return reply.status(400).send({ message: "Passwords Do Not Match" });

  const duplicatedEmail = await prisma.users.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });
  if (duplicatedEmail)
    return reply.status(400).send({ message: "Email Already Exists" });

  const hash = await bcrypt.hash(password, 12);

  await prisma.users.create({
    data: {
      name,
      email,
      password: hash,
    },
  });

  return reply.status(201).send({ message: "CREATED" });
}
