import { EVENT_CALENDAR_TIME_ZONE, getEventCalendarDateParts } from './EventCalendar/date'

const datePartsFormatter = new Intl.DateTimeFormat('it-IT', {
  day: 'numeric',
  month: 'short',
  timeZone: EVENT_CALENDAR_TIME_ZONE,
  weekday: 'long',
  year: 'numeric',
})

const longDatePartsFormatter = new Intl.DateTimeFormat('it-IT', {
  day: 'numeric',
  month: 'long',
  timeZone: EVENT_CALENDAR_TIME_ZONE,
  year: 'numeric',
})

const zonedDateTimeFormatter = new Intl.DateTimeFormat('en-CA', {
  day: 'numeric',
  hour: 'numeric',
  hourCycle: 'h23',
  minute: 'numeric',
  month: 'numeric',
  second: 'numeric',
  timeZone: EVENT_CALENDAR_TIME_ZONE,
  year: 'numeric',
})

type DateInput = Date | string

type EventDateParts = {
  day: string
  month: string
  monthLong: string
  weekday: string
  year: string
}

const normalizeDate = (value: DateInput) => (value instanceof Date ? value : new Date(value))

const getPart = (parts: Intl.DateTimeFormatPart[], type: Intl.DateTimeFormatPartTypes) =>
  parts.find((part) => part.type === type)?.value || ''

const getDisplayParts = (value: DateInput): EventDateParts => {
  const date = normalizeDate(value)
  const shortParts = datePartsFormatter.formatToParts(date)
  const longParts = longDatePartsFormatter.formatToParts(date)

  return {
    day: getPart(shortParts, 'day'),
    month: getPart(shortParts, 'month').replace('.', '').toUpperCase(),
    monthLong: getPart(longParts, 'month').toLocaleLowerCase('it-IT'),
    weekday: getPart(shortParts, 'weekday').toLocaleUpperCase('it-IT'),
    year: getPart(shortParts, 'year'),
  }
}

const sameCalendarDay = (left: EventDateParts, right: EventDateParts) =>
  left.day === right.day && left.month === right.month && left.year === right.year

const getWeekdayRange = (start: EventDateParts, end: EventDateParts) =>
  `${start.weekday.slice(0, 3)}–${end.weekday.slice(0, 3)}`

export const getZonedDateStart = (year: number, monthIndex: number, day: number) => {
  const target = Date.UTC(year, monthIndex, day)
  let timestamp = target

  // Iterating accounts for the Europe/Rome offset and for DST transition days.
  for (let iteration = 0; iteration < 3; iteration += 1) {
    const parts = zonedDateTimeFormatter.formatToParts(new Date(timestamp))
    const representedAsUTC = Date.UTC(
      Number(getPart(parts, 'year')),
      Number(getPart(parts, 'month')) - 1,
      Number(getPart(parts, 'day')),
      Number(getPart(parts, 'hour')),
      Number(getPart(parts, 'minute')),
      Number(getPart(parts, 'second')),
    )

    timestamp -= representedAsUTC - target
  }

  return new Date(timestamp)
}

export const getEventDayStart = (value: DateInput) => {
  const { day, month, year } = getEventCalendarDateParts(value)
  return getZonedDateStart(year, month - 1, day)
}

export const formatEventDateRange = (startsAt: string, endsAt?: null | string) => {
  const start = getDisplayParts(startsAt)
  const end = endsAt ? getDisplayParts(endsAt) : start
  const isSingleDay = sameCalendarDay(start, end)
  const sameMonth = start.month === end.month && start.year === end.year
  const sameYear = start.year === end.year

  if (isSingleDay) {
    return {
      day: start.day,
      long: `${start.day} ${start.monthLong} ${start.year}`,
      month: start.month,
      short: `${start.day} ${start.month} ${start.year}`,
      weekday: start.weekday,
      year: start.year,
    }
  }

  if (sameMonth) {
    return {
      day: `${start.day}–${end.day}`,
      long: `${start.day}–${end.day} ${start.monthLong} ${start.year}`,
      month: start.month,
      short: `${start.day}–${end.day} ${start.month} ${start.year}`,
      weekday: getWeekdayRange(start, end),
      year: start.year,
    }
  }

  const year = sameYear ? start.year : `${start.year}–${end.year.slice(-2)}`

  return {
    day: `${start.day}–${end.day}`,
    long: sameYear
      ? `${start.day} ${start.monthLong}–${end.day} ${end.monthLong} ${start.year}`
      : `${start.day} ${start.monthLong} ${start.year}–${end.day} ${end.monthLong} ${end.year}`,
    month: `${start.month}–${end.month}`,
    short: sameYear
      ? `${start.day} ${start.month}–${end.day} ${end.month} ${start.year}`
      : `${start.day} ${start.month} ${start.year}–${end.day} ${end.month} ${end.year}`,
    weekday: getWeekdayRange(start, end),
    year,
  }
}

export const isEventPast = (
  startsAt: string,
  endsAt?: null | string,
  now: Date = new Date(),
) => getEventDayStart(endsAt || startsAt).getTime() < getEventDayStart(now).getTime()

export const getEventDaysInMonth = (
  startsAt: string,
  endsAt: null | string | undefined,
  year: number,
  monthIndex: number,
) => {
  const startParts = getEventCalendarDateParts(startsAt)
  const endParts = getEventCalendarDateParts(endsAt || startsAt)
  const eventStart = Date.UTC(startParts.year, startParts.month - 1, startParts.day)
  const eventEnd = Date.UTC(endParts.year, endParts.month - 1, endParts.day)
  const monthStart = Date.UTC(year, monthIndex, 1)
  const monthEnd = Date.UTC(year, monthIndex + 1, 0)
  const firstDay = Math.max(eventStart, monthStart)
  const lastDay = Math.min(eventEnd, monthEnd)

  if (firstDay > lastDay) return []

  const days: number[] = []
  for (let timestamp = firstDay; timestamp <= lastDay; timestamp += 86_400_000) {
    days.push(new Date(timestamp).getUTCDate())
  }

  return days
}

export const validateEventEndDate = (
  value: Date | null | string | undefined,
  { siblingData }: { siblingData?: Record<string, unknown> },
) => {
  if (!value) return true

  const startsAt = siblingData?.startsAt
  if (!(typeof startsAt === 'string' || startsAt instanceof Date)) return true

  return getEventDayStart(value).getTime() >= getEventDayStart(startsAt).getTime()
    ? true
    : 'La data di fine non può precedere la data di inizio.'
}
