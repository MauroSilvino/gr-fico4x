import React from 'react'
import type { CandleData } from 'charts-api'

import { CandleChart } from '@/components/CandleChart'

interface DashboardViewProps {
  candleChartData: CandleData
}

export const DashboardView = ({ candleChartData }: DashboardViewProps) => {
  return (
    <main>
      <CandleChart candleChartData={candleChartData} />
    </main>
  )
}
