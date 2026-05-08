import { eventSuiteSelect, type EventSuiteItem } from '@/blocks/EventSuite/shared'
import { buildEventWhere } from '@/blocks/EventSuite/eventWhere'
import type { EventFilterParams } from '@/blocks/EventSuite/filters'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export const eventListPageSize = 6

export type EventListPage = {
  events: EventSuiteItem[]
  hasNextPage: boolean
  nextPage: number | null
}

export const getUpcomingEventListPage = async ({
  filters,
  maxEvents,
  page,
}: {
  filters?: EventFilterParams
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

  const result = await payload.find({
    collection: 'events',
    depth: 1,
    limit: safeMaxEvents < eventListPageSize ? safeMaxEvents : eventListPageSize,
    page: safePage,
    select: eventSuiteSelect,
    sort: 'startsAt',
    where: buildEventWhere(filters),
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
