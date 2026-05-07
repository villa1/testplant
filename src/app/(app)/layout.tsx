import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { siteMetadata } from '@/utilities/siteMetadata'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { GeistMono } from 'geist/font/mono'
import { Open_Sans, Sawarabi_Mincho } from 'next/font/google'
import React from 'react'
import './globals.css'

const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-open-sans',
})

const sawarabiMincho = Sawarabi_Mincho({
  subsets: ['latin'],
  variable: '--font-sawarabi-mincho',
  weight: '400',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteMetadata.baseUrl),
  description: siteMetadata.defaultDescription,
  robots: {
    follow: true,
    index: true,
  },
  title: {
    default: siteMetadata.siteName,
    template: `%s | ${siteMetadata.siteName}`,
  },
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      className={[openSans.variable, sawarabiMincho.variable, GeistMono.variable].filter(Boolean).join(' ')}
      lang="id"
      suppressHydrationWarning
    >
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>
        <Providers>
          <AdminBar />
          <LivePreviewListener />

          <div className="app-shell">
            <Header />
            <main className="app-main">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}
