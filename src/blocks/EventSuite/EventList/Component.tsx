import React from 'react'

import { EventListClient } from '@/blocks/EventSuite/EventList/Component.client'
import { getUpcomingEventListPage } from '@/blocks/EventSuite/EventList/queries'
import { unstable_cache } from 'next/cache'

type Props = React.ComponentProps<typeof EventListClient> & {
  maxEvents?: null | number
}

const getUpcomingEvents = unstable_cache(
  async (maxEvents: number) => getUpcomingEventListPage({ maxEvents, page: 1 }),
  ['event-list-upcoming'],
  {
    revalidate: 300,
    tags: ['events'],
  },
)

export const EventListBlock = async ({ maxEvents = 30, ...props }: Props) => {
  const limit = Math.min(Math.max(maxEvents || 30, 5), 100)
  const initialPage = await getUpcomingEvents(limit)

  return (
    <EventListClient
      {...props}
      events={initialPage.events}
      initialHasNextPage={initialPage.hasNextPage}
      initialNextPage={initialPage.nextPage}
      maxEvents={limit}
    />
  )
}
