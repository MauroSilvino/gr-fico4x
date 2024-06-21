import React from 'react'
import type { CandleData } from 'charts-api'

import { HomeView } from '@/layouts/HomeView'
import { fetchAPI } from '@/utils/fetchAPI'

export default async function HomePage() {
  const candleChartRes = await fetchAPI<{ candleChartData: CandleData }>(
    '/candle',
    {
      next: { tags: ['update-candle-data'] },
      headers: {
        Accept: 'application/json',
      },
    },
  )
  if (!candleChartRes.data)
    return <h1>Ocorreu um erro. Tente novamente mais tarde...</h1>

  const { candleChartData } = candleChartRes.data

  return <HomeView candleChartData={candleChartData} />
}
