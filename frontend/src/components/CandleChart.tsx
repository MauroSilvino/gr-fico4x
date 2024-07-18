import dynamic from 'next/dynamic'
import React, { useCallback, useEffect, useState } from 'react'
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
  const [newSeriesData, setNewSeriesData] = useState(seriesData)

  type YAxis = [number, number, number, number]
  const getRandomYAxis = useCallback((y: YAxis): YAxis => {
    /* Update Y Axis of last candle every second (Generate random Y value) */
    const rand1 = (Math.random() * 2 - 1) * 0.00002
    const rand2 = (Math.random() * 2 - 1) * 0.00002
    const rand3 = (Math.random() * 2 - 1) * 0.00002
    const rand4 = (Math.random() * 2 - 1) * 0.00002

    return [y[0] + rand1, y[1] + rand2, y[2] + rand3, y[3] + rand4]
  }, [])

  useEffect(() => {
    const intervalId = setInterval(async () => {
      /* Generate candle Variation */
      setNewSeriesData((prev) => [
        {
          x: prev[0].x,
          y: getRandomYAxis(prev[0].y),
        },
        ...newSeriesData.filter((_, i) => i !== 0),
      ])
    }, 1000 * 1) // 1 second

    return () => clearInterval(intervalId)
  }, [newSeriesData, seriesData, setNewSeriesData, getRandomYAxis])

  useEffect(() => {
    /* Restart chart on currency change */
    setNewSeriesData(seriesData)
  }, [seriesData])

  const series = [
    {
      name: 'candle',
      data: newSeriesData,
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
      },
    },
    annotations: annotations,
  }

  return (
    <div className="h-[90vh] grow">
      <Chart
        type="candlestick"
        series={series}
        height="100%"
        width="100%"
        options={options}
      />
    </div>
  )
}
