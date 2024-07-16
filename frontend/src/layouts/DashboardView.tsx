'use client'

import React, { useCallback, useEffect, useState } from 'react'
import type { CandleData } from 'charts-api'

import { CurrencySelector } from '@/components/CurrencySelector'
import { ChartWrapper } from '@/components/ChartWrapper'

export type Currency = 'EUR_USD' | 'EUR_JPY' | 'USD_BRL' | 'USD_CAD' | 'GBP_JPY'

interface DashboardViewProps {
  userBalance: number
  handleEntry(entryValue: number): Promise<boolean>
}

export const DashboardView = ({
  userBalance,
  handleEntry,
}: DashboardViewProps) => {
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
          <CurrencySelector currency={currency} setCurrency={setCurrency} />
          <ChartWrapper
            candleChartData={candleChartData}
            userBalance={userBalance}
            handleEntry={handleEntry}
          />
        </div>
      )}
      {!candleChartData && <h1>Carregando...</h1>}
    </main>
  )
}
