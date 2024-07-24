'use client'

import React, { useEffect, useState } from 'react'
import type { Currency } from 'charts-api'

import { CurrencySelector } from '@/components/CurrencySelector'
import { ChartWrapper } from '@/components/ChartWrapper'

interface DashboardViewProps {
  userBalance: number
  handleEntry(entryValue: number): Promise<boolean>
}

export const DashboardView = ({
  userBalance,
  handleEntry,
}: DashboardViewProps) => {
  const [currency, setCurrency] = useState<Currency>('EUR_USD')
  const [annotations, setAnnotations] = useState<ApexAnnotations>({
    yaxis: [],
    xaxis: [],
    points: [],
  })

  useEffect(() => {
    const hasStorageMarkers = localStorage.getItem('grafico_mark')
    const markers = hasStorageMarkers ? JSON.parse(hasStorageMarkers) : null
    if (markers) setAnnotations(markers)
  }, [])

  return (
    <main>
      <div className="min-h-screen bg-gray-800 p-2 md:px-4 md:py-3">
        <CurrencySelector currency={currency} setCurrency={setCurrency} />
        <ChartWrapper
          annotations={annotations}
          currency={currency}
          setAnnotations={setAnnotations}
          userBalance={userBalance}
          handleEntry={handleEntry}
        />
      </div>
    </main>
  )
}
