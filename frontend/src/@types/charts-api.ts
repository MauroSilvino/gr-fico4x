declare module 'charts-api' {
  export type Currency =
    | 'EUR_USD'
    | 'EUR_JPY'
    | 'USD_BRL'
    | 'USD_CAD'
    | 'GBP_JPY'

  export type CandleChartSeriesData = {
    x: string
    y: [number, number, number, number]
  }[]
}
