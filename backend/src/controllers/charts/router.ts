import { FastifyInstance } from "fastify";

import { getCandleData } from "./candle";

export async function chartsController(app: FastifyInstance) {
  app.get("/candle", getCandleData);
}
