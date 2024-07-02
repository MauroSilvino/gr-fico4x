import dynamic from 'next/dynamic'
import React, { useEffect, useState } from 'react'
import type { CandleData } from 'charts-api'
import type { ApexOptions } from 'apexcharts'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })
import { Currency } from '@/layouts/DashboardView'

interface CandleChartProps {
  candleChartData: CandleData
  setCurrency: React.Dispatch<React.SetStateAction<Currency>>
}

export const CandleChart = ({
  candleChartData,
  setCurrency,
}: CandleChartProps) => {
  const [annotations, setAnnotations] = useState<ApexAnnotations>({
    xaxis: [],
    yaxis: [],
  })

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
    colors: ['#3B82F6'],
    xaxis: {
      type: 'datetime',
    },
    grid: {
      borderColor: 'rgba(114, 100, 100, 0.22)', // Linhas horizontais quase transparentes
    },
    yaxis: {
      labels: {
        formatter: function (value: number) {
          return value.toFixed(2)
        },
      },
    },
    annotations: annotations,
  }
  const mark = (position: 'above' | 'below') => {
    const latestData = seriesData[0]
    const newAnnotation = {
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
      xaxis: [...(prev.xaxis || []), newAnnotation],
      yaxis: [...(prev.yaxis || []), newAnnotation],
    }))

    const markedData = []
    // @ts-expect-error
    const data = JSON.parse(localStorage.getItem('mark'))
    if (!data) {
      markedData.push(newAnnotation)
      localStorage.setItem('mark', JSON.stringify(markedData))
    } else {
      markedData.push(...data)
      markedData.push(newAnnotation)
      localStorage.setItem('mark', JSON.stringify(markedData))
    }
  }

  useEffect(() => {
    // @ts-ignore
    let markedData = JSON.parse(localStorage.getItem('mark'))

    if (!markedData) {
      return
    }

    // @ts-ignore
    markedData.forEach((element) => {
      const anotation = {
        x: element.x,
        y: element.y,
        borderColor: element.borderColor,
        label: {
          borderColor: element.label.borderColor,
          style: {
            color: element.label.style.color,
            background: element.label.style.background,
          },
          text: element.label.text,
        },
      }
      setAnnotations((prev) => ({
        xaxis: [...(prev.xaxis || []), anotation],
        yaxis: [...(prev.yaxis || []), anotation],
      }))
    })
  }, [])

  return (
    <div className="min-h-screen bg-gray-800 p-4">
      <div className="relative rounded-lg bg-gray-800 p-4">
        <Chart
          type="candlestick"
          series={series}
          height={880}
          width="90%"
          options={options}
          className="w-full"
        />
        <div className="absolute left-4 top-4 z-10 flex space-x-4">
          {/* Botões na parte superior esquerdo */}
          <button
            className="flex items-center justify-center rounded-md bg-gray-700 px-4 py-2 text-white hover:bg-gray-600"
            type="button"
            onClick={() => setCurrency('EUR_USD')}
          >
            EUR/USD
          </button>
          <button
            className="flex items-center justify-center rounded-md bg-gray-700 px-4 py-2 text-white hover:bg-gray-600"
            type="button"
            onClick={() => setCurrency('GBP_JPY')}
          >
            EUR/JPY
          </button>
          <button
            className="flex items-center justify-center rounded-md bg-gray-700 px-4 py-2 text-white hover:bg-gray-600"
            type="button"
            onClick={() => setCurrency('USD_BRL')}
          >
            USD/BRL
          </button>
          <button
            className="flex items-center justify-center rounded-md bg-gray-700 px-4 py-2 text-white hover:bg-gray-600"
            type="button"
            onClick={() => setCurrency('USD_CAD')}
          >
            USD/CAD
          </button>
          <button
            className="flex items-center justify-center rounded-md bg-gray-700 px-4 py-2 text-white hover:bg-gray-600"
            type="button"
            onClick={() => setCurrency('GBP_JPY')}
          >
            GBP/JPY
          </button>
        </div>
        <div className="absolute right-4 top-1/2 flex -translate-y-1/2 transform flex-col items-center space-y-5">
          {/* Botões na lateral direita */}
          <button
            className="z-10 box-border flex h-16 w-16 flex-col items-center justify-center rounded-md bg-green-500 p-2 text-center hover:bg-green-600 lg:h-24 lg:w-24 lg:p-4"
            type="button"
            onClick={() => mark('above')}
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
            className="z-0 box-border flex h-16 w-16 flex-col items-center justify-center rounded-md bg-red-500 p-2 text-center hover:bg-red-600 lg:h-24 lg:w-24 lg:p-4"
            type="button"
            onClick={() => mark('below')}
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
    </div>
  )
}
