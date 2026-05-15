import {
  getDateRangeFromFilterValue,
  normalizeEventFilterParams,
} from '@/blocks/EventSuite/filters'
import type { EventFilterParams } from '@/blocks/EventSuite/filters'
import type { Where } from 'payload'

export const buildEventWhere = (filters?: EventFilterParams): Where => {
  const normalizedFilters = normalizeEventFilterParams(filters)
  const clauses: Where[] = []
  const selectedDateRange = getDateRangeFromFilterValue(normalizedFilters.date)

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
