'use client'

import React from 'react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="flex h-screen w-screen items-center">
      <div className="mx-auto w-full max-w-sm rounded-md border border-neutral-300 bg-background-light px-5 py-6 shadow-md dark:border-neutral-800 dark:bg-background-dark">
        <img
          className="mx-auto mb-3 h-24 w-auto"
          src="/logo.svg"
          alt="Empresa Logo"
        />
        <h1 className="text-center text-xl">Página Não Encontrada</h1>
        <Link
          className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-md bg-primary text-base font-medium text-white shadow-sm transition-all hover:bg-secondary"
          href="/"
        >
          Retornar
        </Link>
      </div>
    </main>
  )
}
