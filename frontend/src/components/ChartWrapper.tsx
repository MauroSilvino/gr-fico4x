import React, { useEffect, useState } from 'react'
import { connect } from 'socket.io-client'
import { toast } from 'react-toastify'
import type { CandleChartSeriesData, Currency } from 'charts-api'

import { CandleChart } from './CandleChart'
import { AsideBar } from './AsideBar'
import { Clock } from 'lucide-react'

interface CandleChartProps {
  annotations: ApexAnnotations
  currency: Currency
  userBalance: number
  setAnnotations: React.Dispatch<React.SetStateAction<ApexAnnotations>>
  handleEntry(entryValue: number): Promise<boolean>
}

export const ChartWrapper = ({
  annotations,
  currency,
  userBalance,
  setAnnotations,
  handleEntry,
}: CandleChartProps) => {
  const [candleChartSeriesData, setCandleChartSeriesData] =
    useState<CandleChartSeriesData | null>(null)
  const [secondsCount, setSecondsCount] = useState(0)

  useEffect(() => {
    const socket = connect(process.env.NEXT_PUBLIC_API_BASE_URL!)

    socket.on('connect', () => {
      socket.emit('chart_connect', JSON.stringify(currency))
    })

    socket.on('chart_update', (message) => {
      const chartData = JSON.parse(message)
      setCandleChartSeriesData(chartData)
    })

    socket.on('chart_variation', (message) => {
      const variationObject = JSON.parse(message)
      const { variation, secondsCount } = variationObject
      setSecondsCount(secondsCount)
      setCandleChartSeriesData((prev) => {
        if (prev && prev.length === 99) return [variation, ...prev]

        return prev ? [variation, ...prev.filter((_, i) => i !== 0)] : null
      })
    })

    return () => {
      socket.disconnect()
    }
  }, [currency])

  async function onMark(position: 'above' | 'below', entry: number) {
    if (entry > userBalance) {
      toast.info('Saldo insuficiente')
      return
    }

    const handleEntryResponse = await handleEntry(entry)
    if (!handleEntryResponse) {
      toast.error('Ocorreu um erro. Tente novamente mais tarde...')
      return
    }

    const color = position === 'above' ? '#16a34a' : '#dc2626'

    const latestData = candleChartSeriesData?.[0]
    if (!latestData) return

    const newXAxisAnnotation = {}
    /*
    const newXAxisAnnotation = {
      x: new Date(seriesData[0].x).getTime(),
      borderColor: color,
    } as XAxisAnnotations
    */

    const newYAxisAnnotation = {}
    /*
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
    */

    const newPointAnnotation = {
      x: new Date(latestData.x).getTime(),
      y: latestData.y[3],
      marker: {
        size: 6,
        fillColor: color,
        strokeColor: '#fff',
        strokeWidth: 1,
      },
      label: {
        borderColor: color,
        text: `$${entry}`,
      },
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

  return (
    <div className="flex rounded-lg bg-gray-800">
      <CandleChart
        candleChartSeriesData={candleChartSeriesData ?? []}
        annotations={annotations}
      />
      <AsideBar onMark={onMark} userBalance={userBalance} />
      <div className="absolute bottom-3 right-3">
        <div className="border-md flex items-center gap-1 border border-[#4b5563] border-opacity-30 bg-[#1e2e43] bg-opacity-30 px-3 py-1">
          <Clock size={16} />
          <span className="text-sm font-medium">{60 - secondsCount}</span>
        </div>
      </div>
    </div>
  )
}
