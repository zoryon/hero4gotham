import React from 'react'

import type {
  Event as EventDocument,
  Media as MediaDocument,
  UpcomingEventsBlock as UpcomingEventsBlockProps,
} from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

const eventDateFormatter = new Intl.DateTimeFormat('it-IT', {
  day: '2-digit',
  month: 'short',
})

const resolveBackgroundImage = (image: MediaDocument | number | null | undefined) => {
  if (!image || typeof image !== 'object') return undefined

  const url = getMediaUrl(image.url, image.updatedAt)
  return url ? `url("${url.replace(/"/g, '\\"')}")` : undefined
}

const formatEventDate = (value: string) => {
  const parts = eventDateFormatter.formatToParts(new Date(value))
  const day = parts.find((part) => part.type === 'day')?.value || ''
  const month = parts.find((part) => part.type === 'month')?.value || ''

  return {
    day,
    month: month.replace('.', '').toUpperCase(),
  }
}

const isEventDocument = (event: EventDocument | number | null | undefined): event is EventDocument =>
  Boolean(event && typeof event === 'object')

const getManualEvents = async (
  manualEvents: UpcomingEventsBlockProps['manualEvents'],
): Promise<EventDocument[]> => {
  const selected = (manualEvents || []).filter(Boolean)
  const populated = selected.filter(isEventDocument)

  if (populated.length === selected.length) return populated.slice(0, 2)

  const ids = selected
    .map((event) => (typeof event === 'object' ? event.id : event))
    .filter((id): id is number => typeof id === 'number')

  if (!ids.length) return populated.slice(0, 2)

  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'events',
    limit: 2,
    pagination: false,
    sort: 'startsAt',
    where: {
      id: {
        in: ids,
      },
    },
  })

  return result.docs
}

const getAutomaticEvents = async (): Promise<EventDocument[]> => {
  const payload = await getPayload({ config: configPromise })
  const now = new Date()
  now.setHours(0, 0, 0, 0)

  const upcoming = await payload.find({
    collection: 'events',
    limit: 2,
    pagination: false,
    sort: 'startsAt',
    where: {
      startsAt: {
        greater_than_equal: now.toISOString(),
      },
    },
  })

  if (upcoming.docs.length) return upcoming.docs

  const latest = await payload.find({
    collection: 'events',
    limit: 2,
    pagination: false,
    sort: '-startsAt',
  })

  return latest.docs
}

export const UpcomingEventsBlock = async ({
  ctaButtonBackgroundColor = '#84cc16',
  ctaButtonTextColor = '#251414',
  ctaGlyph,
  ctaLink,
  ctaLinkFallbackLabel = 'Unisciti a noi',
  ctaText,
  ctaTextColor = '#ffffff',
  ctaTitle,
  dateColor = '#e879f9',
  emptyEventsText,
  emptyEventsTitle,
  eventLinkColor = '#a3e635',
  eventLinkLabel = 'Scopri di piu',
  eventSource = 'automatic',
  eventTextColor = '#f4f4f5',
  eventTitleColor = '#fef3c7',
  featureImage,
  heading,
  headingColor = '#211713',
  leftBackground,
  manualEvents,
  rightBackground,
}: UpcomingEventsBlockProps) => {
  const eventItems =
    eventSource === 'manual' ? await getManualEvents(manualEvents) : await getAutomaticEvents()

  return (
    <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,32%)] lg:items-stretch">
      <div
        className="relative isolate overflow-hidden"
        style={{
          backgroundImage: resolveBackgroundImage(leftBackground),
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '100% 100%',
        }}
      >
        <div className="-ml-4 mt-4 inline-block -rotate-3 px-8 py-2">
          <h2
            className="font-[family-name:'Cinzel','Times_New_Roman',serif] text-sm font-black uppercase tracking-[0.08em] md:text-base"
            style={{ color: headingColor || '#211713' }}
          >
            {heading}
          </h2>
        </div>

        <div className="grid gap-0 px-5 pb-5 pt-3 lg:grid-cols-[minmax(0,1fr)_40%] lg:gap-6 lg:px-8 lg:pb-8">
          <div className="divide-y divide-[#5f4b2d]/70">
            {eventItems.length ? (
              eventItems.map((event) => {
                const formattedDate = formatEventDate(event.startsAt)
                const day = event.dateDayLabel || formattedDate.day
                const month = event.dateMonthLabel || formattedDate.month

                return (
                  <article
                    className="grid grid-cols-[4.25rem_minmax(0,1fr)] gap-4 py-4"
                    key={event.id}
                  >
                    <div className="text-center font-[family-name:'Cinzel','Times_New_Roman',serif] uppercase leading-none">
                      <div
                        className="text-4xl font-black"
                        style={{ color: dateColor || '#e879f9' }}
                      >
                        {day}
                      </div>
                      <div
                        className="mt-1 text-sm font-black tracking-[0.1em]"
                        style={{ color: eventTextColor || '#f4f4f5' }}
                      >
                        {month}
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                      <div>
                        <h3
                          className="font-[family-name:'Cinzel','Times_New_Roman',serif] text-sm font-black uppercase tracking-[0.06em]"
                          style={{ color: eventTitleColor || '#fef3c7' }}
                        >
                          {event.title}
                        </h3>
                        <p
                          className="mt-1 max-w-md text-xs leading-relaxed"
                          style={{ color: eventTextColor || '#f4f4f5' }}
                        >
                          {event.description}
                        </p>
                      </div>

                      <CMSLink
                        {...event.link}
                        className="justify-self-start text-[10px] font-black uppercase tracking-[0.08em] sm:justify-self-end"
                        label={event.link?.label || eventLinkLabel || 'Scopri di piu'}
                        style={{ color: eventLinkColor || '#a3e635' }}
                      />
                    </div>
                  </article>
                )
              })
            ) : (
              <div className="py-8">
                <h3
                  className="font-[family-name:'Cinzel','Times_New_Roman',serif] text-sm font-black uppercase tracking-[0.06em]"
                  style={{ color: eventTitleColor || '#fef3c7' }}
                >
                  {emptyEventsTitle}
                </h3>
                {emptyEventsText ? (
                  <p
                    className="mt-2 max-w-md text-xs leading-relaxed"
                    style={{ color: eventTextColor || '#f4f4f5' }}
                  >
                    {emptyEventsText}
                  </p>
                ) : null}
              </div>
            )}
          </div>

          <div className="relative mt-4 min-h-56 overflow-hidden lg:mt-0">
            {featureImage && typeof featureImage === 'object' ? (
              <Media
                fill
                imgClassName="object-cover"
                pictureClassName="absolute inset-0"
                resource={featureImage}
              />
            ) : null}
          </div>
        </div>
      </div>

      <aside
        className="relative isolate flex min-h-72 overflow-hidden px-8 py-8 lg:min-h-full"
        style={{
          backgroundImage: resolveBackgroundImage(rightBackground),
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '100% 100%',
        }}
      >
        <div className="relative z-10 flex max-w-sm flex-col justify-center">
          <h2
            className="font-[family-name:'Cinzel','Times_New_Roman',serif] text-2xl font-black uppercase tracking-[0.06em]"
            style={{ color: ctaTextColor || '#ffffff' }}
          >
            {ctaTitle}
          </h2>
          {ctaText ? (
            <p
              className="mt-5 text-sm leading-relaxed"
              style={{ color: ctaTextColor || '#ffffff' }}
            >
              {ctaText}
            </p>
          ) : null}
          <CMSLink
            {...ctaLink}
            className="mt-8 inline-flex w-fit px-9 py-3 font-[family-name:'Cinzel','Times_New_Roman',serif] text-xs font-black uppercase tracking-[0.08em]"
            label={ctaLink?.label || ctaLinkFallbackLabel || 'Unisciti a noi'}
            style={{
              backgroundColor: ctaButtonBackgroundColor || '#84cc16',
              color: ctaButtonTextColor || '#251414',
            }}
          />
        </div>

        {ctaGlyph && typeof ctaGlyph === 'object' ? (
          <div className="pointer-events-none absolute bottom-4 right-4 h-36 w-36 opacity-90 md:h-44 md:w-44">
            <Media
              fill
              imgClassName="object-contain"
              pictureClassName="absolute inset-0"
              resource={ctaGlyph}
            />
          </div>
        ) : null}
      </aside>
    </section>
  )
}
