'use client'

import React, { createContext, useContext } from 'react'

import { siteCopyDefaults, type SiteCopyData } from '@/SiteCopy/defaults'

const SiteCopyContext = createContext<SiteCopyData>(siteCopyDefaults)

export const SiteCopyProvider = ({
  children,
  copy,
}: {
  children: React.ReactNode
  copy: SiteCopyData
}) => <SiteCopyContext.Provider value={copy}>{children}</SiteCopyContext.Provider>

export const useSiteCopy = () => useContext(SiteCopyContext)
