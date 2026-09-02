import React from 'react'

import { HeaderThemeProvider } from './HeaderTheme'
import { ThemeProvider } from './Theme'
import { SiteCopyProvider } from './SiteCopy'
import type { SiteCopyData } from '@/SiteCopy/defaults'

export const Providers: React.FC<{
  children: React.ReactNode
  siteCopy: SiteCopyData
}> = ({ children, siteCopy }) => {
  return (
    <ThemeProvider>
      <SiteCopyProvider copy={siteCopy}>
        <HeaderThemeProvider>{children}</HeaderThemeProvider>
      </SiteCopyProvider>
    </ThemeProvider>
  )
}
