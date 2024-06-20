import { FastifyReply, FastifyRequest } from "fastify";
import axios from "axios";

export async function getCandleData(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const candleEndpointAPI =
    "https://www.alphavantage.co/query?function=FX_INTRADAY&from_symbol=EUR&to_symbol=USD&interval=5min&apikey=demo";

  const candleChartResponse = await axios.get(candleEndpointAPI, {
    headers: { Accept: "application/json" },
  });
  const { data } = candleChartResponse;

  const candleChartData = {
    metadata: { ...data["Meta Data"] },
    data: Object.entries(data["Time Series FX (5min)"]).map((obj) => ({
      [obj[0]]: obj[1],
    })),
  };

  return reply.status(200).send({ candleChartData });
}
