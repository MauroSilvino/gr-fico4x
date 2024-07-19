import dynamic from 'next/dynamic'
import React, { useEffect, useState } from 'react'
import { ApexOptions } from 'apexcharts'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface RandomVariationMetadata {
  secondsCount: number
  firstLimit: 'max' | 'min'
  secondsToFirstLimit: number
}

type YAxis = [number, number, number, number]
function getRandomYAxis(
  originalLastMinuteY: YAxis,
  randomLastMinuteY: YAxis,
  randomVariationMetadata: RandomVariationMetadata,
): YAxis {
  const { secondsCount, firstLimit, secondsToFirstLimit } =
    randomVariationMetadata
  const secondsToOtherLimit = 44 - secondsToFirstLimit

  // Gerar a vela aleatória inicial
  if (secondsCount === 0)
    return [
      originalLastMinuteY[0],
      originalLastMinuteY[0],
      originalLastMinuteY[0],
      originalLastMinuteY[0],
    ]

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
    const additionCount = 50 - randomVariationMetadata.secondsCount
    const openDiff =
      (originalLastMinuteY[0] - randomLastMinuteY[0]) / additionCount
    const highDiff =
      (originalLastMinuteY[1] - randomLastMinuteY[1]) / additionCount
    const lowDiff =
      (originalLastMinuteY[2] - randomLastMinuteY[2]) / additionCount
    const closeDiff =
      (originalLastMinuteY[3] - randomLastMinuteY[3]) / additionCount

    return [
      randomLastMinuteY[0] + openDiff,
      randomLastMinuteY[1] + highDiff,
      randomLastMinuteY[2] + lowDiff,
      randomLastMinuteY[3] + closeDiff,
    ]
  }

  /* Gerar um eixo Y aleatório a cada 1 segundo */
  // IMPORTANTE: Nos primeiros 44 segundos, a vela deve OBRIGATORIAMENTE alcançar a máxima e a mínima va vela original
  // Cada variação deve ter no mínimo 15 segundos, portanto restam 14 para randomizar
  const isFirstLimitLastSeconds =
    secondsCount >= secondsToFirstLimit - 5 &&
    secondsCount < secondsToFirstLimit
  const isSecondLimitLastSeconds =
    secondsCount >= secondsToFirstLimit + (secondsToOtherLimit - 5) &&
    secondsCount < secondsToFirstLimit + secondsToOtherLimit
  // Primeiro Limite
  if (isFirstLimitLastSeconds) {
    const additionCount = secondsToFirstLimit - secondsCount
    const limitValue =
      firstLimit === 'max' ? originalLastMinuteY[1] : originalLastMinuteY[2]
    const closeDiff = (limitValue - randomLastMinuteY[3]) / additionCount
    return [
      randomLastMinuteY[0],
      randomLastMinuteY[1],
      randomLastMinuteY[2],
      randomLastMinuteY[3] + closeDiff,
    ]
  }
  // Segundo Limite
  if (isSecondLimitLastSeconds) {
    const additionCount =
      secondsToOtherLimit - (secondsCount - secondsToFirstLimit)
    const limitValue =
      firstLimit === 'max' ? originalLastMinuteY[2] : originalLastMinuteY[1]
    const closeDiff = (limitValue - randomLastMinuteY[3]) / additionCount
    return [
      randomLastMinuteY[0],
      randomLastMinuteY[1],
      randomLastMinuteY[2],
      randomLastMinuteY[3] + closeDiff,
    ]
  }

  let closeRandom = (Math.random() * 2 - 1) * (randomLastMinuteY[3] * 0.000005)
  // Caso o número gerado ultrapasse os limites do original, ignorar o número gerado
  if (
    randomLastMinuteY[3] + closeRandom > originalLastMinuteY[1] ||
    randomLastMinuteY[3] + closeRandom < originalLastMinuteY[2]
  ) {
    closeRandom = 0
  }

  const open = randomLastMinuteY[0]
  const close = randomLastMinuteY[3] + closeRandom
  const high = close > randomLastMinuteY[1] ? close : randomLastMinuteY[1] // Se o fechamento aleatório ultrapassar o máximo, o máximo será o fechamento
  const low = close < randomLastMinuteY[2] ? close : randomLastMinuteY[2] // Se o fechamento aleatório ultrapassar o mínimo, o máximo será o fechamento

  return [open, high, low, close]
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
  const [randomVariationMetadata, setRandomVariationMetadata] =
    useState<RandomVariationMetadata | null>(null)

  useEffect(() => {
    const intervalId = setInterval(async () => {
      /* Generate candle Variation */
      if (randomVariationMetadata) {
        setNewSeriesData((prev) => [
          {
            x: prev[0].x,
            y: getRandomYAxis(
              seriesData[0].y,
              prev[0].y,
              randomVariationMetadata,
            ),
          },
          ...newSeriesData.filter((_, i) => i !== 0),
        ])
        /* Atualizar segundo atual do randomVariationMetadata */
        setRandomVariationMetadata((prev) => {
          if (prev === null) return null

          return {
            ...prev,
            secondsCount: prev.secondsCount + 1,
          }
        })
      }
    }, 1000 * 1) // 1 second

    return () => clearInterval(intervalId)
  }, [seriesData, randomVariationMetadata, newSeriesData, setNewSeriesData])

  useEffect(() => {
    /* Restart chart on currency change */
    setNewSeriesData(seriesData)

    /* Cada variação deve ter no mínimo 15 segundos, portanto restam 14 para randomizar */
    const firstLimit = Math.random() < 0.5 ? 'max' : 'min'
    const secondsToFirstLimit = Math.ceil(Math.random() * 14) + 15
    setRandomVariationMetadata({
      secondsCount: 0,
      firstLimit,
      secondsToFirstLimit,
    })
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
