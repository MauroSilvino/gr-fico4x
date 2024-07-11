import dynamic from 'next/dynamic'
import React, { useEffect, useState } from 'react'
import type { CandleData } from 'charts-api'
import type { ApexOptions } from 'apexcharts'
import { TrendingDown, TrendingUp } from 'lucide-react'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface CandleChartProps {
  candleChartData: CandleData
}

export const CandleChart = ({ candleChartData }: CandleChartProps) => {
  const [entryValue, setEntryValue] = useState(1)
  const [annotations, setAnnotations] = useState<ApexAnnotations>({
    yaxis: [],
    xaxis: [],
    points: [],
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
    const color = position === 'above' ? '#16a34a' : '#dc2626'

    const newXAxisAnnotation = {
      x: new Date(seriesData[0].x).getTime(),
      borderColor: color,
    } as XAxisAnnotations
    const newYAxisAnnotation = {
      y: latestData.y[3],
      borderColor: color,
      label: {
        borderColor: color,
        style: {
          color: '#fff',
          background: color,
        },
        text: latestData.y[3].toString(),
        position: 'left',
      },
    } as YAxisAnnotations
    const newPointAnnotation = {
      x: new Date(seriesData[0].x).getTime(),
      y: seriesData[0].y[3],
      marker: {
        size: 6,
        fillColor: color,
        strokeColor: '#fff',
        strokeWidth: 1,
      },
      // label: {
      //   borderColor: color,
      //   text: new Date(seriesData[0].x).getTime().toString(),
      // },
    } as PointAnnotations

    const newAnnotation = {
      xaxis: annotations.xaxis
        ? [...annotations.xaxis, newXAxisAnnotation]
        : [newXAxisAnnotation],
      yaxis: annotations.yaxis
        ? [...annotations.yaxis, newYAxisAnnotation]
        : [newYAxisAnnotation],
      points: annotations.points
        ? [...annotations.points, newPointAnnotation]
        : [newPointAnnotation],
    }
    setAnnotations(newAnnotation)

    /* Get Local Storage Markers */
    const storageObjStringified = localStorage.getItem('grafico_mark')
    /* Save Markers on Local Storage (No Previous annotation) */
    if (!storageObjStringified)
      localStorage.setItem('grafico_mark', JSON.stringify(newAnnotation))

    /* Save Markers on Local Storage (With Previous annotation) */
    if (storageObjStringified) {
      const storageObj = JSON.parse(storageObjStringified)
      const newObj = {
        xaxis: [...newAnnotation.xaxis, ...storageObj.xaxis],
        yaxis: [...newAnnotation.yaxis, ...storageObj.yaxis],
        points: [...newAnnotation.points, ...storageObj.points],
      }
      localStorage.setItem('grafico_mark', JSON.stringify(newObj))
    }
  }

  useEffect(() => {
    const hasStorageMarkers = localStorage.getItem('grafico_mark')
    const markers = hasStorageMarkers ? JSON.parse(hasStorageMarkers) : null
    if (markers) setAnnotations(markers)
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
        <div className="ml-4 rounded-md border border-[#4b5563] border-opacity-30 bg-[#1e2e43] px-3 py-2">
          <label
            htmlFor="value"
            className="text-base font-medium text-[#6b7280]"
          >
            Valor
          </label>
          <div className="inline-flex items-center gap-2">
            <span className="text-lg text-[#6b7280]">$</span>
            <input
              id="value"
              type="number"
              className="w-full rounded-md bg-[#1e2e43] px-1 text-base outline-none focus:ring-1 focus:ring-[#6b7280] focus:ring-opacity-40 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              value={entryValue}
              onChange={(event) => setEntryValue(Number(event.target.value))}
            />
          </div>
        </div>
        <div className="ml-4 flex w-full flex-col p-2">
          <span className="text-center text-xs text-[#eee] md:text-sm">
            Lucro
          </span>
          <span className="my-1 block text-center text-xl text-green-600 md:text-2xl lg:text-3xl xl:text-4xl">
            +85%
          </span>
          <span className="text-center text-base font-bold text-green-600 md:text-lg">
            +{(entryValue * 0.85).toFixed(2)}
          </span>
        </div>
        <button
          className="flex h-16 w-16 flex-col items-center justify-center rounded-md bg-green-600 p-2 text-center transition-all hover:bg-green-700 lg:h-24 lg:w-24 lg:p-4"
          type="button"
          onClick={() => onMark('above')}
        >
          <TrendingUp className="size-6 lg:size-7" />
          <p className="text-xs lg:text-lg">Acima</p>
        </button>
        <button
          className="flex h-16 w-16 flex-col items-center justify-center rounded-md bg-red-600 p-2 text-center transition-all hover:bg-red-900 lg:h-24 lg:w-24 lg:p-4"
          type="button"
          onClick={() => onMark('below')}
        >
          <TrendingDown className="size-6 lg:size-7" />
          <p className="text-xs lg:text-lg">Abaixo</p>
        </button>
      </div>
    </div>
  )
}
