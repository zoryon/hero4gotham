'use client'

import React from 'react'

import {
  getEventSuiteTextClassName,
  getEventSuiteTextStyle,
  resolveMediaBackground,
  type EventSuiteMedia,
  type EventSuiteTextStyle,
} from '@/blocks/EventSuite/shared'
import { cn } from '@/utilities/ui'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'

type Props = {
  dayStyle?: EventSuiteTextStyle | null
  heading?: null | string
  headingBackgroundImage?: EventSuiteMedia | number | null
  hdgStyle?: EventSuiteTextStyle | null
  initialEventDays: number[]
  initialMonth: number
  initialYear: number
  markerColor?: null | string
  monStyle?: EventSuiteTextStyle | null
  specialBorder?: boolean | null
}

type CalendarCell = {
  day: null | number
  key: string
}

const weekdays = ['L', 'M', 'M', 'G', 'V', 'S', 'D']
const monthDisplayFormatter = new Intl.DateTimeFormat('it-IT', {
  month: 'long',
  year: 'numeric',
})

const getMonthKey = (year: number, monthIndex: number) => `${year}-${monthIndex + 1}`

const getCalendarCells = (year: number, monthIndex: number): CalendarCell[] => {
  const firstDay = new Date(year, monthIndex, 1)
  const lastDay = new Date(year, monthIndex + 1, 0)
  const mondayFirstOffset = (firstDay.getDay() + 6) % 7
  const totalCells = Math.ceil((mondayFirstOffset + lastDay.getDate()) / 7) * 7

  return Array.from({ length: totalCells }, (_, index) => {
    const day = index - mondayFirstOffset + 1

    return {
      day: day > 0 && day <= lastDay.getDate() ? day : null,
      key: `${year}-${monthIndex}-${index}`,
    }
  })
}

const getCellTextStyle = (style: EventSuiteTextStyle | null | undefined): React.CSSProperties => ({
  ...getEventSuiteTextStyle(style, {
    fontFamily: 'geistMono',
    fontSizeDesktop: 10,
    fontSizeMobile: 10,
    fontWeight: 'regular',
    lineHeight: 1,
  }),
  alignItems: 'center',
  display: 'inline-flex',
  justifyContent: 'center',
  transformOrigin: 'center',
})

export const EventCalendarClient: React.FC<Props> = ({
  dayStyle,
  heading,
  headingBackgroundImage,
  hdgStyle,
  initialEventDays,
  initialMonth,
  initialYear,
  markerColor,
  monStyle,
  specialBorder,
}) => {
  const [monthDate, setMonthDate] = React.useState(() => new Date(initialYear, initialMonth, 1))
  const [eventDays, setEventDays] = React.useState(initialEventDays)
  const eventDaysCache = React.useRef(
    new Map([[getMonthKey(initialYear, initialMonth), initialEventDays]]),
  )

  const year = monthDate.getFullYear()
  const monthIndex = monthDate.getMonth()
  const monthKey = getMonthKey(year, monthIndex)
  const monthLabel = monthDisplayFormatter.format(monthDate)
  const eventDaySet = React.useMemo(() => new Set(eventDays), [eventDays])
  const cells = React.useMemo(() => getCalendarCells(year, monthIndex), [monthIndex, year])
  const dayTextClassName = getEventSuiteTextClassName(dayStyle, 'regular')
  const dayTextStyle = getCellTextStyle(dayStyle)

  React.useEffect(() => {
    const cachedEventDays = eventDaysCache.current.get(monthKey)

    if (cachedEventDays) {
      setEventDays(cachedEventDays)
      return
    }

    const controller = new AbortController()

    fetch(`/api/event-calendar?year=${year}&month=${monthIndex + 1}`, {
      headers: {
        Accept: 'application/json',
      },
      signal: controller.signal,
    })
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((data: { eventDays?: number[] }) => {
        const nextEventDays = data.eventDays || []

        eventDaysCache.current.set(monthKey, nextEventDays)
        setEventDays(nextEventDays)
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          eventDaysCache.current.set(monthKey, [])
          setEventDays([])
        }
      })

    return () => controller.abort()
  }, [monthIndex, monthKey, year])

  const moveCalendar = (months: number) => {
    setMonthDate((current) => new Date(current.getFullYear(), current.getMonth() + months, 1))
  }

  return (
    <aside
      className={cn(
        'relative mx-auto w-full min-w-0 max-w-[clamp(16rem,72vw,20rem)] overflow-visible',
        specialBorder && 'scribble-border event-calendar-card-border',
      )}
    >
      <div className="relative z-10 grid min-w-0 gap-2.5 p-2.5 sm:gap-3 sm:p-3">
        <div
          className={cn(
            'inline-flex max-w-full items-center justify-center bg-contain bg-center bg-no-repeat px-4 py-2 text-center sm:w-fit sm:px-5',
            headingBackgroundImage && 'min-w-36',
          )}
          style={{ backgroundImage: resolveMediaBackground(headingBackgroundImage) }}
        >
          <h2
            className={cn(getEventSuiteTextClassName(hdgStyle, 'black'), 'text-center')}
            style={{
              ...getEventSuiteTextStyle(hdgStyle, {
                fontFamily: 'cinzel',
                fontSizeDesktop: 13,
                fontSizeMobile: 12,
                fontWeight: 'black',
                lineHeight: 1,
              }),
              transformOrigin: 'center',
            }}
          >
            {heading}
          </h2>
        </div>

        <div className="grid min-w-0 grid-cols-[1.75rem_1.75rem_minmax(0,1fr)_1.75rem_1.75rem] items-center gap-1">
          <button
            aria-label="Anno precedente"
            className="grid aspect-square cursor-pointer place-items-center text-[var(--theme-text-secondary)] transition hover:text-[var(--theme-text-accent)] focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--theme-text-accent)]"
            onClick={() => moveCalendar(-12)}
            type="button"
          >
            <ChevronsLeft aria-hidden className="h-4 w-4" strokeWidth={2.3} />
          </button>
          <button
            aria-label="Mese precedente"
            className="grid aspect-square cursor-pointer place-items-center text-[var(--theme-text-secondary)] transition hover:text-[var(--theme-text-accent)] focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--theme-text-accent)]"
            onClick={() => moveCalendar(-1)}
            type="button"
          >
            <ChevronLeft aria-hidden className="h-4 w-4" strokeWidth={2.3} />
          </button>
          <div
            aria-live="polite"
            className={cn(getEventSuiteTextClassName(monStyle, 'black'), 'min-w-0 text-center')}
            style={{
              ...getEventSuiteTextStyle(monStyle, {
                fontFamily: 'cinzel',
                fontSizeDesktop: 12,
                fontSizeMobile: 12,
                fontWeight: 'black',
                lineHeight: 1,
              }),
              transformOrigin: 'center',
              width: '100%',
            }}
          >
            {monthLabel}
          </div>
          <button
            aria-label="Mese successivo"
            className="grid aspect-square cursor-pointer place-items-center text-[var(--theme-text-secondary)] transition hover:text-[var(--theme-text-accent)] focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--theme-text-accent)]"
            onClick={() => moveCalendar(1)}
            type="button"
          >
            <ChevronRight aria-hidden className="h-4 w-4" strokeWidth={2.3} />
          </button>
          <button
            aria-label="Anno successivo"
            className="grid aspect-square cursor-pointer place-items-center text-[var(--theme-text-secondary)] transition hover:text-[var(--theme-text-accent)] focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--theme-text-accent)]"
            onClick={() => moveCalendar(12)}
            type="button"
          >
            <ChevronsRight aria-hidden className="h-4 w-4" strokeWidth={2.3} />
          </button>
        </div>

        <div className="grid min-w-0 grid-cols-7 gap-0.5 sm:gap-1">
          {weekdays.map((weekday, index) => (
            <div
              className="grid aspect-square min-w-0 place-items-center text-center"
              key={`${weekday}-${index}`}
            >
              <span className={dayTextClassName} style={dayTextStyle}>
                {weekday}
              </span>
            </div>
          ))}
          {cells.map((cell) => {
            const hasEvent = Boolean(cell.day && eventDaySet.has(cell.day))

            return (
              <div
                aria-hidden={!cell.day}
                className="relative grid aspect-square min-w-0 place-items-center text-center"
                key={cell.key}
              >
                {cell.day ? (
                  <span className={dayTextClassName} style={dayTextStyle}>
                    {cell.day}
                  </span>
                ) : null}
                {hasEvent && markerColor ? (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0.5 rounded-full sm:inset-1"
                    style={{
                      border: `1px solid ${markerColor}`,
                    }}
                  />
                ) : null}
              </div>
            )
          })}
        </div>
      </div>
    </aside>
  )
}
