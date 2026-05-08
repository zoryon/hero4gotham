import { eventSuiteSelect, type EventSuiteItem } from '@/blocks/EventSuite/shared'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export const eventListPageSize = 6

export type EventListPage = {
  events: EventSuiteItem[]
  hasNextPage: boolean
  nextPage: number | null
}

export const getUpcomingEventListPage = async ({
  maxEvents,
  page,
}: {
  maxEvents: number
  page: number
}): Promise<EventListPage> => {
  const safeMaxEvents = Math.max(Math.min(maxEvents || eventListPageSize, 100), 1)
  const safePage = Math.max(page || 1, 1)
  const alreadyRequested = (safePage - 1) * eventListPageSize

  if (alreadyRequested >= safeMaxEvents) {
    return {
      events: [],
      hasNextPage: false,
      nextPage: null,
    }
  }

  const payload = await getPayload({ config: configPromise })
  const now = new Date()
  now.setHours(0, 0, 0, 0)

  const result = await payload.find({
    collection: 'events',
    depth: 1,
    limit: safeMaxEvents < eventListPageSize ? safeMaxEvents : eventListPageSize,
    page: safePage,
    select: eventSuiteSelect,
    sort: 'startsAt',
    where: {
      startsAt: {
        greater_than_equal: now.toISOString(),
      },
    },
  })
  const remainingEvents = safeMaxEvents - alreadyRequested
  const events = (result.docs as EventSuiteItem[]).slice(0, remainingEvents)
  const canRequestMore = safePage * eventListPageSize < safeMaxEvents

  return {
    events,
    hasNextPage: Boolean(result.hasNextPage && canRequestMore),
    nextPage: result.hasNextPage && canRequestMore ? result.nextPage || safePage + 1 : null,
  }
}
