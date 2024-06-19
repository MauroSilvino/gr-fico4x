import { FastifyInstance } from "fastify";
import { ZodError } from "zod";

type FastifyErrorHandler = FastifyInstance["errorHandler"];

export const errorHandler: FastifyErrorHandler = (error, request, response) => {
  response.log.error({ code: error.code, message: error.message });

  if (error instanceof ZodError) {
    return response.status(400).send({
      message: "Data Parse Error",
      errors: error.flatten().fieldErrors,
    });
  }

  if (error.statusCode === 429)
    return response
      .status(429)
      .send({ message: "Rate limit exceeded, try again later" });

  return response.status(500).send({ message: "Internal Server Error" });
};
