import { describe, expect, it } from 'vitest'

import { buildEventWhere } from '@/blocks/EventSuite/eventWhere'

describe('event range queries', () => {
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
