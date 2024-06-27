import axios from "axios";

import { prisma } from "../lib/prisma";

export function updateCandleChart() {
  const delayInSeconds = 60 * 5; // 5 minutos
  const API_REQUEST_FROM_SYMBOL = "EUR";
  const API_REQUEST_TO_SYMBOL = "USD";
  const candleEndpointAPI = `https://www.alphavantage.co/query?function=FX_INTRADAY&from_symbol=${API_REQUEST_FROM_SYMBOL}&to_symbol=${API_REQUEST_TO_SYMBOL}&interval=5min&apikey=${
    process.env.API_KEY ?? "demo"
  }`;

  setInterval(async () => {
    const externalApiResponse = await axios({
      method: "get",
      url: candleEndpointAPI,
    });

    await prisma.candleChart.create({
      data: {
        value: externalApiResponse.data,
      },
    });
  }, 1000 * delayInSeconds);
}
