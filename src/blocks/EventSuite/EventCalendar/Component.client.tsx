'use client'

import React from 'react'

import {
  getEventSuiteTextClassName,
  getEventSuiteTextStyle,
  resolveMediaBackground,
  type EventSuiteMedia,
  type EventSuiteTextStyle,
} from '@/blocks/EventSuite/shared'
import type {
  EventCalendarActivityMarker,
  EventCalendarDayMarker,
} from '@/blocks/EventSuite/EventCalendar/queries'
import { cn } from '@/utilities/ui'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'

type Props = {
  dayStyle?: EventSuiteTextStyle | null
  heading?: null | string
  headingBackgroundImage?: EventSuiteMedia | number | null
  hdgStyle?: EventSuiteTextStyle | null
  initialEventMarkers: EventCalendarDayMarker[]
  initialLegendItems: EventCalendarActivityMarker[]
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

type EventCalendarResponse = {
  eventDays?: number[]
  eventMarkers?: EventCalendarDayMarker[]
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

const getLegacyEventMarkers = (eventDays: number[] | undefined): EventCalendarDayMarker[] =>
  (eventDays || []).map((day) => ({
    activities: [
      {
        color: null,
        id: 'events',
        label: 'Eventi',
      },
    ],
    day,
  }))

export const EventCalendarClient: React.FC<Props> = ({
  dayStyle,
  heading,
  headingBackgroundImage,
  hdgStyle,
  initialEventMarkers,
  initialLegendItems,
  initialMonth,
  initialYear,
  markerColor,
  monStyle,
  specialBorder,
}) => {
  const [monthDate, setMonthDate] = React.useState(() => new Date(initialYear, initialMonth, 1))
  const [eventMarkers, setEventMarkers] = React.useState(initialEventMarkers)
  const eventMarkersCache = React.useRef(
    new Map([[getMonthKey(initialYear, initialMonth), initialEventMarkers]]),
  )

  const year = monthDate.getFullYear()
  const monthIndex = monthDate.getMonth()
  const monthKey = getMonthKey(year, monthIndex)
  const monthLabel = monthDisplayFormatter.format(monthDate)
  const cells = React.useMemo(() => getCalendarCells(year, monthIndex), [monthIndex, year])
  const dayTextClassName = getEventSuiteTextClassName(dayStyle, 'regular')
  const dayTextStyle = getCellTextStyle(dayStyle)
  const legendTextStyle = {
    ...dayTextStyle,
    justifyContent: 'flex-start',
    lineHeight: 1.12,
    transformOrigin: 'left center',
  } as React.CSSProperties
  const today = React.useMemo(() => new Date(), [])
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === monthIndex
  const resolveMarkerColor = React.useCallback(
    (color: null | string | undefined) => color || markerColor || 'var(--theme-text-green)',
    [markerColor],
  )
  const eventMarkersByDay = React.useMemo(
    () => new Map(eventMarkers.map((marker) => [marker.day, marker.activities])),
    [eventMarkers],
  )
  const legendItems = React.useMemo(() => {
    return initialLegendItems
      .map((item) => ({
        ...item,
        color: resolveMarkerColor(item.color),
        label: item.label || 'Evento',
      }))
      .sort((a, b) => a.label.localeCompare(b.label, 'it-IT'))
  }, [initialLegendItems, resolveMarkerColor])

  React.useEffect(() => {
    const cachedEventMarkers = eventMarkersCache.current.get(monthKey)

    if (cachedEventMarkers) {
      setEventMarkers(cachedEventMarkers)
      return
    }

    setEventMarkers([])

    const controller = new AbortController()

    fetch(`/api/event-calendar?year=${year}&month=${monthIndex + 1}`, {
      headers: {
        Accept: 'application/json',
      },
      signal: controller.signal,
    })
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((data: EventCalendarResponse) => {
        const nextEventMarkers = data.eventMarkers || getLegacyEventMarkers(data.eventDays)

        eventMarkersCache.current.set(monthKey, nextEventMarkers)
        setEventMarkers(nextEventMarkers)
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          eventMarkersCache.current.set(monthKey, [])
          setEventMarkers([])
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
        'event-calendar-card vintage-surface relative mx-auto w-full min-w-0 max-w-[min(92vw,23rem)] overflow-visible sm:max-w-[min(82vw,26rem)] min-[680px]:max-xl:h-full min-[680px]:max-xl:max-w-[min(100%,28rem)] min-[680px]:max-xl:mx-auto',
        specialBorder && 'scribble-border event-calendar-card-border',
      )}
    >
      <div className="relative z-10 grid min-w-0 gap-2 p-2 sm:gap-3 sm:p-3 min-[680px]:max-xl:h-full min-[680px]:max-xl:content-center">
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

        <div className="event-calendar-layout grid min-w-0 gap-2 sm:gap-3">
          <div className="grid min-w-0 grid-cols-7 gap-0.5 sm:gap-1">
            {weekdays.map((weekday, index) => (
              <div
                className="relative grid aspect-[1.18/1] min-w-0 place-items-center text-center sm:aspect-square"
                key={`${weekday}-${index}`}
              >
                <span className={dayTextClassName} style={dayTextStyle}>
                  {weekday}
                </span>
              </div>
            ))}
            {cells.map((cell) => {
              const markerActivities = cell.day ? eventMarkersByDay.get(cell.day) || [] : []

              return (
                <div
                  aria-hidden={!cell.day}
                  className="relative grid aspect-[1.18/1] min-w-0 place-items-center text-center sm:aspect-square"
                  key={cell.key}
                >
                  {cell.day ? (
                    <span
                      className={cn(dayTextClassName, 'relative z-10')}
                      style={{
                        ...dayTextStyle,
                        color:
                          isCurrentMonth && cell.day === today.getDate()
                            ? 'var(--theme-text-green)'
                            : dayTextStyle.color,
                      }}
                    >
                      {cell.day}
                    </span>
                  ) : null}
                  {markerActivities.slice(0, 4).map((activity, index) => (
                    <span
                      aria-hidden
                      className="pointer-events-none absolute z-0 rounded-full"
                      key={`${activity.id}-${index}`}
                      style={{
                        border: `1px solid ${resolveMarkerColor(activity.color)}`,
                        inset: 2 + index * 3,
                      }}
                    />
                  ))}
                </div>
              )
            })}
          </div>

          <div className="event-calendar-legend min-w-0">
            <div
              className={cn(
                getEventSuiteTextClassName(monStyle, 'black'),
                'event-calendar-legend-title min-w-0',
              )}
              style={{
                ...getEventSuiteTextStyle(monStyle, {
                  fontFamily: 'cinzel',
                  fontSizeDesktop: 10,
                  fontSizeMobile: 10,
                  fontWeight: 'black',
                  lineHeight: 1,
                }),
                transformOrigin: 'left center',
              }}
            >
              Legenda
            </div>
            {legendItems.length ? (
              <ul className="mt-2 grid min-w-0 gap-1.5">
                {legendItems.map((item) => (
                  <li
                    className="grid min-w-0 grid-cols-[0.75rem_minmax(0,1fr)] items-center gap-2"
                    key={item.id}
                  >
                    <span
                      aria-hidden
                      className="h-2.5 w-2.5 rounded-full"
                      style={{
                        backgroundColor: item.color,
                        boxShadow: `0 0 0 1px ${item.color}`,
                      }}
                    />
                    <span
                      className={cn(dayTextClassName, 'min-w-0 truncate')}
                      style={legendTextStyle}
                    >
                      {item.label}
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </div>
    </aside>
  )
}
