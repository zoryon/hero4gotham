'use client'

import React, { useMemo, useState } from 'react'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { MapPin } from 'lucide-react'
import {
  formatEventDateParts,
  getEventTypeLabel,
  getEventSuiteTextClassName,
  getEventSuiteTextStyle,
  resolveMediaBackground,
  type EventSuiteItem,
  type EventSuiteMedia,
  type EventSuiteTextStyle,
} from '@/blocks/EventSuite/shared'
import { cn } from '@/utilities/ui'

type Props = {
  btnStyle?: EventSuiteTextStyle | null
  ddyStyle?: EventSuiteTextStyle | null
  descStyle?: EventSuiteTextStyle | null
  dividerColor?: null | string
  dmtStyle?: EventSuiteTextStyle | null
  eventLinkFallbackLabel?: null | string
  events: EventSuiteItem[]
  featuredBadgeLabel?: null | string
  heading?: null | string
  headingBackgroundImage?: EventSuiteMedia | number | null
  hdgStyle?: EventSuiteTextStyle | null
  lnkStyle?: EventSuiteTextStyle | null
  loadMoreBackgroundImage?: EventSuiteMedia | number | null
  loadMoreLabel?: null | string
  rowHeight?: null | number
  ttlStyle?: EventSuiteTextStyle | null
  typStyle?: EventSuiteTextStyle | null
}

const visibleStep = 5

export const EventListClient: React.FC<Props> = ({
  btnStyle,
  ddyStyle,
  descStyle,
  dividerColor,
  dmtStyle,
  eventLinkFallbackLabel = 'Scopri di piu',
  events,
  featuredBadgeLabel = 'In evidenza',
  heading,
  headingBackgroundImage,
  hdgStyle,
  lnkStyle,
  loadMoreBackgroundImage,
  loadMoreLabel = 'Carica altri eventi',
  rowHeight = 112,
  ttlStyle,
  typStyle,
}) => {
  const [visibleCount, setVisibleCount] = useState(visibleStep)
  const visibleEvents = useMemo(() => events.slice(0, visibleCount), [events, visibleCount])
  const canLoadMore = visibleCount < events.length
  const safeRowHeight = Math.max(rowHeight || 112, 1)

  return (
    <section className="relative isolate w-full">
      <div className="relative min-w-0 overflow-visible p-2">
        <div
          className="absolute left-5 top-2 z-30 inline-flex min-h-10 w-fit min-w-44 -translate-y-1/2 items-center justify-center bg-center bg-no-repeat px-7 py-3 md:min-h-11 md:px-8"
          style={{
            backgroundImage: resolveMediaBackground(headingBackgroundImage),
            backgroundSize: headingBackgroundImage ? '100% 100%' : undefined,
          }}
        >
          <h2
            className={getEventSuiteTextClassName(hdgStyle, 'black')}
            style={getEventSuiteTextStyle(hdgStyle, {
              fontFamily: 'cinzel',
              fontSizeDesktop: 14,
              fontSizeMobile: 13,
              fontWeight: 'black',
              lineHeight: 1,
            })}
          >
            {heading}
          </h2>
        </div>

        <div
          className={cn(
            'min-w-0',
            canLoadMore ? 'overflow-x-hidden overflow-y-auto' : 'overflow-visible',
          )}
          style={canLoadMore ? { maxHeight: safeRowHeight * visibleStep } : undefined}
        >
          {visibleEvents.map((event, index) => {
            const dateParts = formatEventDateParts(event.startsAt)
            const displayTime = event.timeLabel || dateParts.time
            const eventTypeLabel = getEventTypeLabel(event.activity)

            return (
              <article
                className="grid min-w-0 grid-cols-[5.1rem_minmax(0,1fr)] gap-0 py-0"
                key={event.id}
                style={{
                  borderBottom: dividerColor ? `1px solid ${dividerColor}` : undefined,
                  minHeight: safeRowHeight,
                }}
              >
                <div className="scribble-border event-list-cell-border grid content-center justify-items-center px-2 py-3 text-center">
                  <div
                    className={getEventSuiteTextClassName(ddyStyle, 'black')}
                    style={getEventSuiteTextStyle(ddyStyle, {
                      fontFamily: 'cinzel',
                      fontSizeDesktop: 44,
                      fontSizeMobile: 34,
                      fontWeight: 'black',
                      lineHeight: 0.9,
                    })}
                  >
                    {dateParts.day}
                  </div>
                  <div
                    className={getEventSuiteTextClassName(dmtStyle, 'black')}
                    style={getEventSuiteTextStyle(dmtStyle, {
                      fontFamily: 'cinzel',
                      fontSizeDesktop: 10,
                      fontSizeMobile: 10,
                      fontWeight: 'black',
                      lineHeight: 1.05,
                    })}
                  >
                    {dateParts.month}
                    <br />
                    {dateParts.weekday}
                    <br />
                    {displayTime}
                  </div>
                </div>

                <div className="scribble-border event-list-cell-border grid min-w-0 grid-cols-[minmax(15rem,1fr)_minmax(12rem,0.82fr)] gap-0 overflow-visible p-0">
                  <div className="grid min-w-0 content-center px-4 py-3">
                    <h3
                      className={cn(getEventSuiteTextClassName(ttlStyle, 'black'), 'block')}
                      style={getEventSuiteTextStyle(ttlStyle, {
                        fontFamily: 'cinzel',
                        fontSizeDesktop: 19,
                        fontSizeMobile: 16,
                        fontWeight: 'black',
                        lineHeight: 1.1,
                      })}
                    >
                      {event.title}
                    </h3>
                    {eventTypeLabel ? (
                      <div
                        className={cn(
                          getEventSuiteTextClassName(typStyle, 'black'),
                          'mt-4 block w-fit',
                        )}
                        style={getEventSuiteTextStyle(typStyle, {
                          fontFamily: 'cinzel',
                          fontSizeDesktop: 11,
                          fontSizeMobile: 10,
                          fontWeight: 'black',
                          lineHeight: 1,
                        })}
                      >
                        {eventTypeLabel}
                      </div>
                    ) : null}
                    {event.description ? (
                      <p
                        className={cn(
                          getEventSuiteTextClassName(descStyle, 'regular'),
                          'mt-2 line-clamp-2 block max-w-[28rem]',
                        )}
                        style={getEventSuiteTextStyle(descStyle, {
                          fontFamily: 'geistSans',
                          fontSizeDesktop: 12,
                          fontSizeMobile: 10,
                          fontWeight: 'regular',
                          lineHeight: 1.3,
                        })}
                      >
                        {event.description}
                      </p>
                    ) : null}
                    <div className="mt-3 flex min-w-0 flex-wrap items-center gap-x-10 gap-y-2">
                      {event.venue ? (
                        <div
                          className={cn(
                            getEventSuiteTextClassName(descStyle, 'bold'),
                            'flex min-w-0 items-center gap-2',
                          )}
                          style={getEventSuiteTextStyle(descStyle, {
                            fontFamily: 'geistSans',
                            fontSizeDesktop: 11,
                            fontSizeMobile: 10,
                            fontWeight: 'bold',
                            lineHeight: 1,
                          })}
                        >
                          <MapPin aria-hidden className="h-4 w-4 shrink-0" strokeWidth={2.5} />
                          <span className="min-w-0 truncate">{event.venue}</span>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="relative min-h-full overflow-hidden">
                    {event.image && typeof event.image === 'object' ? (
                      <Media
                        fill
                        imgClassName="object-cover object-center"
                        pictureClassName="absolute inset-0"
                        resource={event.image}
                      />
                    ) : null}
                    {index === 0 && featuredBadgeLabel ? (
                      <div
                        className={cn(
                          getEventSuiteTextClassName(dmtStyle, 'black'),
                          'absolute right-4 top-2 z-10',
                        )}
                        style={getEventSuiteTextStyle(dmtStyle, {
                          fontFamily: 'cinzel',
                          fontSizeDesktop: 12,
                          fontSizeMobile: 10,
                          fontWeight: 'black',
                          lineHeight: 1,
                        })}
                      >
                        {featuredBadgeLabel}
                      </div>
                    ) : null}
                    <CMSLink
                      {...event.link}
                      className={cn(
                        getEventSuiteTextClassName(lnkStyle, 'black'),
                        'scribble-border absolute bottom-5 right-5 z-10 inline-flex w-fit items-center justify-center px-5 py-2',
                      )}
                      label={
                        (event.link?.label as string) || eventLinkFallbackLabel || 'Scopri di piu'
                      }
                      style={getEventSuiteTextStyle(lnkStyle, {
                        fontFamily: 'cinzel',
                        fontSizeDesktop: 10,
                        fontSizeMobile: 10,
                        fontWeight: 'black',
                        lineHeight: 1,
                      })}
                    />
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        {canLoadMore ? (
          <button
            className={cn(
              getEventSuiteTextClassName(btnStyle, 'black'),
              'mx-auto inline-flex border-0 bg-transparent bg-contain bg-center bg-no-repeat px-6 py-2',
            )}
            onClick={() => setVisibleCount((count) => Math.min(count + visibleStep, events.length))}
            style={{
              ...getEventSuiteTextStyle(btnStyle, {
                fontFamily: 'cinzel',
                fontSizeDesktop: 10,
                fontSizeMobile: 10,
                fontWeight: 'black',
                lineHeight: 1,
              }),
              backgroundImage: resolveMediaBackground(loadMoreBackgroundImage),
              cursor: 'pointer',
            }}
            type="button"
          >
            {loadMoreLabel}
          </button>
        ) : null}
      </div>
    </section>
  )
}
