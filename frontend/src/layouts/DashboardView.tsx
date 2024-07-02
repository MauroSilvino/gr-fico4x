'use client'

import React, { useEffect, useState } from 'react'
import type { CandleData } from 'charts-api'

import { CandleChart } from '@/components/CandleChart'

export type Currency = 'EUR_USD' | 'EUR_JPY' | 'USD_BRL' | 'USD_CAD' | 'GBP_JPY'

export const DashboardView = () => {
  const [currency, setCurrency] = useState<Currency>('EUR_USD')
  const [candleChartData, setCandleChartData] = useState<CandleData | null>(
    null,
  )

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080')

    ws.onopen = async function () {
      ws.send(JSON.stringify(currency))
    }

    ws.onmessage = function (msg) {
      const candleData = JSON.parse(msg.data)
      setCandleChartData(candleData)
    }

    // Update Chart every minute
    setInterval(async () => {
      ws.send(JSON.stringify(currency))
    }, 1000 * 60) // 60 seconds
  }, [currency])

  return (
    <main>
      {candleChartData && (
        <CandleChart
          candleChartData={candleChartData}
          setCurrency={setCurrency}
        />
      )}
      {!candleChartData && <h1>Carregando...</h1>}
    </main>
  )
}
