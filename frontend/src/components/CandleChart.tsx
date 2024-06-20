'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import type { CandleData } from 'charts-api'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface CandleChartProps {
  candleChartData: CandleData
}

export const CandleChart = ({ candleChartData }: CandleChartProps) => {
  const seriesData = candleChartData.data?.map((obj) => {
    const objKey = Object.keys(obj)[0]
    return {
      x: new Date(objKey).toISOString(),
      y: Object.values(obj[objKey]),
    }
  })

  const series = [
    {
      name: 'candle',
      data: seriesData,
    },
  ]

  return (
    <Chart
      type="candlestick"
      series={series}
      height={350}
      width="100%"
      options={{}}
    />
  )
}
