import fastifyCookie from "@fastify/cookie";
import fastifyCors from "@fastify/cors";
import fastifyHelmet from "@fastify/helmet";
import fastifyRateLimit from "@fastify/rate-limit";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import Fastify from "fastify";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";

import { chartsController } from "./controllers/charts/router";
import { usersController } from "./controllers/users/router";
import { errorHandler } from "./error-handler";
import { updateCandleChart } from "./jobs/cronjob";

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

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
app.setErrorHandler(errorHandler);

app.register(fastifySwagger, {
  swagger: {
    consumes: ["application/json"],
    produces: ["application/json"],
    info: {
      version: "1.0.0",
      title: "API Gráfico",
    },
  },
  transform: jsonSchemaTransform,
});
app.register(fastifySwaggerUI, {
  routePrefix: "/docs",
});

/*  Index Route */
app.get("/", async (request, reply) => {
  return reply.send({ message: "API Gráfico 4x" });
});

/* Controllers */
app.register(usersController);
app.register(chartsController);

updateCandleChart();

try {
  await app.listen({
    host: "0.0.0.0",
    port: process.env.PORT ? Number(process.env.PORT) : 3333,
  });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
