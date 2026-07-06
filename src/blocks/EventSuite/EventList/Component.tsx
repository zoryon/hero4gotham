import React from 'react'

import { EventListClient } from '@/blocks/EventSuite/EventList/Component.client'
import { getEventListPage } from '@/blocks/EventSuite/EventList/queries'
import { unstable_cache } from 'next/cache'

type Props = React.ComponentProps<typeof EventListClient>

const getEvents = unstable_cache(
  async (pageSize: number) => getEventListPage({ page: 1, pageSize }),
  ['event-list-upcoming-page-v3'],
  {
    revalidate: 300,
    tags: ['events'],
  },
)

export const EventListBlock = async ({ pageSize = 4, ...props }: Props) => {
  const safePageSize = Math.max(Math.min(pageSize, 12), 1)
  const initialPage = await getEvents(safePageSize)

  return (
    <EventListClient
      {...props}
      events={initialPage.events}
      initialHasNextPage={initialPage.hasNextPage}
      initialNextPage={initialPage.nextPage}
      initialTotalPages={initialPage.totalPages}
      pageSize={safePageSize}
    />
  )
}
