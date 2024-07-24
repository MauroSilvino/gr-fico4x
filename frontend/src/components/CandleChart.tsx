import React from 'react'
import dynamic from 'next/dynamic'
import { ApexOptions } from 'apexcharts'
import type { CandleChartSeriesData } from 'charts-api'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface CandleChartProps {
  annotations: ApexAnnotations
  candleChartSeriesData: CandleChartSeriesData
}

export const CandleChart = ({
  annotations,
  candleChartSeriesData,
}: CandleChartProps) => {
  const series = [
    {
      name: 'candle',
      data: candleChartSeriesData,
    },
  ]

  const options: ApexOptions = {
    chart: {
      id: 'realtime',
      type: 'candlestick',
    },
    colors: ['#6b7280'],
    grid: {
      borderColor: 'rgba(75, 85, 99, 0.10)', // Linhas horizontais quase transparentes
    },
    xaxis: {
      type: 'datetime',
      tooltip: {
        formatter: function (value: string) {
          const date = new Date(value)

          return date.toLocaleString('pt-BR')
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: ['#6b7280'],
        },
      },
    },
    yaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: ['#6b7280'],
        },
        formatter: function (value: number) {
          return value.toFixed(5)
        },
      },
      opposite: true,
    },
    annotations: annotations,
  }

  return (
    <div className="h-[90vh] grow">
      {candleChartSeriesData.length !== 0 && (
        <Chart
          type="candlestick"
          series={series}
          height="100%"
          width="100%"
          options={options}
        />
      )}
      {candleChartSeriesData.length === 0 && <h1>Carregando...</h1>}
    </div>
  )
}
