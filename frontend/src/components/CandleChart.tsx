import dynamic from 'next/dynamic'
import React from 'react'
import { ApexOptions } from 'apexcharts'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface CandleChartProps {
  annotations: ApexAnnotations
  seriesData: {
    x: string
    y: [number, number, number, number]
  }[]
}

export const CandleChart = ({ annotations, seriesData }: CandleChartProps) => {
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
      },
    },
    annotations: annotations,
  }

  return (
    <div className="h-[90vh] grow">
      <Chart
        id="candle-chart"
        type="candlestick"
        series={series}
        height="100%"
        width="100%"
        options={options}
      />
    </div>
  )
}
