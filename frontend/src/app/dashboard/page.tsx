'use server'

import React from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidateTag } from 'next/cache'

import { decodeJWT } from '@/utils/decodeJWT'
import { DashboardView } from '@/layouts/DashboardView'
import { fetchAPI } from '@/utils/fetchAPI'

export default async function DashboardPage() {
  const authToken = cookies().get('grafico_auth')?.value
  const userToken = cookies().get('grafico_user')?.value
  if (!authToken || !userToken) redirect('/login')

  const user = decodeJWT(userToken)
  if (!user) redirect('/login')

  const userBalanceResponse = await fetchAPI<{ balance?: number }>('/balance', {
    cache: 'no-cache',
    next: { tags: ['entry'] },
    headers: {
      authorization: `Bearer ${authToken}`,
    },
  })
  if (!userBalanceResponse.ok || !userBalanceResponse.data) redirect('/login')

  const userBalance = userBalanceResponse.data.balance ?? 0

  async function handleEntry(entryValue: number) {
    'use server'

    const handleEntryResponse = await fetchAPI(`/new-entry/${entryValue}`, {
      method: 'PATCH',
      headers: {
        authorization: `Bearer ${authToken}`,
      },
    })

    revalidateTag('entry')
    return handleEntryResponse.ok
  }

  return <DashboardView userBalance={userBalance} handleEntry={handleEntry} />
}
