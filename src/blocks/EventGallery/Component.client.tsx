'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import type { EventGalleryPage, EventGalleryPhoto } from '@/blocks/EventGallery/queries'
import {
  appendEventFilterSearchParams,
  normalizeEventFilterParams,
  type EventFilterParams,
} from '@/blocks/EventSuite/filters'
import {
  formatEventDateParts,
  getEventSuiteTextClassName,
  getEventSuiteTextStyle,
  resolveMediaBackground,
  type EventSuiteMedia,
  type EventSuiteTextStyle,
} from '@/blocks/EventSuite/shared'
import { Media } from '@/components/Media'
import { useEventFilters } from '@/providers/EventFilters'
import { useDebounce } from '@/utilities/useDebounce'
import { cn } from '@/utilities/ui'

type Props = {
  btnStyle?: EventSuiteTextStyle | null
  desktopColumns?: null | number
  dtStyle?: EventSuiteTextStyle | null
  emptyStateLabel?: null | string
  emptyStateStyle?: EventSuiteTextStyle | null
  gap?: null | number
  initialHasNextPage?: boolean
  initialNextPage?: null | number
  loadMoreBackgroundImage?: EventSuiteMedia | number | null
  loadMoreLabel?: null | string
  mobileColumns?: null | number
  photos: EventGalleryPhoto[]
  photosPerPage?: null | number
  tabletColumns?: null | number
  ttlStyle?: EventSuiteTextStyle | null
}

const clampNumber = (
  value: null | number | undefined,
  fallback: number,
  min: number,
  max: number,
) => Math.max(Math.min(value || fallback, max), min)

const getResponsiveColumnCount = ({
  desktopColumns,
  mobileColumns,
  tabletColumns,
}: {
  desktopColumns: number
  mobileColumns: number
  tabletColumns: number
}) => {
  if (typeof window === 'undefined') return desktopColumns

  if (window.matchMedia('(min-width: 1024px)').matches) return desktopColumns
  if (window.matchMedia('(min-width: 680px)').matches) return tabletColumns

  return mobileColumns
}

const getGalleryDateLabel = (photo: EventGalleryPhoto) => {
  const dateParts = formatEventDateParts(photo.startsAt)
  const time = photo.dateLabel || dateParts.time

  return `${dateParts.day} ${dateParts.month} ${time}`
}

export const EventGalleryClient: React.FC<Props> = ({
  btnStyle,
  desktopColumns,
  dtStyle,
  emptyStateLabel = 'Nessuna foto trovata',
  emptyStateStyle,
  gap,
  initialHasNextPage = false,
  initialNextPage = null,
  loadMoreBackgroundImage,
  loadMoreLabel = 'Carica altre foto',
  mobileColumns,
  photos,
  photosPerPage = 9,
  tabletColumns,
  ttlStyle,
}) => {
  const safeMobileColumns = clampNumber(mobileColumns, 1, 1, 2)
  const safeTabletColumns = clampNumber(tabletColumns, 2, 1, 3)
  const safeDesktopColumns = clampNumber(desktopColumns, 4, 1, 6)
  const safeGap = clampNumber(gap, 18, 0, 80)
  const safePhotosPerPage = clampNumber(photosPerPage, 9, 1, 24)
  const [photoItems, setPhotoItems] = useState(photos)
  const [hasNextPage, setHasNextPage] = useState(initialHasNextPage)
  const [nextPage, setNextPage] = useState(initialNextPage)
  const [isLoading, setIsLoading] = useState(false)
  const [columnCount, setColumnCount] = useState(safeDesktopColumns)
  const [galleryWidth, setGalleryWidth] = useState(0)
  const galleryRef = useRef<HTMLDivElement | null>(null)
  const { activityId, date, query, venue } = useEventFilters()
  const debouncedQuery = useDebounce(query, 250)
  const hasMountedRef = useRef(false)
  const requestKeyRef = useRef('')
  const activeFilters = useMemo<EventFilterParams>(
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
    const updateColumnCount = () => {
      setColumnCount(
        getResponsiveColumnCount({
          desktopColumns: safeDesktopColumns,
          mobileColumns: safeMobileColumns,
          tabletColumns: safeTabletColumns,
        }),
      )
    }

    updateColumnCount()
    window.addEventListener('resize', updateColumnCount)

    return () => window.removeEventListener('resize', updateColumnCount)
  }, [safeDesktopColumns, safeMobileColumns, safeTabletColumns])

  useEffect(() => {
    const gallery = galleryRef.current

    if (!gallery) return

    const updateGalleryWidth = () => {
      setGalleryWidth(gallery.getBoundingClientRect().width)
    }

    updateGalleryWidth()

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', updateGalleryWidth)

      return () => window.removeEventListener('resize', updateGalleryWidth)
    }

    const resizeObserver = new ResizeObserver(updateGalleryWidth)
    resizeObserver.observe(gallery)

    return () => resizeObserver.disconnect()
  }, [])

  useEffect(() => {
    setPhotoItems(photos)
    setHasNextPage(initialHasNextPage)
    setNextPage(initialNextPage)
  }, [initialHasNextPage, initialNextPage, photos])

  const fetchPhotoPage = useCallback(
    async (page: number, signal?: AbortSignal) => {
      const params = new URLSearchParams({
        page: String(page),
        photosPerPage: String(safePhotosPerPage),
      })
      appendEventFilterSearchParams(params, activeFilters)

      const response = await fetch(`/api/event-gallery?${params.toString()}`, {
        headers: {
          Accept: 'application/json',
        },
        signal,
      })

      if (!response.ok) {
        throw new Error('Unable to load event gallery photos')
      }

      return (await response.json()) as EventGalleryPage
    },
    [activeFilters, safePhotosPerPage],
  )

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true
      return
    }

    const controller = new AbortController()
    const requestKey = JSON.stringify(activeFilters)
    requestKeyRef.current = requestKey
    setIsLoading(true)

    fetchPhotoPage(1, controller.signal)
      .then((data) => {
        if (requestKeyRef.current !== requestKey) return

        setPhotoItems(data.photos || [])
        setHasNextPage(Boolean(data.hasNextPage))
        setNextPage(data.nextPage || null)
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setPhotoItems([])
          setHasNextPage(false)
          setNextPage(null)
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      })

    return () => controller.abort()
  }, [activeFilters, fetchPhotoPage])

  const loadNextPage = async () => {
    if (!hasNextPage || !nextPage || isLoading) return

    setIsLoading(true)

    try {
      const data = await fetchPhotoPage(nextPage)
      setPhotoItems((currentPhotos) => {
        const knownIds = new Set(currentPhotos.map((photo) => photo.id))
        const nextPhotos = (data.photos || []).filter((photo) => !knownIds.has(photo.id))

        return [...currentPhotos, ...nextPhotos]
      })
      setHasNextPage(Boolean(data.hasNextPage))
      setNextPage(data.nextPage || null)
    } catch {
      setHasNextPage(false)
      setNextPage(null)
    } finally {
      setIsLoading(false)
    }
  }

  const getMasonryRowSpan = (photo: EventGalleryPhoto) => {
    const rowHeight = 8
    const columns = Math.max(columnCount, 1)
    const ratio = photo.ratio > 0 ? photo.ratio : 4 / 3
    const fallbackColumnWidth = 320
    const columnWidth = galleryWidth
      ? (galleryWidth - safeGap * (columns - 1)) / columns
      : fallbackColumnWidth
    const targetHeight = columnWidth / ratio

    return Math.max(8, Math.ceil((targetHeight + safeGap) / (rowHeight + safeGap)))
  }

  return (
    <section className="w-full">
      {photoItems.length ? (
        <div
          className="grid min-w-0 items-start"
          ref={galleryRef}
          style={{
            gap: safeGap,
            gridAutoFlow: 'dense',
            gridAutoRows: 8,
            gridTemplateColumns: `repeat(${Math.max(columnCount, 1)}, minmax(0, 1fr))`,
          }}
        >
          {photoItems.map((photo, photoIndex) => (
            <article
              className="event-gallery-card scribble-border event-gallery-card-border group relative isolate h-full w-full min-w-0 overflow-visible"
              key={photo.id}
              style={{
                gridRowEnd: `span ${getMasonryRowSpan(photo)}`,
              }}
            >
              <div className="event-gallery-card__media relative z-0 h-full min-w-0 overflow-hidden">
                <div className="absolute inset-0">
                  <Media
                    fill
                    imgClassName="block h-full w-full object-cover object-center transition duration-500 group-hover:scale-[1.035]"
                    loading={photoIndex === 0 ? 'eager' : 'lazy'}
                    pictureClassName="absolute inset-0 block h-full w-full"
                    priority={photoIndex === 0}
                    quality={75}
                    resource={photo.image}
                    size={`(min-width: 1024px) ${Math.ceil(100 / safeDesktopColumns)}vw, (min-width: 680px) ${Math.ceil(
                      100 / safeTabletColumns,
                    )}vw, ${Math.ceil(100 / safeMobileColumns)}vw`}
                  />
                </div>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 grid gap-1 bg-gradient-to-t from-black/80 via-black/38 to-transparent px-5 pb-5 pt-14">
                  <h3
                    className={getEventSuiteTextClassName(ttlStyle, 'black')}
                    style={getEventSuiteTextStyle(ttlStyle, {
                      fontFamily: 'cinzel',
                      fontSizeDesktop: 22,
                      fontSizeMobile: 18,
                      fontWeight: 'black',
                      lineHeight: 1,
                    })}
                  >
                    {photo.title}
                  </h3>
                  <span
                    className={cn(getEventSuiteTextClassName(dtStyle, 'black'), 'block mt-1.5')}
                    style={getEventSuiteTextStyle(dtStyle, {
                      fontFamily: 'cinzel',
                      fontSizeDesktop: 12,
                      fontSizeMobile: 11,
                      fontWeight: 'black',
                      lineHeight: 1,
                    })}
                  >
                    {getGalleryDateLabel(photo)}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="scribble-border grid min-h-32 place-items-center px-6 py-10 text-center">
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
            {emptyStateLabel || 'Nessuna foto trovata'}
          </span>
        </div>
      )}

      {hasNextPage ? (
        <div className="mt-10 flex justify-center">
          <button
            className={cn(
              getEventSuiteTextClassName(btnStyle, 'black'),
              'inline-flex min-h-12 min-w-48 cursor-pointer items-center justify-center bg-center bg-no-repeat px-8 py-4 disabled:cursor-wait disabled:opacity-60',
            )}
            disabled={isLoading}
            onClick={loadNextPage}
            style={{
              ...getEventSuiteTextStyle(btnStyle, {
                fontFamily: 'cinzel',
                fontSizeDesktop: 13,
                fontSizeMobile: 12,
                fontWeight: 'black',
                lineHeight: 1,
              }),
              backgroundImage: resolveMediaBackground(loadMoreBackgroundImage),
              backgroundSize: loadMoreBackgroundImage ? '100% 100%' : undefined,
            }}
            type="button"
          >
            {loadMoreLabel || 'Carica altre foto'}
          </button>
        </div>
      ) : null}
    </section>
  )
}
