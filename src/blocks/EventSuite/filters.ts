import { getZonedDateStart } from './eventDates'

export type EventFilterParams = {
  activityId?: 'all' | number | string | null
  date?: string | null
  dateTo?: string | null
  query?: string | null
  venue?: string | null
}

export const getActivityGalleryHref = (activityID: unknown) =>
  typeof activityID === 'number' && Number.isFinite(activityID)
    ? `/galleria?activityId=${encodeURIComponent(String(activityID))}`
    : null

export const normalizeEventFilterParams = (
  filters: EventFilterParams | null | undefined,
): EventFilterParams => {
  const activityId =
    filters?.activityId === 'all' ||
    filters?.activityId === undefined ||
    filters?.activityId === null
      ? 'all'
      : Number(filters.activityId)

  let date = filters?.date?.trim() || ''
  let dateTo = filters?.dateTo?.trim() || ''
  if (!getDateRangeFromFilterValue(date)) date = ''
  if (!getDateRangeFromFilterValue(dateTo)) dateTo = ''
  if (!date && dateTo) date = dateTo
  if (date && dateTo && date > dateTo) [date, dateTo] = [dateTo, date]

  return {
    activityId: Number.isFinite(activityId) ? activityId : 'all',
    date,
    dateTo,
    query: filters?.query?.trim() || '',
    venue: filters?.venue?.trim() || '',
  }
}

export const getEventFilterParamsFromSearchParams = (searchParams: URLSearchParams) =>
  normalizeEventFilterParams({
    activityId: searchParams.get('activityId') || 'all',
    date: searchParams.get('date') || '',
    dateTo: searchParams.get('dateTo') || '',
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
  if (normalizedFilters.dateTo) {
    searchParams.set('dateTo', normalizedFilters.dateTo)
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
  const calendarDate = new Date(Date.UTC(year, month - 1, day))
  if (
    calendarDate.getUTCFullYear() !== year ||
    calendarDate.getUTCMonth() !== month - 1 ||
    calendarDate.getUTCDate() !== day
  )
    return null
  const start = getZonedDateStart(year, month - 1, day)
  const end = getZonedDateStart(year, month - 1, day + 1)

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null

  return { end, start }
}
