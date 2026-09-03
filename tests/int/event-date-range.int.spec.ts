import { describe, expect, it } from 'vitest'

import {
  formatEventDateRange,
  getEventDaysInMonth,
  isEventPast,
  validateEventEndDate,
} from '@/blocks/EventSuite/eventDates'

describe('event date ranges', () => {
  it('formats a single-day event without exposing its stored time', () => {
    expect(formatEventDateRange('2026-10-01T18:30:00.000Z')).toEqual({
      day: '1',
      endDay: null,
      long: '1 ottobre 2026',
      month: 'OTT',
      short: '1 OTT 2026',
      startDay: '1',
      weekday: 'GIOVEDÌ',
      year: '2026',
    })
  })

  it('formats a range in the same month compactly', () => {
    expect(
      formatEventDateRange('2026-10-01T00:00:00.000Z', '2026-10-04T00:00:00.000Z'),
    ).toEqual({
      day: '1–4',
      endDay: '4',
      long: '1–4 ottobre 2026',
      month: 'OTT',
      short: '1–4 OTT 2026',
      startDay: '1',
      weekday: 'GIO–DOM',
      year: '2026',
    })
  })

  it('includes both months when a range crosses a month boundary', () => {
    expect(
      formatEventDateRange('2026-09-30T00:00:00.000Z', '2026-10-02T00:00:00.000Z'),
    ).toMatchObject({
      day: '30–2',
      endDay: '2',
      long: '30 settembre–2 ottobre 2026',
      month: 'SET–OTT',
      short: '30 SET–2 OTT 2026',
      startDay: '30',
    })
  })

  it('uses the optional end date to decide when an event has passed', () => {
    const start = '2026-10-01T00:00:00.000Z'
    const end = '2026-10-04T00:00:00.000Z'

    expect(isEventPast(start, end, new Date('2026-10-04T12:00:00.000Z'))).toBe(false)
    expect(isEventPast(start, end, new Date('2026-10-05T12:00:00.000Z'))).toBe(true)
  })

  it('returns every covered day inside the requested calendar month', () => {
    expect(
      getEventDaysInMonth(
        '2026-09-30T00:00:00.000Z',
        '2026-10-02T00:00:00.000Z',
        2026,
        9,
      ),
    ).toEqual([1, 2])
  })
})

describe('event end-date validation', () => {
  it('rejects an end date before the start date', () => {
    expect(
      validateEventEndDate('2026-09-30T00:00:00.000Z', {
        siblingData: { startsAt: '2026-10-01T00:00:00.000Z' },
      }),
    ).toBe('La data di fine non può precedere la data di inizio.')
  })

  it('accepts an omitted or same-day end date', () => {
    const context = { siblingData: { startsAt: '2026-10-01T00:00:00.000Z' } }

    expect(validateEventEndDate(null, context)).toBe(true)
    expect(validateEventEndDate('2026-10-01T20:00:00.000Z', context)).toBe(true)
  })
})
