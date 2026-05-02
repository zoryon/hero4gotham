'use client'

import React, { createContext, useContext, useMemo, useState } from 'react'

export type EventFilterState = {
  activityId: 'all' | number
  date: string
  query: string
  venue: string
}

type EventFiltersContextValue = EventFilterState & {
  clearFilters: () => void
  setActivityId: (activityId: EventFilterState['activityId']) => void
  setDate: (date: string) => void
  setQuery: (query: string) => void
  setVenue: (venue: string) => void
}

const initialEventFilters: EventFilterState = {
  activityId: 'all',
  date: '',
  query: '',
  venue: '',
}

const EventFiltersContext = createContext<EventFiltersContextValue | null>(null)

export const EventFiltersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const parentContext = useContext(EventFiltersContext)
  const [filters, setFilters] = useState<EventFilterState>(initialEventFilters)

  const value = useMemo<EventFiltersContextValue>(
    () => ({
      ...filters,
      clearFilters: () => setFilters(initialEventFilters),
      setActivityId: (activityId) => setFilters((current) => ({ ...current, activityId })),
      setDate: (date) => setFilters((current) => ({ ...current, date })),
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
