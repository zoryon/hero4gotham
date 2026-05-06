import React from 'react'

import { EventListClient } from '@/blocks/EventSuite/EventList/Component.client'
import { eventSuiteSelect, type EventSuiteItem } from '@/blocks/EventSuite/shared'
import configPromise from '@payload-config'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'

type Props = React.ComponentProps<typeof EventListClient> & {
  maxEvents?: null | number
}

const getUpcomingEvents = unstable_cache(
  async (limit: number): Promise<EventSuiteItem[]> => {
    const payload = await getPayload({ config: configPromise })
    const now = new Date()
    now.setHours(0, 0, 0, 0)

    const result = await payload.find({
      collection: 'events',
      depth: 1,
      limit,
      pagination: false,
      select: eventSuiteSelect,
      sort: 'startsAt',
      where: {
        startsAt: {
          greater_than_equal: now.toISOString(),
        },
      },
    })

    return result.docs as EventSuiteItem[]
  },
  ['event-list-upcoming'],
  {
    revalidate: 300,
    tags: ['events'],
  },
)

export const EventListBlock = async ({ maxEvents = 30, ...props }: Props) => {
  const limit = Math.min(Math.max(maxEvents || 30, 5), 100)
  const events = await getUpcomingEvents(limit)

  return <EventListClient {...props} events={events} />
}
