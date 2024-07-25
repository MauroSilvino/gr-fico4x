import { RandomVariationMetadata } from "../services/websocket";

export type CandleChartSeriesData = {
  x: string;
  y: [number, number, number, number];
};

type YAxis = [number, number, number, number];
function getRandomYAxis(
  originalLastMinuteY: YAxis,
  randomLastMinuteY: YAxis,
  randomVariationMetadata: RandomVariationMetadata
): YAxis {
  const { secondsCount, firstLimit, secondsToFirstLimit } =
    randomVariationMetadata;

  /* Deixar com o valor original nos últimos segundos */
  if (secondsCount >= 57) {
    if (process.env.NODE_ENV === "development") console.log("Vela Original");
    return [
      originalLastMinuteY[0],
      originalLastMinuteY[1],
      originalLastMinuteY[2],
      originalLastMinuteY[3],
    ];
  }

  /* Nos últimos 6 segundos, a vela deve retornar progressivamente ao seu valor real */
  if (secondsCount > 50) {
    if (process.env.NODE_ENV === "development") console.log("Última Variação");
    /* Obter cálculo da média ponderada, e restaurar vela randômica para vela original */
    const additionCount = 57 - randomVariationMetadata.secondsCount;

    const closeDiff =
      (originalLastMinuteY[3] - randomLastMinuteY[3]) / additionCount;

    return [
      randomLastMinuteY[0],
      randomLastMinuteY[1],
      randomLastMinuteY[2],
      randomLastMinuteY[3] + closeDiff,
    ];
  }

  // IMPORTANTE: Nos primeiros 44 segundos, a vela deve OBRIGATORIAMENTE alcançar a máxima e a mínima da vela original
  // Cada variação deve ter no mínimo 15 segundos (30 segundos no total), portanto restam 14 segundos para randomizar
  const secondsToOtherLimit = 44 - secondsToFirstLimit;
  const isFirstLimitLastSeconds =
    secondsCount >= secondsToFirstLimit - 5 &&
    secondsCount < secondsToFirstLimit;
  const isSecondLimitLastSeconds =
    secondsCount >= secondsToFirstLimit + (secondsToOtherLimit - 5) &&
    secondsCount < secondsToFirstLimit + secondsToOtherLimit;

  // Primeiro Limite
  if (isFirstLimitLastSeconds) {
    if (process.env.NODE_ENV === "development") console.log("Primeiro Limite");
    const additionCount = secondsToFirstLimit - secondsCount;

    const limitValue =
      firstLimit === "max" ? originalLastMinuteY[1] : originalLastMinuteY[2];
    const closeDiff = (limitValue - randomLastMinuteY[3]) / additionCount;
    return [
      randomLastMinuteY[0],
      randomLastMinuteY[1],
      randomLastMinuteY[2],
      randomLastMinuteY[3] + closeDiff,
    ];
  }
  // Segundo Limite
  if (isSecondLimitLastSeconds) {
    if (process.env.NODE_ENV === "development") console.log("Segundo Limite");
    const additionCount =
      secondsToOtherLimit - (secondsCount - secondsToFirstLimit);

    const limitValue =
      firstLimit === "max" ? originalLastMinuteY[2] : originalLastMinuteY[1];
    const closeDiff = (limitValue - randomLastMinuteY[3]) / additionCount;
    return [
      randomLastMinuteY[0],
      randomLastMinuteY[1],
      randomLastMinuteY[2],
      randomLastMinuteY[3] + closeDiff,
    ];
  }

  let closeRandom = (Math.random() * 2 - 1) * (randomLastMinuteY[3] * 0.00001);
  // Caso o número gerado ultrapasse os limites do original, ignorar o número gerado
  if (
    randomLastMinuteY[3] + closeRandom > originalLastMinuteY[1] ||
    randomLastMinuteY[3] + closeRandom < originalLastMinuteY[2]
  ) {
    closeRandom = 0;
  }

  const open = randomLastMinuteY[0];
  const close = randomLastMinuteY[3] + closeRandom;
  const high = close > randomLastMinuteY[1] ? close : randomLastMinuteY[1]; // Se o fechamento aleatório ultrapassar o máximo, o máximo será o fechamento
  const low = close < randomLastMinuteY[2] ? close : randomLastMinuteY[2]; // Se o fechamento aleatório ultrapassar o mínimo, o máximo será o fechamento

  return [open, high, low, close];
}

export function generateVariation(
  latestData: CandleChartSeriesData,
  lastSecondVariation: CandleChartSeriesData | null,
  variationMetadata: RandomVariationMetadata
): CandleChartSeriesData {
  if (lastSecondVariation === null) {
    return {
      x: latestData.x,
      y: [latestData.y[0], latestData.y[0], latestData.y[0], latestData.y[0]],
    };
  }

  return {
    x: lastSecondVariation.x,
    y: getRandomYAxis(latestData.y, lastSecondVariation.y, variationMetadata),
  };
}
