export const EVENT_CALENDAR_TIME_ZONE = 'Europe/Rome'

const calendarDateFormatter = new Intl.DateTimeFormat('en-CA', {
  day: 'numeric',
  month: 'numeric',
  timeZone: EVENT_CALENDAR_TIME_ZONE,
  year: 'numeric',
})

export type EventCalendarDateParts = {
  day: number
  month: number
  year: number
}

export const getEventCalendarDateParts = (value: string | Date): EventCalendarDateParts => {
  const parts = calendarDateFormatter.formatToParts(
    typeof value === 'string' ? new Date(value) : value,
  )
  const getPart = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value)

  return {
    day: getPart('day'),
    month: getPart('month'),
    year: getPart('year'),
  }
}
