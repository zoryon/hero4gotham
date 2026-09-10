import React from 'react'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { EventFiltersClient } from '@/blocks/EventFilters/Component.client'
import { EventFiltersProvider, useEventFilters } from '@/providers/EventFilters'

const Selection = () => {
  const { date, dateTo } = useEventFilters()
  return React.createElement('output', { 'data-testid': 'selection' }, `${date}/${dateTo}`)
}

afterEach(() => {
  cleanup()
  window.history.replaceState({}, '', '/')
})

describe('date range picker', () => {
  it('waits for both endpoints, accepts reverse selection and clears the range', () => {
    window.history.replaceState({}, '', '/?date=2026-10-03')
    render(
      React.createElement(EventFiltersProvider, {
        children: React.createElement(
          React.Fragment,
          null,
          React.createElement(EventFiltersClient, {
            blockType: 'eventFilters',
            allEventsLabel: 'Tutti gli eventi',
            allVenuesLabel: 'Tutti i luoghi',
            filterByLabel: 'Filtra per',
            searchPlaceholder: 'Cerca un evento...',
            dateLabel: 'Data',
            typeLabel: 'Tipologia',
            venueLabel: 'Luogo',
            activities: [],
            venues: [],
          }),
          React.createElement(Selection),
        ),
      }),
    )
    fireEvent.click(screen.getByRole('button', { name: 'Data' }))
    const dayLabel = (day: number) =>
      new Intl.DateTimeFormat('it-IT', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).format(new Date(2026, 9, day))
    fireEvent.click(screen.getByRole('button', { name: dayLabel(15) }))
    expect(screen.getByTestId('selection').textContent).toBe('2026-10-03/')
    expect(screen.getByText('Seleziona la data di fine')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: dayLabel(10) }))
    expect(screen.getByTestId('selection').textContent).toBe('2026-10-10/2026-10-15')
    fireEvent.click(screen.getByRole('button', { name: 'Data' }))
    expect(screen.getAllByRole('button', { pressed: true })).toHaveLength(6)
    fireEvent.click(screen.getByRole('button', { name: 'Tutte le date' }))
    expect(screen.getByTestId('selection').textContent).toBe('/')
  })
})
