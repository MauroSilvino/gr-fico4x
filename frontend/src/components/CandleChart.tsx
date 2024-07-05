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
    <div className="min-h-screen bg-gray-800 p-2 md:px-4 md:py-3">
      {/* Botões para trocar as moedas */}
      <div className="inline-flex flex-wrap gap-1 md:mx-3 md:gap-3">
        <button
          className="inline-flex items-center rounded-md border border-gray-700 px-2 py-2 transition-all hover:bg-gray-700 md:px-3"
          type="button"
          onClick={() => setCurrency('EUR_USD')}
        >
          <div className="relative mr-1 block size-6">
            <img
              className="absolute bottom-1.5 right-1.5 block size-5"
              width={20}
              height={20}
              src="./european_flag.png"
              alt="EUR flag"
            />
            <img
              className="absolute left-1.5 top-1.5 z-[2] block size-5"
              width={20}
              height={20}
              src="./us_flag.png"
              alt="US flag"
            />
          </div>
          <span className="text-xs text-white md:text-sm">EUR/USD</span>
        </button>
        <button
          className="inline-flex items-center rounded-md border border-gray-700 px-2 py-2 transition-all hover:bg-gray-700 md:px-3"
          type="button"
          onClick={() => setCurrency('EUR_JPY')}
        >
          <div className="relative mr-1 block size-6">
            <img
              className="absolute bottom-1.5 right-1.5 block size-5"
              width={20}
              height={20}
              src="./european_flag.png"
              alt="EUR flag"
            />
            <img
              className="absolute left-1.5 top-1.5 z-[2] block size-5"
              width={20}
              height={20}
              src="./japan_flag.png"
              alt="JPY flag"
            />
          </div>
          <span className="text-xs text-white md:text-sm">EUR/JPY</span>
        </button>
        <button
          className="inline-flex items-center rounded-md border border-gray-700 px-2 py-2 transition-all hover:bg-gray-700 md:px-3"
          type="button"
          onClick={() => setCurrency('USD_BRL')}
        >
          <div className="relative mr-1 block size-6">
            <img
              className="absolute bottom-1.5 right-1.5 block size-5"
              width={20}
              height={20}
              src="./us_flag.png"
              alt="US flag"
            />
            <img
              className="absolute left-1.5 top-1.5 z-[2] block size-5"
              width={20}
              height={20}
              src="./br_flag.png"
              alt="BR flag"
            />
          </div>
          <span className="text-xs text-white md:text-sm">USD/BRL</span>
        </button>
        <button
          className="inline-flex items-center rounded-md border border-gray-700 px-2 py-2 transition-all hover:bg-gray-700 md:px-3"
          type="button"
          onClick={() => setCurrency('USD_CAD')}
        >
          <div className="relative mr-1 block size-6">
            <img
              className="absolute bottom-1.5 right-1.5 block size-5"
              width={20}
              height={20}
              src="./us_flag.png"
              alt="US flag"
            />
            <img
              className="absolute left-1.5 top-1.5 z-[2] block size-5"
              width={20}
              height={20}
              src="./ca_flag.png"
              alt="CAD flag"
            />
          </div>
          <span className="text-xs text-white md:text-sm">USD/CAD</span>
        </button>
        <button
          className="inline-flex items-center rounded-md border border-gray-700 px-2 py-2 transition-all hover:bg-gray-700 md:px-3"
          type="button"
          onClick={() => setCurrency('GBP_JPY')}
        >
          <div className="relative mr-1 block size-6">
            <img
              className="absolute bottom-1.5 right-1.5 block size-5"
              width={20}
              height={20}
              src="./uk_flag.png"
              alt="GBP flag"
            />
            <img
              className="absolute left-1.5 top-1.5 z-[2] block size-5"
              width={20}
              height={20}
              src="./japan_flag.png"
              alt="JPY flag"
            />
          </div>
          <span className="text-xs text-white md:text-sm">GBP/JPY</span>
        </button>
      </div>
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

        {/* Botões na lateral direita */}
        <div className="flex w-[4.5rem] flex-col items-end justify-center gap-2 lg:w-28">
          <button
            className="flex h-16 w-16 flex-col items-center justify-center rounded-md bg-green-600 p-2 text-center transition-all hover:bg-green-700 lg:h-24 lg:w-24 lg:p-4"
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
            className="flex h-16 w-16 flex-col items-center justify-center rounded-md bg-red-600 p-2 text-center transition-all hover:bg-red-900 lg:h-24 lg:w-24 lg:p-4"
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
