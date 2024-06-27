import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import { prisma } from "../../lib/prisma";

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
  const candleChart = await prisma.candleChart.findFirst({
    select: {
      id: true,
      value: true,
      created_at: true,
    },
    orderBy: {
      created_at: "desc",
    },
  });
  if (!candleChart)
    return reply.status(400).send({ message: "No Chart Data Found" });

  const candleChartObj = candleChart.value as CandleResponseType;

  // Transformação de dados para o formato necessário
  const candleChartData = {
    metadata: { ...candleChartObj["Meta Data"] },
    data: Object.entries(candleChartObj["Time Series FX (5min)"]).map(
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
