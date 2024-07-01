'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import type { CandleData } from 'charts-api'
import type { ApexOptions } from 'apexcharts'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface CandleChartProps {
  candleChartData: CandleData
}

export const CandleChart = ({ candleChartData }: CandleChartProps) => {
  const seriesData = candleChartData.data?.map((obj) => {
    const objKey = Object.keys(obj)[0]
    const values = Object.values(obj[objKey]).map(Number) // Convertendo para números
    return {
      x: new Date(objKey).toISOString(),
      y: values as [number, number, number, number], // Asserting the type
    }
  })

  const series = [
    {
      name: 'candle',
      data: seriesData,
    },
  ]

  const options: ApexOptions = {
    chart: {
      type: 'candlestick',
    },
    xaxis: {
      type: 'datetime',
    },
    grid: {
      borderColor: 'rgba(114, 100, 100, 0.22)', // Define as linhas horizontais quase transparentes
    },
    yaxis: {
      labels: {
        formatter: function (value: number) {
          return value.toFixed(2)
        },
      },
    },
  }

  return (
    <div className="min-h-screen bg-gray-800 p-4">
      <div className="relative rounded-lg bg-gray-800 p-4">
        <Chart
          type="candlestick"
          series={series}
          height={880}
          width="90%"
          options={options}
        />
        <div className="absolute right-4 top-1/2 flex -translate-y-1/2 transform flex-col items-center space-y-5">
          <button className="z-10 box-border flex h-32 w-32 flex-col items-center justify-center rounded-md bg-green-500 p-4 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
              stroke="currentColor"
              className="size-10"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941"
              />
            </svg>
            <p className="text-xl">Acima</p>
          </button>
          <button className="z-0 box-border flex h-32 w-32 flex-col items-center justify-center rounded-md bg-red-500 p-4 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
              stroke="currentColor"
              className="size-10"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 6 9 12.75l4.286-4.286a11.948 11.948 0 0 1 4.306 6.43l.776 2.898m0 0 3.182-5.511m-3.182 5.51-5.511-3.181"
              />
            </svg>
            <p className="text-xl">Abaixo</p>
          </button>
        </div>
      </div>
    </div>
  )
}
