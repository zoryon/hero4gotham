import React from 'react'

import { type EventSuiteMedia, type EventSuiteTextStyle } from '@/blocks/EventSuite/shared'
import { EventCalendarClient } from '@/blocks/EventSuite/EventCalendar/Component.client'
import { getEventCalendarDays } from '@/blocks/EventSuite/EventCalendar/queries'

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
  const safeMonthOffset =
    typeof monthOffset === 'number' && Number.isFinite(monthOffset) ? monthOffset : 0
  const offset = Math.min(Math.max(safeMonthOffset, 0), 12)
  const now = new Date()
  const monthDate = new Date(now.getFullYear(), now.getMonth() + offset, 1)
  const initialYear = monthDate.getFullYear()
  const initialMonth = monthDate.getMonth()
  const initialEventDays = await getEventCalendarDays(initialYear, initialMonth)

  return (
    <EventCalendarClient
      dayStyle={dayStyle}
      heading={heading}
      headingBackgroundImage={headingBackgroundImage}
      hdgStyle={hdgStyle}
      initialEventDays={initialEventDays}
      initialMonth={initialMonth}
      initialYear={initialYear}
      markerColor={markerColor}
      monStyle={monStyle}
      specialBorder={specialBorder}
    />
  )
}
