import dynamic from 'next/dynamic'
import React, { useCallback, useEffect, useState } from 'react'
import { ApexOptions } from 'apexcharts'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

type YAxis = [number, number, number, number]
function getRandomYAxis(
  originalLastMinuteY: YAxis,
  randomLastMinuteY: YAxis,
  secondsCount: number,
): YAxis {
  // IMPORTANTE: A média do delay do fetch de dados e da atualização de todos os components do React é 10 segundos, portanto é 50 ao invés de 60
  /* Desconsiderar a margem dita anteriormente */
  if (secondsCount >= 50)
    return [
      originalLastMinuteY[0],
      originalLastMinuteY[1],
      originalLastMinuteY[2],
      originalLastMinuteY[3],
    ]

  /* Nos últimos 5 segundos, a vela deve retornar progressivamente ao seu valor real */
  if (secondsCount >= 45) {
    /* Obter cálculo da média ponderada, e restaurar vela randômica para vela original */
    const additionCount = 50 - secondsCount
    const open = (originalLastMinuteY[0] - randomLastMinuteY[0]) / additionCount
    const high = (originalLastMinuteY[1] - randomLastMinuteY[1]) / additionCount
    const low = (originalLastMinuteY[2] - randomLastMinuteY[2]) / additionCount
    const close =
      (originalLastMinuteY[3] - randomLastMinuteY[3]) / additionCount

    return [
      randomLastMinuteY[0] + open,
      randomLastMinuteY[1] + high,
      randomLastMinuteY[2] + low,
      randomLastMinuteY[3] + close,
    ]
  }

  // TODO: Adicionar regras em relação a proporção da variação
  /* Gerar um eixo Y aleatório a cada 1 segundo */
  const openRandom =
    (Math.random() * 2 - 1) * (originalLastMinuteY[0] * 0.000005)
  const highRandom =
    (Math.random() * 2 - 1) * (originalLastMinuteY[1] * 0.000005)
  const lowRandom =
    (Math.random() * 2 - 1) * (originalLastMinuteY[2] * 0.000005)
  const closeRandom =
    (Math.random() * 2 - 1) * (originalLastMinuteY[3] * 0.000005)

  return [
    randomLastMinuteY[0] + openRandom,
    randomLastMinuteY[1] + highRandom,
    randomLastMinuteY[2] + lowRandom,
    randomLastMinuteY[3] + closeRandom,
  ]
}

interface CandleChartProps {
  annotations: ApexAnnotations
  seriesData: {
    x: string
    y: [number, number, number, number]
  }[]
}

export const CandleChart = ({ annotations, seriesData }: CandleChartProps) => {
  const [newSeriesData, setNewSeriesData] = useState(seriesData)
  const [secondsCount, setSecondsCount] = useState(0)

  useEffect(() => {
    const intervalId = setInterval(async () => {
      /* Generate candle Variation */
      setNewSeriesData((prev) => [
        {
          x: prev[0].x,
          y: getRandomYAxis(seriesData[0].y, prev[0].y, secondsCount),
        },
        ...newSeriesData.filter((_, i) => i !== 0),
      ])
      setSecondsCount((prev) => prev + 1)
    }, 1000 * 1) // 1 second

    return () => clearInterval(intervalId)
  }, [seriesData, secondsCount, newSeriesData, setNewSeriesData])

  useEffect(() => {
    /* Restart chart on currency change */
    setNewSeriesData(seriesData)
    setSecondsCount(0)
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
