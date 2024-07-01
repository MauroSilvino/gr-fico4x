'use client'

import React, { useEffect, useState } from 'react'
import type { CandleData } from 'charts-api'

import { CandleChart } from '@/components/CandleChart'

export const DashboardView = () => {
  const [candleChartData, setCandleChartData] = useState<CandleData | null>(
    null,
  )

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080')

    ws.onmessage = function (msg) {
      console.log('Fetching Data...')
      const candleData = JSON.parse(msg.data)
      setCandleChartData(candleData)
    }
  }, [])

  return (
    <main>
      {candleChartData && <CandleChart candleChartData={candleChartData} />}
      {!candleChartData && <h1>Carregando...</h1>}
    </main>
  )
}
