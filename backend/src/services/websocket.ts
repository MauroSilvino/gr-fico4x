import { FastifyInstance } from "fastify";
import { WebSocketServer } from "ws";
import axios from "axios";

import { formatCandleChartData } from "../utils/formatCandleChartData";

type Symbol = "EUR" | "USD" | "BRL" | "JPY" | "CAD" | "GBP";
async function fetchCandleChartData(from_symbol: Symbol, to_symbol: Symbol) {
  const candleEndpointAPI = `https://www.alphavantage.co/query?function=FX_INTRADAY&from_symbol=${from_symbol}&to_symbol=${to_symbol}&interval=1min&apikey=${
    process.env.ALPHAVANTAGE_API_KEY ?? "demo"
  }`;

  const externalApiResponse = await axios({
    method: "get",
    url: candleEndpointAPI,
  });

  const candleChartData = formatCandleChartData(externalApiResponse.data);

  return candleChartData;
}

export async function websocket(app: FastifyInstance) {
  const delayInSeconds = 60; // 60 segundos

  // Starting Web Socket server
  const wss = new WebSocketServer({ port: 8080 });

  // This let prevent overfetching the external api
  let candleChartData = {
    EUR_USD: {},
    EUR_JPY: {},
    USD_BRL: {},
    USD_CAD: {},
    GBP_JPY: {},
  };
  async function handleCandleChartData() {
    const [EUR_USD, EUR_JPY, USD_BRL, USD_CAD, GBP_JPY] = await Promise.all([
      await fetchCandleChartData("EUR", "USD"),
      await fetchCandleChartData("EUR", "JPY"),
      await fetchCandleChartData("USD", "BRL"),
      await fetchCandleChartData("USD", "CAD"),
      await fetchCandleChartData("USD", "JPY"),
    ]);
    candleChartData.EUR_USD = EUR_USD;
    candleChartData.EUR_JPY = EUR_JPY;
    candleChartData.USD_BRL = USD_BRL;
    candleChartData.USD_CAD = USD_CAD;
    candleChartData.GBP_JPY = GBP_JPY;
  }

  // Update server data every minute
  await handleCandleChartData();
  setInterval(async () => {
    await handleCandleChartData();
  }, 1000 * delayInSeconds);

  wss.on("connection", async function connection(ws) {
    ws.on("error", function error(error) {
      app.log.error(error);
    });

    ws.on("message", async function message(msg) {
      const message = JSON.parse(msg.toString());

      switch (message) {
        case "EUR_USD":
          ws.send(JSON.stringify(candleChartData.EUR_USD));
          break;
        case "EUR_JPY":
          ws.send(JSON.stringify(candleChartData.EUR_JPY));
          break;
        case "USD_BRL":
          ws.send(JSON.stringify(candleChartData.USD_BRL));
          break;
        case "USD_CAD":
          ws.send(JSON.stringify(candleChartData.USD_CAD));
          break;
        case "GBP_JPY":
          ws.send(JSON.stringify(candleChartData.GBP_JPY));
          break;
      }
    });
  });
}
