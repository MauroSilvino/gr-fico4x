import React, { useEffect, useState } from 'react'
import type { CandleData } from 'charts-api'

import { CandleChart } from './CandleChart'
import { AsideBar } from './AsideBar'

interface CandleChartProps {
  candleChartData: CandleData
  userBalance: number
}

export const ChartWrapper = ({
  candleChartData,
  userBalance,
}: CandleChartProps) => {
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
      <CandleChart annotations={annotations} seriesData={seriesData} />
      <AsideBar onMark={onMark} userBalance={userBalance} />
    </div>
  )
}
