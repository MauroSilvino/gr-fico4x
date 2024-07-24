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

  const seriesData = candleChartData.data.map((obj) => {
    const objKey = Object.keys(obj)[0];
    const values = Object.values(obj[objKey] as string).map(Number) as [
      number,
      number,
      number,
      number
    ];

    return {
      x: new Date(objKey).toISOString(),
      y: values, // [open, high, low, close]
    };
  });

  return seriesData;
}
