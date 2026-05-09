import React from 'react'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import {
  eventSuiteSelect,
  formatEventDateParts,
  getEventDisplayImage,
  getEventTypeLabel,
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
  backgroundImage?: EventSuiteMedia | number | null
  descStyle?: EventSuiteTextStyle | null
  dtStyle?: EventSuiteTextStyle | null
  eventSource?: 'automatic' | 'manual' | null
  heading?: null | string
  headingBackgroundImage?: EventSuiteMedia | number | null
  hdgStyle?: EventSuiteTextStyle | null
  linkBackgroundImage?: EventSuiteMedia | number | null
  linkFallbackLabel?: null | string
  lnkStyle?: EventSuiteTextStyle | null
  manualEvent?: EventSuiteItem | number | null
  specialBorder?: boolean | null
  ttlStyle?: EventSuiteTextStyle | null
  typStyle?: EventSuiteTextStyle | null
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
  backgroundImage,
  descStyle,
  dtStyle,
  eventSource = 'automatic',
  heading,
  headingBackgroundImage,
  hdgStyle,
  linkBackgroundImage,
  linkFallbackLabel = 'Scopri di piu',
  lnkStyle,
  manualEvent,
  specialBorder,
  ttlStyle,
  typStyle,
}: Props) => {
  const event =
    eventSource === 'manual'
      ? await getManualFeaturedEvent(manualEvent)
      : await getNextFeaturedEvent()

  if (!event) return null

  const dateParts = formatEventDateParts(event.startsAt)
  const displayImage = backgroundImage || getEventDisplayImage(event)
  const eventTypeLabel = getEventTypeLabel(event.activity)

  return (
    <aside
      className={cn(
        'relative isolate min-h-[28.5rem] w-full min-w-0 overflow-visible min-[680px]:min-h-[25rem] xl:min-h-[38rem]',
        specialBorder && 'scribble-border featured-event-card-border',
      )}
    >
      <div className="absolute inset-[var(--event-suite-panel-inset,12px)] z-0 overflow-hidden">
        {displayImage && typeof displayImage === 'object' ? (
          <Media
            fill
            imgClassName="object-cover object-center"
            pictureClassName="absolute inset-0"
            resource={displayImage}
            size="(max-width: 1279px) 100vw, 38rem"
          />
        ) : null}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-black/10" />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-black/45 via-transparent to-black/15" />
      </div>

      <div className="relative z-10 flex min-h-[inherit] flex-col justify-between p-4">
        <div
          className="inline-flex min-h-10 w-fit min-w-44 items-center justify-center bg-center bg-no-repeat px-7 py-3 md:min-h-11 md:px-8"
          style={{
            backgroundImage: resolveMediaBackground(headingBackgroundImage),
            backgroundSize: headingBackgroundImage ? '100% 100%' : undefined,
          }}
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

        <div className="grid min-w-0 max-w-[19rem] gap-2 ml-3 mr-3 mb-4 md:ml-6 md:mr-6 md:mb-8">
          <h3
            className={cn(getEventSuiteTextClassName(ttlStyle, 'black'), 'block break-words')}
            style={getEventSuiteTextStyle(ttlStyle, {
              fontFamily: 'cinzel',
              fontSizeDesktop: 28,
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
          {eventTypeLabel ? (
            <div
              className={cn(getEventSuiteTextClassName(typStyle, 'black'), 'block')}
              style={getEventSuiteTextStyle(typStyle, {
                fontFamily: 'cinzel',
                fontSizeDesktop: 9,
                fontSizeMobile: 9,
                fontWeight: 'black',
                lineHeight: 1,
              })}
            >
              {eventTypeLabel}
            </div>
          ) : null}
          {event.description ? (
            <p
              className={cn(getEventSuiteTextClassName(descStyle, 'regular'), 'line-clamp-3 block')}
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
              'mt-1 inline-flex min-h-9 w-fit min-w-36 items-center justify-center bg-center bg-no-repeat px-7 py-2.5',
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
              backgroundSize: linkBackgroundImage ? '100% 100%' : undefined,
            }}
          />
        </div>
      </div>
    </aside>
  )
}
