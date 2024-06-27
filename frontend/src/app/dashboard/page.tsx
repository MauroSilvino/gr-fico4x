import React from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { CandleData } from 'charts-api'

import { fetchAPI } from '@/utils/fetchAPI'
import { DashboardView } from '@/layouts/DashboardView'

export default async function DashboardPage() {
  const token = cookies().get('grafico_user')?.value
  if (!token) redirect('/login')

  const candleChartRes = await fetchAPI<{
    candleChartData?: CandleData
    message?: string
  }>('/candle', {
    next: { tags: ['update-candle-data'] },
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
  if (!candleChartRes.data)
    return <h1>Ocorreu um erro. Tente novamente mais tarde...</h1>
  if (
    candleChartRes.data.message &&
    candleChartRes.data.message === 'No Chart Data Found'
  )
    return (
      <h1>
        Não há dados disponíveis no momento. Tente novamente mais tarde...
      </h1>
    )

  const candleChartData = candleChartRes.data.candleChartData
  if (!candleChartData) redirect('/login')

  return <DashboardView candleChartData={candleChartData} />
}
