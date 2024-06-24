import { FastifyReply, FastifyRequest } from "fastify";
import axios from "axios";
import { z } from "zod";

type CandleResponseType = {
  metadata: {
    [x: string]: string;
  };
  data: {
    [x: string]: {
      [x: string]: string;
    };
  }[];
};

export async function candleChartData(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const candleEndpointAPI =
    "https://www.alphavantage.co/query?function=FX_INTRADAY&from_symbol=EUR&to_symbol=USD&interval=5min&apikey=demo";

  const externalApiResponse = await axios.get(candleEndpointAPI, {
    headers: { Accept: "application/json" },
  });
  const externalApiData: CandleResponseType = externalApiResponse.data;

  const candleChartData = {
    metadata: { ...externalApiData["Meta Data"] },
    data: Object.entries(externalApiData["Time Series FX (5min)"]).map(
      (obj) => ({
        [obj[0]]: obj[1],
      })
    ),
  };

  return reply.status(200).send({ candleChartData });
}

export const candleResponseSchema = {
  401: z.object({
    message: z.literal("Not Authorized"),
  }),
  200: z.object({
    candleChartData: z.object({
      metadata: z.record(z.string(), z.string()),
      data: z.array(z.record(z.string(), z.record(z.string(), z.string()))),
    }),
  }),
};
