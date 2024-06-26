import type { Metadata } from 'next'

import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'X Software House',
  description: 'X Software House',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className="dark scroll-smooth">
      <body className="relative min-h-screen bg-body-light text-neutral-700 dark:bg-body-dark dark:text-neutral-50">
        {children}
      </body>
    </html>
  )
}
