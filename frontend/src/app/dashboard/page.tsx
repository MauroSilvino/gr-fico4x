import React from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { CandleData } from 'charts-api'

import { fetchAPI } from '@/utils/fetchAPI'
import { DashboardView } from '@/layouts/DashboardView'

export default async function DashboardPage() {
  const token = cookies().get('grafico_user')?.value
  if (!token) redirect('/login')

  const candleChartRes = await fetchAPI<{ candleChartData: CandleData }>(
    '/candle',
    {
      next: { tags: ['update-candle-data'] },
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  )
  if (!candleChartRes.data)
    return <h1>Ocorreu um erro. Tente novamente mais tarde...</h1>
  if (candleChartRes.status !== 200) redirect('/login')

  const { candleChartData } = candleChartRes.data

  return <DashboardView candleChartData={candleChartData} />
}
