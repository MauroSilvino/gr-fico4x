import React from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { decodeJWT } from '@/utils/decodeJWT'
import { DashboardView } from '@/layouts/DashboardView'

export default async function DashboardPage() {
  const authToken = cookies().get('grafico_auth')?.value
  const userToken = cookies().get('grafico_user')?.value
  if (!authToken || !userToken) redirect('/login')

  const user = decodeJWT(userToken)
  if (!user) redirect('/login')

  return <DashboardView />
}
