import { describe, expect, it } from 'vitest'

import { buildEventWhere } from '@/blocks/EventSuite/eventWhere'
import {
  appendEventFilterSearchParams,
  getEventFilterParamsFromSearchParams,
} from '@/blocks/EventSuite/filters'

describe('event range queries', () => {
  it('includes both endpoints of a range across the Rome daylight saving change', () => {
    const query = buildEventWhere({ date: '2026-10-24', dateTo: '2026-10-26' })
    expect(query).toEqual({
      and: [
        { startsAt: { less_than: '2026-10-26T23:00:00.000Z' } },
        {
          or: [
            { endsAt: { greater_than_equal: '2026-10-23T22:00:00.000Z' } },
            {
              and: [
                { endsAt: { exists: false } },
                { startsAt: { greater_than_equal: '2026-10-23T22:00:00.000Z' } },
              ],
            },
          ],
        },
      ],
    })
  })

  it('normalizes reversed endpoints and carries both dates through requests', () => {
    const params = new URLSearchParams()
    appendEventFilterSearchParams(params, { date: '2026-10-26', dateTo: '2026-10-24' })
    expect(getEventFilterParamsFromSearchParams(params)).toMatchObject({
      date: '2026-10-24',
      dateTo: '2026-10-26',
    })
  })

  it('rejects impossible calendar dates', () => {
    expect(buildEventWhere({ date: '2026-02-31' })).toEqual({})
  })
  it('keeps ongoing multi-day events in the unfiltered upcoming list', () => {
    expect(
      buildEventWhere(undefined, {
        futureOnlyWhenUnfiltered: true,
        now: new Date('2026-10-03T12:00:00.000Z'),
      }),
    ).toEqual({
      or: [
        { endsAt: { greater_than_equal: '2026-10-02T22:00:00.000Z' } },
        {
          and: [
            { endsAt: { exists: false } },
            { startsAt: { greater_than_equal: '2026-10-02T22:00:00.000Z' } },
          ],
        },
      ],
    })
  })

  it('matches an event when the selected day overlaps its date range', () => {
    expect(buildEventWhere({ date: '2026-10-03' })).toEqual({
      and: [
        { startsAt: { less_than: '2026-10-03T22:00:00.000Z' } },
        {
          or: [
            { endsAt: { greater_than_equal: '2026-10-02T22:00:00.000Z' } },
            {
              and: [
                { endsAt: { exists: false } },
                { startsAt: { greater_than_equal: '2026-10-02T22:00:00.000Z' } },
              ],
            },
          ],
        },
      ],
    })
  })
})
