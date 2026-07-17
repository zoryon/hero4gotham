import configPromise from '@payload-config'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'

import { getEventCalendarDateParts } from './date'

export type EventCalendarActivityMarker = {
  color?: null | string
  id: number | string
  label: string
}

export type EventCalendarDayMarker = {
  activities: EventCalendarActivityMarker[]
  day: number
}

type CalendarEventActivity =
  | {
      color?: null | string
      id: number | string
      shortName?: null | string
      title?: null | string
    }
  | number
  | null

type CalendarEventResult = {
  activity?: CalendarEventActivity
  startsAt: string
}

type CalendarActivityResult = {
  color?: null | string
  id: number | string
  shortName?: null | string
  title?: null | string
}

const getMonthRange = (year: number, monthIndex: number) => ({
  // Include the UTC dates on either side, then filter in Europe/Rome below.
  // This keeps events around midnight and DST boundaries in the correct month.
  end: new Date(Date.UTC(year, monthIndex + 1, 2)),
  start: new Date(Date.UTC(year, monthIndex, 0)),
})

const getActivityMarker = (activity: CalendarEventActivity): EventCalendarActivityMarker => {
  if (activity && typeof activity === 'object') {
    return {
      color: activity.color || null,
      id: activity.id,
      label: activity.shortName || activity.title || 'Evento',
    }
  }

  return {
    color: null,
    id: 'events',
    label: 'Eventi',
  }
}

export const getEventCalendarMarkers = unstable_cache(
  async (year: number, monthIndex: number): Promise<EventCalendarDayMarker[]> => {
    const { end, start } = getMonthRange(year, monthIndex)
    const payload = await getPayload({ config: configPromise })

    const result = await payload.find({
      collection: 'events',
      depth: 1,
      limit: 100,
      pagination: false,
      select: {
        activity: true,
        startsAt: true,
      },
      sort: 'startsAt',
      where: {
        startsAt: {
          greater_than_equal: start.toISOString(),
          less_than: end.toISOString(),
        },
      },
    })

    const dayMarkers = new Map<number, Map<string, EventCalendarActivityMarker>>()

    for (const event of result.docs as CalendarEventResult[]) {
      const eventDate = getEventCalendarDateParts(event.startsAt)

      if (eventDate.year !== year || eventDate.month !== monthIndex + 1) continue

      const day = eventDate.day
      const activityMarker = getActivityMarker(event.activity || null)
      const activityKey = String(activityMarker.id)
      const activities = dayMarkers.get(day) || new Map<string, EventCalendarActivityMarker>()

      activities.set(activityKey, activityMarker)
      dayMarkers.set(day, activities)
    }

    return Array.from(dayMarkers.entries())
      .map(([day, activities]) => ({
        activities: Array.from(activities.values()),
        day,
      }))
      .sort((a, b) => a.day - b.day)
  },
  ['event-calendar-markers-v3'],
  {
    revalidate: 300,
    tags: ['events', 'activities'],
  },
)

export const getEventCalendarLegendItems = unstable_cache(
  async (): Promise<EventCalendarActivityMarker[]> => {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'activities',
      depth: 0,
      limit: 100,
      pagination: false,
      select: {
        color: true,
        order: true,
        shortName: true,
        title: true,
      },
      sort: 'order',
    })

    return (result.docs as CalendarActivityResult[]).map((activity) => ({
      color: activity.color || null,
      id: activity.id,
      label: activity.shortName || activity.title || 'Evento',
    }))
  },
  ['event-calendar-legend-items'],
  {
    revalidate: 300,
    tags: ['activities'],
  },
)
