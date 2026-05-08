export type EventFilterParams = {
  activityId?: 'all' | number | string | null
  date?: string | null
  query?: string | null
  venue?: string | null
}

export const normalizeEventFilterParams = (
  filters: EventFilterParams | null | undefined,
): EventFilterParams => {
  const activityId =
    filters?.activityId === 'all' ||
    filters?.activityId === undefined ||
    filters?.activityId === null
      ? 'all'
      : Number(filters.activityId)

  return {
    activityId: Number.isFinite(activityId) ? activityId : 'all',
    date: filters?.date?.trim() || '',
    query: filters?.query?.trim() || '',
    venue: filters?.venue?.trim() || '',
  }
}

export const getEventFilterParamsFromSearchParams = (searchParams: URLSearchParams) =>
  normalizeEventFilterParams({
    activityId: searchParams.get('activityId') || 'all',
    date: searchParams.get('date') || '',
    query: searchParams.get('query') || '',
    venue: searchParams.get('venue') || '',
  })

export const appendEventFilterSearchParams = (
  searchParams: URLSearchParams,
  filters: EventFilterParams,
) => {
  const normalizedFilters = normalizeEventFilterParams(filters)

  if (normalizedFilters.activityId && normalizedFilters.activityId !== 'all') {
    searchParams.set('activityId', String(normalizedFilters.activityId))
  }

  if (normalizedFilters.date) {
    searchParams.set('date', normalizedFilters.date)
  }

  if (normalizedFilters.query) {
    searchParams.set('query', normalizedFilters.query)
  }

  if (normalizedFilters.venue) {
    searchParams.set('venue', normalizedFilters.venue)
  }
}

export const getDateRangeFromFilterValue = (value: string | null | undefined) => {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null

  const [year, month, day] = value.split('-').map(Number)
  const start = new Date(year, month - 1, day)
  const end = new Date(year, month - 1, day + 1)

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null

  return { end, start }
}
