'use client'

import { getEventFilterParamsFromSearchParams } from '@/blocks/EventSuite/filters'
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

export type EventFilterState = {
  activityId: 'all' | number
  date: string
  dateTo: string
  query: string
  venue: string
}

type EventFiltersContextValue = EventFilterState & {
  clearFilters: () => void
  setActivityId: (activityId: EventFilterState['activityId']) => void
  setDateRange: (date: string, dateTo: string) => void
  setQuery: (query: string) => void
  setVenue: (venue: string) => void
}

const initialEventFilters: EventFilterState = {
  activityId: 'all',
  date: '',
  dateTo: '',
  query: '',
  venue: '',
}

const EventFiltersContext = createContext<EventFiltersContextValue | null>(null)

export const EventFiltersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const parentContext = useContext(EventFiltersContext)
  const [filters, setFilters] = useState<EventFilterState>(initialEventFilters)

  useEffect(() => {
    const urlFilters = getEventFilterParamsFromSearchParams(
      new URLSearchParams(window.location.search),
    )
    setFilters({
      activityId: typeof urlFilters.activityId === 'number' ? urlFilters.activityId : 'all',
      date: urlFilters.date || '',
      dateTo: urlFilters.dateTo || '',
      query: urlFilters.query || '',
      venue: urlFilters.venue || '',
    })
  }, [])

  const value = useMemo<EventFiltersContextValue>(
    () => ({
      ...filters,
      clearFilters: () => setFilters(initialEventFilters),
      setActivityId: (activityId) => setFilters((current) => ({ ...current, activityId })),
      setDateRange: (date, dateTo) => setFilters((current) => ({ ...current, date, dateTo })),
      setQuery: (query) => setFilters((current) => ({ ...current, query })),
      setVenue: (venue) => setFilters((current) => ({ ...current, venue })),
    }),
    [filters],
  )

  if (parentContext) return children

  return <EventFiltersContext.Provider value={value}>{children}</EventFiltersContext.Provider>
}

export const useEventFilters = () => {
  const context = useContext(EventFiltersContext)

  if (!context) {
    throw new Error('useEventFilters must be used within EventFiltersProvider')
  }

  return context
}
