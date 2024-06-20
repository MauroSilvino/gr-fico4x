import React from 'react'
import type { CandleData } from 'charts-api'

import { CandleChart } from '@/components/CandleChart'

interface HomeViewProps {
  candleChartData: CandleData
}

export const HomeView = ({ candleChartData }: HomeViewProps) => {
  return (
    <main>
      <h1 className="text-xl font-medium">Home</h1>
      <div>
        <CandleChart candleChartData={candleChartData} />
      </div>
    </main>
  )
}
