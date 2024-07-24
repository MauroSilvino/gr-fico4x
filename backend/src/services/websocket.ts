import { FastifyInstance } from "fastify";
import { Server } from "socket.io";
import axios from "axios";

import { formatCandleChartData } from "../utils/formatCandleChartData";
import {
  CandleChartSeriesData,
  generateVariation,
} from "../utils/generateVariation";

export interface RandomVariationMetadata {
  secondsCount: number;
  firstLimit: "max" | "min";
  secondsToFirstLimit: number;
}

interface CandleChartData {
  EUR_USD: CandleChartSeriesData[] | null;
  EUR_JPY: CandleChartSeriesData[] | null;
  USD_BRL: CandleChartSeriesData[] | null;
  USD_CAD: CandleChartSeriesData[] | null;
  GBP_JPY: CandleChartSeriesData[] | null;
}

interface Variation {
  EUR_USD: CandleChartSeriesData | null;
  EUR_JPY: CandleChartSeriesData | null;
  USD_BRL: CandleChartSeriesData | null;
  USD_CAD: CandleChartSeriesData | null;
  GBP_JPY: CandleChartSeriesData | null;
}

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
  const fetchAlphavantageDelayInSeconds = 58; // 58 seconds
  let variations: Variation = {
    EUR_USD: null,
    EUR_JPY: null,
    USD_BRL: null,
    USD_CAD: null,
    GBP_JPY: null,
  };
  let variationMetadata: RandomVariationMetadata = {
    secondsCount: 0,
    firstLimit: "max",
    secondsToFirstLimit: 25,
  };

  // Starting Web Socket server
  const io = new Server(app.server, {
    cors: {
      origin: process.env.APP_BASE_URL!,
      methods: ["GET", "POST"],
    },
  });

  // This let prevent overfetching the external api
  let candleChartData: CandleChartData = {
    EUR_USD: null,
    EUR_JPY: null,
    USD_BRL: null,
    USD_CAD: null,
    GBP_JPY: null,
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

    // Update all WebSocket Rooms Chart Data
    io.to("EUR_USD").emit("chart_update", JSON.stringify(EUR_USD));
    io.to("EUR_JPY").emit("chart_update", JSON.stringify(EUR_JPY));
    io.to("USD_BRL").emit("chart_update", JSON.stringify(USD_BRL));
    io.to("USD_CAD").emit("chart_update", JSON.stringify(USD_CAD));
    io.to("GBP_JPY").emit("chart_update", JSON.stringify(GBP_JPY));

    // Restart Variations
    variations = {
      EUR_USD: null,
      EUR_JPY: null,
      USD_BRL: null,
      USD_CAD: null,
      GBP_JPY: null,
    };
  }

  // Update server data every minute
  await handleCandleChartData();
  setInterval(async () => {
    await handleCandleChartData();

    const firstLimit = Math.random() < 0.5 ? "max" : "min";
    const secondsToFirstLimit = Math.ceil(Math.random() * 10) + 15;
    if (process.env.NODE_ENV === "development")
      console.log("First Limit", secondsToFirstLimit);
    variationMetadata = {
      secondsCount: 0,
      firstLimit,
      secondsToFirstLimit,
    };
  }, 1000 * fetchAlphavantageDelayInSeconds);

  setInterval(() => {
    // Update Variation Metadata
    if (variationMetadata.secondsCount < 60) {
      variationMetadata = {
        ...variationMetadata,
        secondsCount: variationMetadata.secondsCount + 1,
      };
      if (process.env.NODE_ENV === "development")
        console.log(variationMetadata.secondsCount);
    }

    // Update Variations
    if (candleChartData.EUR_USD) {
      variations.EUR_USD = generateVariation(
        candleChartData.EUR_USD[0],
        variations.EUR_USD,
        variationMetadata
      );
    }
    if (candleChartData.EUR_JPY) {
      variations.EUR_JPY = generateVariation(
        candleChartData.EUR_JPY[0],
        variations.EUR_JPY,
        variationMetadata
      );
    }
    if (candleChartData.USD_BRL) {
      variations.USD_BRL = generateVariation(
        candleChartData.USD_BRL[0],
        variations.USD_BRL,
        variationMetadata
      );
    }
    if (candleChartData.USD_CAD) {
      variations.USD_CAD = generateVariation(
        candleChartData.USD_CAD[0],
        variations.USD_CAD,
        variationMetadata
      );
    }
    if (candleChartData.GBP_JPY) {
      variations.GBP_JPY = generateVariation(
        candleChartData.GBP_JPY[0],
        variations.GBP_JPY,
        variationMetadata
      );
    }

    // Send Variations to Client
    io.to("EUR_USD").emit(
      "chart_variation",
      JSON.stringify({
        secondsCount: variationMetadata.secondsCount,
        variation: variations["EUR_USD"],
      })
    );
    io.to("EUR_JPY").emit(
      "chart_variation",
      JSON.stringify({
        secondsCount: variationMetadata.secondsCount,
        variation: variations["EUR_JPY"],
      })
    );
    io.to("USD_BRL").emit(
      "chart_variation",
      JSON.stringify({
        secondsCount: variationMetadata.secondsCount,
        variation: variations["USD_BRL"],
      })
    );
    io.to("USD_CAD").emit(
      "chart_variation",
      JSON.stringify({
        secondsCount: variationMetadata.secondsCount,
        variation: variations["USD_CAD"],
      })
    );
    io.to("GBP_JPY").emit(
      "chart_variation",
      JSON.stringify({
        secondsCount: variationMetadata.secondsCount,
        variation: variations["GBP_JPY"],
      })
    );
  }, 1000 * 1); // 1 seconds

  io.on("connection", (socket) => {
    if (process.env.NODE_ENV === "development")
      console.log(`Connected User: ${socket.id}`);

    socket.on("chart_connect", (currency) => {
      const chartType = JSON.parse(currency);
      socket.join(chartType);

      const chartData = JSON.stringify(
        candleChartData[chartType].filter((_, i) => i !== 0)
      ); // Format && Remove Last Element
      socket.emit("chart_update", chartData);
    });
  });
}
