import { FastifyInstance } from "fastify";

import { isUser } from "../../middlewares/isUser";
import { candleChartData, candleResponseSchema } from "./candle";

export async function chartsController(app: FastifyInstance) {
  app.get(
    "/candle",
    {
      onRequest: [isUser],
      schema: {
        response: candleResponseSchema,
        tags: ["Charts"],
        summary: "Candle Chart Data",
      },
    },
    candleChartData
  );
}
