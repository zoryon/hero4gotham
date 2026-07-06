import { eventSuiteSelect, type EventSuiteItem } from '@/blocks/EventSuite/shared'
import { buildEventWhere } from '@/blocks/EventSuite/eventWhere'
import type { EventFilterParams } from '@/blocks/EventSuite/filters'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export const eventListPageSize = 4

export type EventListPage = {
  events: EventSuiteItem[]
  hasNextPage: boolean
  nextPage: number | null
  totalPages: number
}

export const getEventListPage = async ({
  filters,
  page,
  pageSize = eventListPageSize,
}: {
  filters?: EventFilterParams
  page: number
  pageSize?: number
}): Promise<EventListPage> => {
  const safePage = Math.max(page || 1, 1)
  const safePageSize = Math.max(Math.min(pageSize || eventListPageSize, 12), 1)

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'events',
    depth: 1,
    limit: safePageSize,
    page: safePage,
    select: eventSuiteSelect,
    sort: '-startsAt',
    where: buildEventWhere(filters, { futureOnlyWhenUnfiltered: true }),
  })
  const events = result.docs as EventSuiteItem[]
  const totalPages = Math.max(Math.ceil(result.totalDocs / safePageSize), 1)
  const hasNextPage = safePage < totalPages

  return {
    events,
    hasNextPage,
    nextPage: hasNextPage ? safePage + 1 : null,
    totalPages,
  }
}
