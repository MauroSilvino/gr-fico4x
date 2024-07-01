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

export function formatCandleChartData(candleChartObj: CandleResponseType) {
  const candleChartData = {
    metadata: { ...candleChartObj[Object.keys(candleChartObj)[0]] },
    data: Object.entries(candleChartObj[Object.keys(candleChartObj)[1]]).map(
      (obj) => ({
        [obj[0]]: obj[1],
      })
    ),
  };

  return candleChartData;
}
