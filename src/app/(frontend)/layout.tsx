import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import { Rye } from 'next/font/google'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'

const rye = Rye({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-rye',
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()
  const themeColors = await getCachedGlobal('themeColors', 1)().catch(() => null)
  const textColors = themeColors?.text
  const backgroundColors = themeColors?.background
  const vintageBorderImage =
    themeColors?.vintageBorderImage && typeof themeColors.vintageBorderImage === 'object'
      ? getMediaUrl(themeColors.vintageBorderImage.url, themeColors.vintageBorderImage.updatedAt)
      : ''
  const themeColorStyle = {
    '--theme-text-primary': textColors?.primary || '#f4f4f5',
    '--theme-text-secondary': textColors?.secondary || '#fde68a',
    '--theme-text-muted': textColors?.muted || 'rgb(253 230 138 / 0.85)',
    '--theme-text-accent': textColors?.accent || '#a3e635',
    '--theme-text-green': textColors?.green || '#90a434',
    '--theme-background-container-overflow':
      backgroundColors?.backgroundContainerOverflow || '#050505',
    ...(vintageBorderImage
      ? {
          '--vintage-border-image': `url("${vintageBorderImage.replace(/"/g, '\\"')}")`,
        }
      : {}),
  } as React.CSSProperties

  return (
    <html
      className={cn(GeistSans.variable, GeistMono.variable, rye.variable)}
      lang="en"
      suppressHydrationWarning
      style={themeColorStyle}
    >
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>
        <Providers>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />

          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
}
