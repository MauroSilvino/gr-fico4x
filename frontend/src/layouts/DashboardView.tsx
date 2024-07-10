'use client'

import React, { useCallback, useEffect, useState } from 'react'
import type { CandleData } from 'charts-api'

import { CandleChart } from '@/components/CandleChart'
import { CurrencySelector } from '@/components/CurrencySelector'

export type Currency = 'EUR_USD' | 'EUR_JPY' | 'USD_BRL' | 'USD_CAD' | 'GBP_JPY'

export const DashboardView = () => {
  const [currency, setCurrency] = useState<Currency>('EUR_USD')
  const [candleChartData, setCandleChartData] = useState<CandleData | null>(
    null,
  )

  const handleWebSocket = useCallback((currency: Currency) => {
    const ws = new WebSocket('ws://localhost:8080')

    ws.onopen = async () => {
      ws.send(JSON.stringify(currency))
    }

    ws.onmessage = (msg) => {
      const candleData = JSON.parse(msg.data)
      setCandleChartData(candleData)
    }
  }, [])

  useEffect(() => {
    handleWebSocket(currency)

    // Clear last interval
    const intervalId = setInterval(async () => {
      handleWebSocket(currency)
    }, 1000 * 60) // 60 seconds

    return () => clearInterval(intervalId)
  }, [handleWebSocket, currency])

  return (
    <main>
      {candleChartData && (
        <div className="min-h-screen bg-gray-800 p-2 md:px-4 md:py-3">
          <CurrencySelector setCurrency={setCurrency} />
          <CandleChart candleChartData={candleChartData} />
        </div>
      )}
      {!candleChartData && <h1>Carregando...</h1>}
    </main>
  )
}
