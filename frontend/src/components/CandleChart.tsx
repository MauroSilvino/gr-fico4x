import dynamic from 'next/dynamic'
import React, { useEffect, useState } from 'react'
import type { CandleData } from 'charts-api'
import type { ApexOptions } from 'apexcharts'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface CandleChartProps {
  candleChartData: CandleData
}

export const CandleChart = ({ candleChartData }: CandleChartProps) => {
  const [annotations, setAnnotations] = useState<ApexAnnotations>({
    yaxis: [],
  })

  const seriesData = candleChartData.data?.map((obj) => {
    const objKey = Object.keys(obj)[0]
    const values = Object.values(obj[objKey]).map(Number) // Convertendo para números
    return {
      x: new Date(objKey).toISOString(),
      y: values as [number, number, number, number], // Números das velas (open, high, low, close)
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

  function onMark(position: 'above' | 'below') {
    const latestData = seriesData[0]

    const newYAxisAnnotation = {
      x: latestData.x,
      y: latestData.y[3],
      borderColor: position === 'above' ? 'green' : 'red',
      label: {
        borderColor: position === 'above' ? 'green' : 'red',
        style: {
          color: '#fff',
          background: position === 'above' ? 'green' : 'red',
        },
        text: position === 'above' ? 'Acima' : 'Abaixo',
      },
    }
    setAnnotations((prev) => ({
      yaxis: [...(prev.yaxis || []), newYAxisAnnotation],
    }))

    /* Save Markers on Local Storage */
    const storageMarkers = JSON.parse(
      localStorage.getItem('grafico_mark') ?? '[]',
    )
    const markers = [...storageMarkers, newYAxisAnnotation]
    localStorage.setItem('grafico_mark', JSON.stringify(markers))
  }

  useEffect(() => {
    const markers = JSON.parse(localStorage.getItem('grafico_mark') ?? '[]')
    setAnnotations(() => ({
      yaxis: markers,
    }))
  }, [])

  return (
    <div className="flex rounded-lg bg-gray-800">
      <div className="h-[90vh] grow">
        <Chart
          type="candlestick"
          series={series}
          height="100%"
          width="100%"
          options={options}
        />
      </div>
      <div className="flex w-[4.5rem] flex-col items-end justify-center gap-2 lg:w-28">
        <button
          className="flex h-16 w-16 flex-col items-center justify-center rounded-md bg-green-600 p-2 text-center transition-all hover:bg-green-700 lg:h-24 lg:w-24 lg:p-4"
          type="button"
          onClick={() => onMark('above')}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2.5"
            stroke="currentColor"
            className="h-6 w-6 lg:h-8 lg:w-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941"
            />
          </svg>
          <p className="text-xs lg:text-lg">Comprar</p>
        </button>
        <button
          className="flex h-16 w-16 flex-col items-center justify-center rounded-md bg-red-600 p-2 text-center transition-all hover:bg-red-900 lg:h-24 lg:w-24 lg:p-4"
          type="button"
          onClick={() => onMark('below')}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2.5"
            stroke="currentColor"
            className="h-6 w-6 lg:h-8 lg:w-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 6 9 12.75l4.286-4.286a11.948 11.948 0 0 1 4.306 6.43l.776 2.898m0 0 3.182-5.511m-3.182 5.51-5.511-3.181"
            />
          </svg>
          <p className="text-xs lg:text-lg">Vender</p>
        </button>
      </div>
    </div>
  )
}
