declare module 'charts-api' {
  export interface CandleData {
    metadata: { [key: string]: string }
    data: {
      [key: string]: {
        [key: string]: string
      }
    }[]
  }
}
