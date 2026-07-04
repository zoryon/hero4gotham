import {
  getDateRangeFromFilterValue,
  normalizeEventFilterParams,
} from '@/blocks/EventSuite/filters'
import type { EventFilterParams } from '@/blocks/EventSuite/filters'
import type { Where } from 'payload'

type BuildEventWhereOptions = {
  futureOnlyWhenUnfiltered?: boolean
  now?: Date
}

const hasActiveFilters = (filters: EventFilterParams) =>
  Boolean(
    filters.date ||
      filters.query ||
      filters.venue ||
      (filters.activityId && filters.activityId !== 'all'),
  )

export const buildEventWhere = (
  filters?: EventFilterParams,
  options: BuildEventWhereOptions = {},
): Where => {
  const normalizedFilters = normalizeEventFilterParams(filters)
  const clauses: Where[] = []
  const selectedDateRange = getDateRangeFromFilterValue(normalizedFilters.date)

  if (options.futureOnlyWhenUnfiltered && !hasActiveFilters(normalizedFilters)) {
    clauses.push({
      startsAt: {
        greater_than_equal: (options.now || new Date()).toISOString(),
      },
    })
  }

  if (selectedDateRange) {
    clauses.push({
      startsAt: {
        greater_than_equal: selectedDateRange.start.toISOString(),
        less_than: selectedDateRange.end.toISOString(),
      },
    })
  }

  if (normalizedFilters.activityId && normalizedFilters.activityId !== 'all') {
    clauses.push({
      activity: {
        equals: normalizedFilters.activityId,
      },
    })
  }

  if (normalizedFilters.venue) {
    clauses.push({
      venue: {
        equals: normalizedFilters.venue,
      },
    })
  }

  if (normalizedFilters.query) {
    clauses.push({
      or: [
        {
          title: {
            contains: normalizedFilters.query,
          },
        },
        {
          description: {
            contains: normalizedFilters.query,
          },
        },
        {
          longDescription: {
            contains: normalizedFilters.query,
          },
        },
        {
          venue: {
            contains: normalizedFilters.query,
          },
        },
      ],
    })
  }

  if (!clauses.length) return {}

  return clauses.length === 1
    ? clauses[0]
    : {
        and: clauses,
      }
}
