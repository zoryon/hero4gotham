'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react'
import {
  formatEventDateParts,
  getEventDisplayImage,
  getEventPrimaryLink,
  getEventTypeLabel,
  getEventSuiteTextClassName,
  getEventSuiteTextStyle,
  resolveMediaBackground,
  type EventSuiteItem,
  type EventSuiteMedia,
  type EventSuiteTextStyle,
} from '@/blocks/EventSuite/shared'
import {
  appendEventFilterSearchParams,
  normalizeEventFilterParams,
  type EventFilterParams,
} from '@/blocks/EventSuite/filters'
import { useEventFilters } from '@/providers/EventFilters'
import { useDebounce } from '@/utilities/useDebounce'
import { cn } from '@/utilities/ui'

type Props = {
  ddyStyle?: EventSuiteTextStyle | null
  descStyle?: EventSuiteTextStyle | null
  dividerColor?: null | string
  emptyStateLabel?: null | string
  emptyStateTypography?:
    | {
        style?: EventSuiteTextStyle | null
      }[]
    | null
  eventLinkFallbackLabel?: null | string
  events: EventSuiteItem[]
  heading?: null | string
  headingBackgroundImage?: EventSuiteMedia | number | null
  hdgStyle?: EventSuiteTextStyle | null
  initialHasNextPage?: boolean
  initialNextPage?: null | number
  initialTotalPages?: number
  lnkStyle?: EventSuiteTextStyle | null
  monthStyle?: EventSuiteTextStyle | null
  pageSize?: number
  paginationMode?: boolean
  rowHeight?: null | number
  timeStyle?: EventSuiteTextStyle | null
  ttlStyle?: EventSuiteTextStyle | null
  typStyle?: EventSuiteTextStyle | null
  weekdayStyle?: EventSuiteTextStyle | null
  yearTypography?:
    | {
        style?: EventSuiteTextStyle | null
      }[]
    | null
}

type EventListPageResponse = {
  events?: EventSuiteItem[]
  hasNextPage?: boolean
  nextPage?: null | number
  totalPages?: number
}

const batchSize = 4
const visibleRows = 3
const borderBleed = 11
const eventDescriptionMaxCharacters = 75

const truncateEventDescription = (description: string) => {
  const characters = Array.from(description)

  if (characters.length <= eventDescriptionMaxCharacters) return description

  return `${characters.slice(0, eventDescriptionMaxCharacters).join('').trimEnd()}...`
}

export const EventListClient: React.FC<Props> = ({
  ddyStyle,
  descStyle,
  dividerColor,
  emptyStateLabel = 'Non sono presenti eventi',
  emptyStateTypography,
  eventLinkFallbackLabel = 'Scopri di piu',
  events,
  heading,
  headingBackgroundImage,
  hdgStyle,
  initialHasNextPage = false,
  initialNextPage = null,
  initialTotalPages = 1,
  lnkStyle,
  monthStyle,
  pageSize = batchSize,
  paginationMode = false,
  rowHeight = 112,
  timeStyle,
  ttlStyle,
  typStyle,
  weekdayStyle,
  yearTypography,
}) => {
  const [eventItems, setEventItems] = useState(events)
  const [hasNextPage, setHasNextPage] = useState(initialHasNextPage)
  const [isLoading, setIsLoading] = useState(false)
  const [nextPage, setNextPage] = useState(initialNextPage)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(initialTotalPages)
  const [hasScrolled, setHasScrolled] = useState(false)
  const [paginationFrameHeight, setPaginationFrameHeight] = useState<null | number>(null)
  const { activityId, date, query, venue } = useEventFilters()
  const debouncedQuery = useDebounce(query, 250)
  const loadingPageRef = useRef(false)
  const hasMountedRef = useRef(false)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const penultimateEventRef = useRef<HTMLElement | null>(null)
  const safeRowHeight = Math.max(rowHeight || 112, 1)
  const emptyStateStyle = emptyStateTypography?.[0]?.style
  const yearStyle = yearTypography?.[0]?.style
  const shouldScroll = !paginationMode && (eventItems.length >= pageSize || hasNextPage)
  const penultimateEventIndex = eventItems.length > 1 ? eventItems.length - 2 : -1
  const activeFilters = React.useMemo<EventFilterParams>(
    () =>
      normalizeEventFilterParams({
        activityId,
        date,
        query: debouncedQuery,
        venue,
      }),
    [activityId, date, debouncedQuery, venue],
  )

  useEffect(() => {
    setEventItems(events)
    setHasNextPage(initialHasNextPage)
    setNextPage(initialNextPage)
    setCurrentPage(1)
    setTotalPages(initialTotalPages)
    setHasScrolled(false)
    loadingPageRef.current = false
  }, [events, initialHasNextPage, initialNextPage, initialTotalPages])

  const loadNextPage = useCallback(async () => {
    if (!hasNextPage || isLoading || loadingPageRef.current || !nextPage) return

    loadingPageRef.current = true
    setIsLoading(true)

    try {
      const params = new URLSearchParams({
        page: String(nextPage),
        pageSize: String(pageSize),
      })
      appendEventFilterSearchParams(params, activeFilters)
      const response = await fetch(`/api/event-list?${params.toString()}`, {
        headers: {
          Accept: 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Unable to load event page ${nextPage}`)
      }

      const data = (await response.json()) as EventListPageResponse

      setEventItems((currentEvents) => {
        const knownEventIds = new Set(currentEvents.map((event) => String(event.id)))
        const nextEvents = (data.events || []).filter(
          (event) => !knownEventIds.has(String(event.id)),
        )

        return [...currentEvents, ...nextEvents]
      })
      setHasNextPage(Boolean(data.hasNextPage))
      setNextPage(data.nextPage || null)
      setTotalPages(data.totalPages || 1)
    } catch {
      setHasNextPage(false)
      setNextPage(null)
    } finally {
      loadingPageRef.current = false
      setIsLoading(false)
    }
  }, [activeFilters, hasNextPage, isLoading, nextPage, pageSize])

  const loadPage = useCallback(
    async (page: number) => {
      if (isLoading || loadingPageRef.current || page < 1 || page > totalPages) return

      loadingPageRef.current = true
      setIsLoading(true)

      try {
        const params = new URLSearchParams({
          page: String(page),
          pageSize: String(pageSize),
        })
        appendEventFilterSearchParams(params, activeFilters)
        const response = await fetch(`/api/event-list?${params.toString()}`, {
          headers: {
            Accept: 'application/json',
          },
        })

        if (!response.ok) throw new Error(`Unable to load event page ${page}`)

        const data = (await response.json()) as EventListPageResponse

        setEventItems(data.events || [])
        setHasNextPage(Boolean(data.hasNextPage))
        setNextPage(data.nextPage || null)
        setCurrentPage(page)
        setTotalPages(data.totalPages || 1)
        scrollerRef.current?.scrollTo({ top: 0 })
      } finally {
        loadingPageRef.current = false
        setIsLoading(false)
      }
    },
    [activeFilters, isLoading, pageSize, totalPages],
  )

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true
      return
    }

    const controller = new AbortController()
    const params = new URLSearchParams({
      page: '1',
      pageSize: String(pageSize),
    })
    appendEventFilterSearchParams(params, activeFilters)

    loadingPageRef.current = true
    setIsLoading(true)
    setHasScrolled(false)
    scrollerRef.current?.scrollTo({ top: 0 })

    fetch(`/api/event-list?${params.toString()}`, {
      headers: {
        Accept: 'application/json',
      },
      signal: controller.signal,
    })
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((data: EventListPageResponse) => {
        setEventItems(data.events || [])
        setHasNextPage(Boolean(data.hasNextPage))
        setNextPage(data.nextPage || null)
        setCurrentPage(1)
        setTotalPages(data.totalPages || 1)
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setEventItems([])
          setHasNextPage(false)
          setNextPage(null)
          setCurrentPage(1)
          setTotalPages(1)
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          loadingPageRef.current = false
          setIsLoading(false)
        }
      })

    return () => controller.abort()
  }, [activeFilters, pageSize])

  useEffect(() => {
    const root = scrollerRef.current
    const target = penultimateEventRef.current

    if (paginationMode || !root || !target || !hasNextPage || isLoading || !hasScrolled) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          void loadNextPage()
        }
      },
      {
        root,
        threshold: 0.6,
      },
    )

    observer.observe(target)

    return () => observer.disconnect()
  }, [eventItems.length, hasNextPage, hasScrolled, isLoading, loadNextPage, paginationMode])

  useEffect(() => {
    const frame = scrollerRef.current

    if (!paginationMode || !frame || eventItems.length < pageSize) return

    const updatePaginationFrameHeight = () => {
      const nextHeight = Math.ceil(frame.getBoundingClientRect().height)

      setPaginationFrameHeight((currentHeight) =>
        currentHeight === nextHeight ? currentHeight : nextHeight,
      )
    }

    updatePaginationFrameHeight()

    const observer = new ResizeObserver(updatePaginationFrameHeight)
    observer.observe(frame)

    return () => observer.disconnect()
  }, [eventItems.length, pageSize, paginationMode])

  return (
    <section
      className={cn(
        'relative isolate w-full',
        paginationMode && 'event-list-paginated h-full',
      )}
    >
      <div
        className={cn(
          'relative min-w-0 overflow-visible',
          paginationMode && 'event-list-pagination-frame flex h-full flex-col',
        )}
      >
        <div
          className="event-list-heading absolute left-5 top-0 z-30 inline-flex min-h-10 w-fit min-w-44 -translate-y-[82%] items-center justify-center bg-center bg-no-repeat px-7 py-3 md:min-h-11 md:px-8"
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

        <div className={cn('relative min-w-0', paginationMode && 'flex flex-1 flex-col')}>
          <div
            ref={scrollerRef}
            className={cn(
              'event-list-scroll min-w-0',
              shouldScroll ? 'overflow-x-hidden overflow-y-auto' : 'overflow-visible',
            )}
            onScroll={() => {
              if (!hasScrolled) setHasScrolled(true)
            }}
            style={
              shouldScroll
                ? {
                    margin: -borderBleed,
                    maxHeight: safeRowHeight * visibleRows + borderBleed * 2,
                    padding: borderBleed,
                  }
                : paginationMode && eventItems.length > 0 && eventItems.length < pageSize
                  ? { minHeight: paginationFrameHeight || safeRowHeight * visibleRows }
                  : undefined
            }
          >
            {eventItems.map((event, index) => {
              const dateParts = formatEventDateParts(event.startsAt)
              const displayTime = event.timeLabel || dateParts.time
              const displayImage = getEventDisplayImage(event)
              const eventPrimaryLink = getEventPrimaryLink(event)
              const eventTypeLabel = getEventTypeLabel(event.activity)
              const hasPassed = new Date(event.startsAt).getTime() < Date.now()
              const passedContentClassName = hasPassed ? 'opacity-70' : undefined

                return (
                  <article
                    className="relative grid min-w-0 grid-cols-[6rem_minmax(0,1fr)] gap-0 py-0"
                    key={event.id}
                    ref={
                      !paginationMode && index === penultimateEventIndex
                        ? penultimateEventRef
                        : undefined
                    }
                  style={{
                    borderBottom: dividerColor ? `1px solid ${dividerColor}` : undefined,
                    minHeight: safeRowHeight,
                  }}
                >
                  {hasPassed ? (
                    <span
                      className={cn(
                        getEventSuiteTextClassName(typStyle, 'black'),
                        'pointer-events-none absolute right-4 top-3 z-30 inline-flex w-fit items-center justify-center bg-black/70 px-2 py-1 text-[0.58rem] uppercase text-[#ff2d2d] shadow-[0_2px_0_rgb(0_0_0_/_0.25)]',
                      )}
                      style={{
                        ...getEventSuiteTextStyle(typStyle, {
                          fontFamily: 'cinzel',
                          fontSizeDesktop: 9,
                          fontSizeMobile: 8,
                          fontWeight: 'black',
                          lineHeight: 1,
                        }),
                        color: '#ff2d2d',
                      }}
                    >
                      PASSATO
                    </span>
                  ) : null}
                  <div
                    className={cn(
                      'event-list-cell-border vintage-surface grid content-center justify-items-center px-2 py-3 text-center',
                      'scribble-border',
                    )}
                  >
                    <div
                      className={cn(
                        getEventSuiteTextClassName(ddyStyle, 'black'),
                        passedContentClassName,
                      )}
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
                    <div className={cn('grid justify-items-center leading-none', passedContentClassName)}>
                      <span
                        className={getEventSuiteTextClassName(monthStyle, 'black')}
                        style={getEventSuiteTextStyle(monthStyle, {
                          fontFamily: 'cinzel',
                          fontSizeDesktop: 13,
                          fontSizeMobile: 10,
                          fontWeight: 'black',
                          lineHeight: 1.05,
                        })}
                      >
                        {dateParts.month}
                      </span>
                      <span
                        className={cn(getEventSuiteTextClassName(yearStyle, 'black'), 'mt-1')}
                        style={getEventSuiteTextStyle(yearStyle, {
                          fontFamily: 'cinzel',
                          fontSizeDesktop: 11,
                          fontSizeMobile: 9,
                          fontWeight: 'black',
                          lineHeight: 1.05,
                        })}
                      >
                        {dateParts.year}
                      </span>
                      <span
                        className={cn(getEventSuiteTextClassName(weekdayStyle, 'black'), 'mt-3')}
                        style={getEventSuiteTextStyle(weekdayStyle, {
                          fontFamily: 'cinzel',
                          fontSizeDesktop: 13,
                          fontSizeMobile: 10,
                          fontWeight: 'black',
                          lineHeight: 1.05,
                        })}
                      >
                        {dateParts.weekday}
                      </span>
                      <span
                        className={cn(getEventSuiteTextClassName(timeStyle, 'black'), 'mt-2')}
                        style={getEventSuiteTextStyle(timeStyle, {
                          fontFamily: 'cinzel',
                          fontSizeDesktop: 15,
                          fontSizeMobile: 13,
                          fontWeight: 'black',
                          lineHeight: 1.05,
                        })}
                      >
                        {displayTime}
                      </span>
                    </div>
                  </div>

                  <div
                    className={cn(
                      'event-list-cell-border vintage-surface event-list-info-surface relative grid min-w-0 grid-cols-1 gap-0 overflow-visible p-0 md:grid-cols-[minmax(15rem,1fr)_minmax(12rem,0.82fr)]',
                      'scribble-border',
                    )}
                  >
                    <div className={cn('grid min-w-0 content-center px-4 py-3', passedContentClassName)}>
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
                            'mt-6 line-clamp-2 block max-w-[28rem]',
                          )}
                          style={getEventSuiteTextStyle(descStyle, {
                            fontFamily: 'geistSans',
                            fontSizeDesktop: 12,
                            fontSizeMobile: 10,
                            fontWeight: 'regular',
                            lineHeight: 1.3,
                          })}
                        >
                          {truncateEventDescription(event.description)}
                        </p>
                      ) : null}
                      <div className="mt-4 flex min-w-0 flex-wrap items-center gap-x-10 gap-y-2">
                        {event.venue ? (
                          <div className="hidden min-w-0 flex-nowrap items-center gap-2 whitespace-nowrap md:inline-flex">
                            <MapPin
                              aria-hidden
                              className="h-4 w-4 shrink-0 text-[var(--theme-text-green)]"
                              strokeWidth={2.5}
                            />
                            <span
                              className={cn(
                                getEventSuiteTextClassName(descStyle, 'bold'),
                                'min-w-0 truncate',
                              )}
                              style={getEventSuiteTextStyle(descStyle, {
                                fontFamily: 'geistSans',
                                fontSizeDesktop: 11,
                                fontSizeMobile: 10,
                                fontWeight: 'bold',
                                lineHeight: 1,
                              })}
                            >
                              {event.venue}
                            </span>
                          </div>
                        ) : null}
                        <CMSLink
                          {...eventPrimaryLink}
                          className={cn(
                            getEventSuiteTextClassName(lnkStyle, 'black'),
                            'event-list-link-mobile scribble-border event-list-link-border event-list-link-surface relative w-fit items-center justify-center px-4 py-2.5',
                            passedContentClassName,
                          )}
                          label="Scopri di più"
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

                    <div className="event-list-image-surface-fade relative hidden overflow-hidden md:block">
                      {displayImage && typeof displayImage === 'object' ? (
                        <Media
                          fill
                          imgClassName={cn('object-cover object-center', passedContentClassName)}
                          pictureClassName="absolute inset-0"
                          resource={displayImage}
                          size="(max-width: 1279px) 32vw, 24vw"
                        />
                      ) : null}
                      <CMSLink
                        {...eventPrimaryLink}
                        className={cn(
                          getEventSuiteTextClassName(lnkStyle, 'black'),
                          'event-list-link-image scribble-border event-list-link-border event-list-link-surface absolute bottom-5 right-5 z-10 w-fit items-center justify-center px-5 py-3',
                          passedContentClassName,
                        )}
                        label="Scopri di più"
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
          {!eventItems.length ? (
            <div
              className={cn(
                'grid min-h-32 flex-1 place-items-center px-6 py-10 text-center',
                'scribble-border',
              )}
              style={paginationMode ? { minHeight: safeRowHeight * visibleRows } : undefined}
            >
              <span
                className={getEventSuiteTextClassName(emptyStateStyle, 'black')}
                style={getEventSuiteTextStyle(emptyStateStyle, {
                  fontFamily: 'cinzel',
                  fontSizeDesktop: 16,
                  fontSizeMobile: 14,
                  fontWeight: 'black',
                  lineHeight: 1.15,
                })}
              >
                {emptyStateLabel || 'Non sono presenti eventi'}
              </span>
            </div>
          ) : null}
        </div>
        {paginationMode ? (
          <nav
            aria-label="Paginazione eventi"
            className="event-list-cell-border event-list-pagination scribble-border vintage-surface"
          >
            <button
              aria-label="Pagina precedente"
              className="event-list-pagination-button"
              disabled={currentPage <= 1 || isLoading}
              onClick={() => void loadPage(currentPage - 1)}
              type="button"
            >
              <ChevronLeft aria-hidden className="size-4" />
              Precedente
            </button>
            <span aria-live="polite" className="event-list-pagination-status">
              Pagina {currentPage} di {totalPages}
            </span>
            <button
              aria-label="Pagina successiva"
              className="event-list-pagination-button"
              disabled={currentPage >= totalPages || isLoading}
              onClick={() => void loadPage(currentPage + 1)}
              type="button"
            >
              Successiva
              <ChevronRight aria-hidden className="size-4" />
            </button>
          </nav>
        ) : null}
      </div>
    </section>
  )
}
