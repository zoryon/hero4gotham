import { describe, expect, it } from 'vitest'

import { getEventCalendarDateParts } from '@/blocks/EventSuite/EventCalendar/date'

describe('event calendar dates', () => {
  it('uses the Italian calendar day when the UTC date is the previous day', () => {
    expect(getEventCalendarDateParts('2026-07-16T22:30:00.000Z')).toEqual({
      day: 17,
      month: 7,
      year: 2026,
    })
  })

  it('handles the winter UTC offset', () => {
    expect(getEventCalendarDateParts('2026-01-16T23:30:00.000Z')).toEqual({
      day: 17,
      month: 1,
      year: 2026,
    })
  })
})
