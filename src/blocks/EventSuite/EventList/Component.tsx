import React from 'react'

import { EventListClient } from '@/blocks/EventSuite/EventList/Component.client'
import { getEventListPage } from '@/blocks/EventSuite/EventList/queries'
import { unstable_cache } from 'next/cache'

type Props = React.ComponentProps<typeof EventListClient> & {
  maxEvents?: null | number
}

const getEvents = unstable_cache(
  async (maxEvents: number) => getEventListPage({ maxEvents, page: 1 }),
  ['event-list-all-desc'],
  {
    revalidate: 300,
    tags: ['events'],
  },
)

export const EventListBlock = async ({ maxEvents = 30, ...props }: Props) => {
  const limit = Math.min(Math.max(maxEvents || 30, 5), 100)
  const initialPage = await getEvents(limit)

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
