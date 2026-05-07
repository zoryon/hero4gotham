import React from 'react'

import {
  eventSuiteSelect,
  getEventSuiteTextClassName,
  getEventSuiteTextStyle,
  resolveMediaBackground,
  type EventSuiteItem,
  type EventSuiteMedia,
  type EventSuiteTextStyle,
} from '@/blocks/EventSuite/shared'
import { cn } from '@/utilities/ui'
import configPromise from '@payload-config'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'

type Props = {
  dayStyle?: EventSuiteTextStyle | null
  heading?: null | string
  headingBackgroundImage?: EventSuiteMedia | number | null
  hdgStyle?: EventSuiteTextStyle | null
  markerColor?: null | string
  monthOffset?: null | number
  monStyle?: EventSuiteTextStyle | null
  specialBorder?: boolean | null
}

const getMonthEvents = unstable_cache(
  async (monthOffset: number): Promise<EventSuiteItem[]> => {
    const now = new Date()
    const start = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1)
    const end = new Date(now.getFullYear(), now.getMonth() + monthOffset + 1, 1)
    const payload = await getPayload({ config: configPromise })

    const result = await payload.find({
      collection: 'events',
      depth: 0,
      limit: 100,
      pagination: false,
      select: eventSuiteSelect,
      sort: 'startsAt',
      where: {
        startsAt: {
          greater_than_equal: start.toISOString(),
          less_than: end.toISOString(),
        },
      },
    })

    return result.docs as EventSuiteItem[]
  },
  ['event-calendar-month'],
  {
    revalidate: 300,
    tags: ['events'],
  },
)

const getCalendarDays = (monthOffset: number) => {
  const now = new Date()
  const firstDay = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1)
  const lastDay = new Date(now.getFullYear(), now.getMonth() + monthOffset + 1, 0)
  const mondayFirstOffset = (firstDay.getDay() + 6) % 7
  const totalCells = Math.ceil((mondayFirstOffset + lastDay.getDate()) / 7) * 7

  return Array.from({ length: totalCells }, (_, index) => {
    const dayNumber = index - mondayFirstOffset + 1

    return dayNumber > 0 && dayNumber <= lastDay.getDate() ? dayNumber : null
  })
}

export const EventCalendarBlock = async ({
  dayStyle,
  heading,
  headingBackgroundImage,
  hdgStyle,
  markerColor,
  monthOffset = 0,
  monStyle,
  specialBorder,
}: Props) => {
  const offset = Math.min(Math.max(monthOffset || 0, 0), 12)
  const now = new Date()
  const monthDate = new Date(now.getFullYear(), now.getMonth() + offset, 1)
  const events = await getMonthEvents(offset)
  const eventDays = new Set(events.map((event) => new Date(event.startsAt).getDate()))
  const days = getCalendarDays(offset)
  const weekdays = ['L', 'M', 'M', 'G', 'V', 'S', 'D']
  const monthLabel = new Intl.DateTimeFormat('it-IT', {
    month: 'long',
    year: 'numeric',
  }).format(monthDate)

  return (
    <aside
      className={cn(
        'relative w-full min-w-0 overflow-visible',
        specialBorder && 'scribble-border event-calendar-card-border',
      )}
    >
      <div className="relative z-10 grid min-w-0 gap-3 p-3">
        <div
          className={cn(
            'inline-flex w-fit items-center justify-center bg-contain bg-center bg-no-repeat px-5 py-2',
            headingBackgroundImage && 'min-w-36',
          )}
          style={{ backgroundImage: resolveMediaBackground(headingBackgroundImage) }}
        >
          <h2
            className={getEventSuiteTextClassName(hdgStyle, 'black')}
            style={getEventSuiteTextStyle(hdgStyle, {
              fontFamily: 'cinzel',
              fontSizeDesktop: 13,
              fontSizeMobile: 12,
              fontWeight: 'black',
              lineHeight: 1,
            })}
          >
            {heading}
          </h2>
        </div>

        <div
          className={getEventSuiteTextClassName(monStyle, 'black')}
          style={getEventSuiteTextStyle(monStyle, {
            fontFamily: 'cinzel',
            fontSizeDesktop: 12,
            fontSizeMobile: 12,
            fontWeight: 'black',
            lineHeight: 1,
          })}
        >
          {monthLabel}
        </div>

        <div className="grid min-w-0 grid-cols-7 gap-1">
          {weekdays.map((weekday, index) => (
            <div
              className={cn(
                getEventSuiteTextClassName(dayStyle, 'regular'),
                'grid aspect-square place-items-center',
              )}
              key={`${weekday}-${index}`}
              style={getEventSuiteTextStyle(dayStyle, {
                fontFamily: 'geistMono',
                fontSizeDesktop: 10,
                fontSizeMobile: 10,
                fontWeight: 'regular',
                lineHeight: 1,
              })}
            >
              {weekday}
            </div>
          ))}
          {days.map((day, index) => {
            const hasEvent = Boolean(day && eventDays.has(day))

            return (
              <div
                className={cn(
                  getEventSuiteTextClassName(dayStyle, 'regular'),
                  'relative grid aspect-square place-items-center',
                )}
                key={`${day || 'blank'}-${index}`}
                style={getEventSuiteTextStyle(dayStyle, {
                  fontFamily: 'geistMono',
                  fontSizeDesktop: 10,
                  fontSizeMobile: 10,
                  fontWeight: 'regular',
                  lineHeight: 1,
                })}
              >
                {day}
                {hasEvent && markerColor ? (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-1"
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
