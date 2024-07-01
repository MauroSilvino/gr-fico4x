import { FastifyInstance } from "fastify";
import { WebSocketServer } from "ws";
import axios from "axios";

import { formatCandleChartData } from "../utils/formatCandleChartData";

export async function websocket(app: FastifyInstance) {
  const delayInSeconds = 60; // 60 segundos
  const API_REQUEST_FROM_SYMBOL = "EUR";
  const API_REQUEST_TO_SYMBOL = "USD";
  const candleEndpointAPI = `https://www.alphavantage.co/query?function=FX_INTRADAY&from_symbol=${API_REQUEST_FROM_SYMBOL}&to_symbol=${API_REQUEST_TO_SYMBOL}&interval=1min&apikey=${
    process.env.ALPHAVANTAGE_API_KEY ?? "demo"
  }`;

  async function fetchCandleChartData() {
    const externalApiResponse = await axios({
      method: "get",
      url: candleEndpointAPI,
    });

    const candleChartData = formatCandleChartData(externalApiResponse.data);

    return candleChartData;
  }

  // Starting Web Socket server
  const wss = new WebSocketServer({ port: 8080 });

  // This let prevent overfetching the external api
  let candleChartData = {};
  // Update server data every minute
  const fetchedChartData = await fetchCandleChartData();
  candleChartData = fetchedChartData;
  setInterval(async () => {
    const fetchedChartData = await fetchCandleChartData();
    candleChartData = fetchedChartData;
  }, 1000 * delayInSeconds);

  wss.on("connection", async function connection(ws) {
    ws.on("error", function error(error) {
      app.log.error(error);
    });

    // Send data to the client
    async function wsSendData() {
      ws.send(JSON.stringify(candleChartData));
    }
    await wsSendData();

    // Update client data every minute
    setInterval(async () => {
      await wsSendData();
    }, 1000 * delayInSeconds);
  });
}
