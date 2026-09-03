import {
  getDateRangeFromFilterValue,
  normalizeEventFilterParams,
} from '@/blocks/EventSuite/filters'
import type { EventFilterParams } from '@/blocks/EventSuite/filters'
import type { Where } from 'payload'
import { getEventDayStart } from './eventDates'

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
    const today = getEventDayStart(options.now || new Date()).toISOString()
    clauses.push({
      or: [
        { endsAt: { greater_than_equal: today } },
        {
          and: [
            { endsAt: { exists: false } },
            { startsAt: { greater_than_equal: today } },
          ],
        },
      ],
    })
  }

  if (selectedDateRange) {
    clauses.push({
      and: [
        { startsAt: { less_than: selectedDateRange.end.toISOString() } },
        {
          or: [
            { endsAt: { greater_than_equal: selectedDateRange.start.toISOString() } },
            {
              and: [
                { endsAt: { exists: false } },
                { startsAt: { greater_than_equal: selectedDateRange.start.toISOString() } },
              ],
            },
          ],
        },
      ],
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
