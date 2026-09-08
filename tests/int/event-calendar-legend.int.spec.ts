import { beforeEach, describe, expect, it, vi } from 'vitest'

const { find } = vi.hoisted(() => ({ find: vi.fn() }))

vi.mock('@payload-config', () => ({ default: {} }))
vi.mock('payload', () => ({ getPayload: vi.fn(async () => ({ find })) }))
vi.mock('next/cache', () => ({ unstable_cache: (fn: unknown) => fn }))

import {
  getEventCalendarLegendItems,
  getEventCalendarMarkers,
} from '@/blocks/EventSuite/EventCalendar/queries'

describe('calendar legend visibility', () => {
  beforeEach(() => find.mockReset())

  it('excludes opted-out activities and keeps unchecked and existing activities', async () => {
    find.mockResolvedValue({
      docs: [
        { id: 1, shortName: 'Hidden', hideFromCalendarLegend: true },
        { id: 2, shortName: 'Visible', hideFromCalendarLegend: false },
        { id: 3, title: 'Legacy' },
        { id: 4, title: 'Unset', hideFromCalendarLegend: null },
      ],
    })

    expect((await getEventCalendarLegendItems()).map((item) => item.label)).toEqual([
      'Visible',
      'Legacy',
      'Unset',
    ])
    expect(find.mock.calls[0][0].select.hideFromCalendarLegend).toBe(true)
  })

  it('keeps calendar day markers for activities hidden from the legend', async () => {
    find.mockResolvedValue({
      docs: [
        {
          startsAt: '2026-09-07T12:00:00.000Z',
          activity: { id: 1, shortName: 'Hidden', color: '#f04e4e', hideFromCalendarLegend: true },
        },
      ],
    })

    expect(await getEventCalendarMarkers(2026, 8)).toEqual([
      { day: 7, activities: [{ id: 1, label: 'Hidden', color: '#f04e4e' }] },
    ])
  })
})
