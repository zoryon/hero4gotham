import React from 'react'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import {
  eventSuiteSelect,
  formatEventDateParts,
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
  descStyle?: EventSuiteTextStyle | null
  dtStyle?: EventSuiteTextStyle | null
  eventSource?: 'automatic' | 'manual' | null
  fallbackImage?: EventSuiteMedia | number | null
  heading?: null | string
  headingBackgroundImage?: EventSuiteMedia | number | null
  hdgStyle?: EventSuiteTextStyle | null
  linkBackgroundImage?: EventSuiteMedia | number | null
  linkFallbackLabel?: null | string
  lnkStyle?: EventSuiteTextStyle | null
  manualEvent?: EventSuiteItem | number | null
  specialBorder?: boolean | null
  ttlStyle?: EventSuiteTextStyle | null
}

const getNextFeaturedEvent = unstable_cache(
  async (): Promise<EventSuiteItem | null> => {
    const payload = await getPayload({ config: configPromise })
    const now = new Date()
    now.setHours(0, 0, 0, 0)

    const result = await payload.find({
      collection: 'events',
      depth: 1,
      limit: 1,
      pagination: false,
      select: eventSuiteSelect,
      sort: 'startsAt',
      where: {
        startsAt: {
          greater_than_equal: now.toISOString(),
        },
      },
    })

    return (result.docs[0] as EventSuiteItem | undefined) || null
  },
  ['featured-event-next'],
  {
    revalidate: 300,
    tags: ['events'],
  },
)

const getManualFeaturedEvent = async (
  event: EventSuiteItem | number | null | undefined,
): Promise<EventSuiteItem | null> => {
  if (!event) return null
  if (typeof event === 'object') return event

  const payload = await getPayload({ config: configPromise })
  const result = await payload.findByID({
    collection: 'events',
    depth: 1,
    id: event,
    select: eventSuiteSelect,
  })

  return result as EventSuiteItem
}

export const FeaturedEventBlock = async ({
  descStyle,
  dtStyle,
  eventSource = 'automatic',
  fallbackImage,
  heading,
  headingBackgroundImage,
  hdgStyle,
  linkBackgroundImage,
  linkFallbackLabel = 'Scopri di piu',
  lnkStyle,
  manualEvent,
  specialBorder,
  ttlStyle,
}: Props) => {
  const event =
    eventSource === 'manual'
      ? await getManualFeaturedEvent(manualEvent)
      : await getNextFeaturedEvent()

  if (!event) return null

  const dateParts = formatEventDateParts(event.startsAt)
  const displayImage = event.image || fallbackImage

  return (
    <aside
      className={cn('relative isolate grid w-full gap-3 p-2', specialBorder && 'scribble-border')}
    >
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

      <div className="relative min-h-48 overflow-hidden">
        {displayImage && typeof displayImage === 'object' ? (
          <Media
            fill
            imgClassName="object-cover"
            pictureClassName="absolute inset-0"
            resource={displayImage}
          />
        ) : null}
      </div>

      <div className="grid gap-2">
        <h3
          className={cn(getEventSuiteTextClassName(ttlStyle, 'black'), 'block')}
          style={getEventSuiteTextStyle(ttlStyle, {
            fontFamily: 'cinzel',
            fontSizeDesktop: 24,
            fontSizeMobile: 22,
            fontWeight: 'black',
            lineHeight: 0.95,
          })}
        >
          {event.title}
        </h3>
        <div
          className={getEventSuiteTextClassName(dtStyle, 'black')}
          style={getEventSuiteTextStyle(dtStyle, {
            fontFamily: 'cinzel',
            fontSizeDesktop: 12,
            fontSizeMobile: 12,
            fontWeight: 'black',
            lineHeight: 1,
          })}
        >
          {dateParts.day} {dateParts.month} {event.timeLabel || dateParts.time}
        </div>
        {event.description ? (
          <p
            className={cn(getEventSuiteTextClassName(descStyle, 'regular'), 'block')}
            style={getEventSuiteTextStyle(descStyle, {
              fontFamily: 'geistSans',
              fontSizeDesktop: 11,
              fontSizeMobile: 11,
              fontWeight: 'regular',
              lineHeight: 1.35,
            })}
          >
            {event.description}
          </p>
        ) : null}
        <CMSLink
          {...event.link}
          className={cn(
            getEventSuiteTextClassName(lnkStyle, 'black'),
            'mt-1 inline-flex w-fit bg-contain bg-center bg-no-repeat px-5 py-2',
          )}
          label={(event.link?.label as string) || linkFallbackLabel || 'Scopri di piu'}
          style={{
            ...getEventSuiteTextStyle(lnkStyle, {
              fontFamily: 'cinzel',
              fontSizeDesktop: 10,
              fontSizeMobile: 10,
              fontWeight: 'black',
              lineHeight: 1,
            }),
            backgroundImage: resolveMediaBackground(linkBackgroundImage),
          }}
        />
      </div>
    </aside>
  )
}
