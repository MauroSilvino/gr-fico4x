import Fastify from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyCookie from "@fastify/cookie";
import fastifyHelmet from "@fastify/helmet";
import fastifyRateLimit from "@fastify/rate-limit";
import * as zodProvider from "fastify-type-provider-zod";

import { errorHandler } from "./error-handler";
import { chartsController } from "./controllers/charts/router";

const app = Fastify({
  logger: true,
  disableRequestLogging: true,
});

app.register(fastifyCors, {
  origin: process.env.APP_BASE_URL,
  credentials: true,
});
app.register(fastifyHelmet);
app.register(fastifyCookie);
app.register(fastifyRateLimit, {
  global: true,
  max: 50,
  timeWindow: 1000 * 30, // 30 segundos
});

app.setValidatorCompiler(zodProvider.validatorCompiler);
app.setSerializerCompiler(zodProvider.serializerCompiler);
app.setErrorHandler(errorHandler);

/*  Index Route */
app.get("/", async (request, reply) => {
  return reply.send({ message: "API Gráfico 4x" });
});

/* Controllers */
app.register(chartsController);

try {
  await app.listen({
    host: "0.0.0.0",
    port: process.env.PORT ? Number(process.env.PORT) : 3333,
  });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
