'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import type {
  EventGalleryAlbum,
  EventGalleryAlbumPage,
  EventGalleryPhoto,
  EventGalleryPhotoPage,
} from '@/blocks/EventGallery/queries'
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
  albums: EventGalleryAlbum[]
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

const getGalleryDateLabel = (album: EventGalleryAlbum) => {
  const dateParts = formatEventDateParts(album.startsAt)

  return `${dateParts.day} ${dateParts.month} ${dateParts.time}`
}

export const EventGalleryClient: React.FC<Props> = ({
  albums,
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
  photosPerPage = 9,
  tabletColumns,
  ttlStyle,
}) => {
  const safeMobileColumns = clampNumber(mobileColumns, 1, 1, 2)
  const safeTabletColumns = clampNumber(tabletColumns, 2, 1, 3)
  const safeDesktopColumns = clampNumber(desktopColumns, 4, 1, 6)
  const safeGap = clampNumber(gap, 18, 0, 80)
  const safePhotosPerPage = clampNumber(photosPerPage, 9, 1, 24)
  const [albumItems, setAlbumItems] = useState(albums)
  const [albumHasNextPage, setAlbumHasNextPage] = useState(initialHasNextPage)
  const [albumNextPage, setAlbumNextPage] = useState(initialNextPage)
  const [selectedAlbum, setSelectedAlbum] = useState<EventGalleryAlbum | null>(null)
  const [photoItems, setPhotoItems] = useState<EventGalleryPhoto[]>([])
  const [photoHasNextPage, setPhotoHasNextPage] = useState(false)
  const [photoNextPage, setPhotoNextPage] = useState<null | number>(null)
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
  const visibleItems = selectedAlbum ? photoItems : albumItems
  const hasNextPage = selectedAlbum ? photoHasNextPage : albumHasNextPage

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

    const updateGalleryWidth = () => setGalleryWidth(gallery.getBoundingClientRect().width)
    updateGalleryWidth()

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', updateGalleryWidth)
      return () => window.removeEventListener('resize', updateGalleryWidth)
    }

    const resizeObserver = new ResizeObserver(updateGalleryWidth)
    resizeObserver.observe(gallery)

    return () => resizeObserver.disconnect()
  }, [selectedAlbum, visibleItems.length])

  useEffect(() => {
    setAlbumItems(albums)
    setAlbumHasNextPage(initialHasNextPage)
    setAlbumNextPage(initialNextPage)
    setSelectedAlbum(null)
    setPhotoItems([])
  }, [albums, initialHasNextPage, initialNextPage])

  const fetchAlbumPage = useCallback(
    async (page: number, signal?: AbortSignal) => {
      const params = new URLSearchParams({
        page: String(page),
        photosPerPage: String(safePhotosPerPage),
      })
      appendEventFilterSearchParams(params, activeFilters)

      const response = await fetch(`/api/event-gallery?${params.toString()}`, {
        headers: { Accept: 'application/json' },
        signal,
      })

      if (!response.ok) throw new Error('Unable to load event gallery albums')
      return (await response.json()) as EventGalleryAlbumPage
    },
    [activeFilters, safePhotosPerPage],
  )

  const fetchPhotoPage = useCallback(
    async (eventId: number | string, page: number, signal?: AbortSignal) => {
      const params = new URLSearchParams({
        eventId: String(eventId),
        page: String(page),
        photosPerPage: String(safePhotosPerPage),
      })
      const response = await fetch(`/api/event-gallery?${params.toString()}`, {
        headers: { Accept: 'application/json' },
        signal,
      })

      if (!response.ok) throw new Error('Unable to load event gallery photos')
      return (await response.json()) as EventGalleryPhotoPage
    },
    [safePhotosPerPage],
  )

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true
      return
    }

    const controller = new AbortController()
    const requestKey = JSON.stringify(activeFilters)
    requestKeyRef.current = requestKey
    setSelectedAlbum(null)
    setPhotoItems([])
    setIsLoading(true)

    fetchAlbumPage(1, controller.signal)
      .then((data) => {
        if (requestKeyRef.current !== requestKey) return
        setAlbumItems(data.albums || [])
        setAlbumHasNextPage(Boolean(data.hasNextPage))
        setAlbumNextPage(data.nextPage || null)
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setAlbumItems([])
          setAlbumHasNextPage(false)
          setAlbumNextPage(null)
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false)
      })

    return () => controller.abort()
  }, [activeFilters, fetchAlbumPage])

  const openAlbum = async (album: EventGalleryAlbum) => {
    setSelectedAlbum(album)
    setPhotoItems([])
    setPhotoHasNextPage(false)
    setPhotoNextPage(null)
    setIsLoading(true)

    try {
      const data = await fetchPhotoPage(album.eventId, 1)
      setPhotoItems(data.photos || [])
      setPhotoHasNextPage(Boolean(data.hasNextPage))
      setPhotoNextPage(data.nextPage || null)
    } catch {
      setPhotoItems([])
    } finally {
      setIsLoading(false)
    }
  }

  const loadNextPage = async () => {
    if (!hasNextPage || isLoading) return

    const nextPage = selectedAlbum ? photoNextPage : albumNextPage
    if (!nextPage) return
    setIsLoading(true)

    try {
      if (selectedAlbum) {
        const data = await fetchPhotoPage(selectedAlbum.eventId, nextPage)
        setPhotoItems((current) => {
          const knownIds = new Set(current.map((photo) => photo.id))
          return [...current, ...(data.photos || []).filter((photo) => !knownIds.has(photo.id))]
        })
        setPhotoHasNextPage(Boolean(data.hasNextPage))
        setPhotoNextPage(data.nextPage || null)
      } else {
        const data = await fetchAlbumPage(nextPage)
        setAlbumItems((current) => {
          const knownIds = new Set(current.map((album) => String(album.eventId)))
          return [
            ...current,
            ...(data.albums || []).filter((album) => !knownIds.has(String(album.eventId))),
          ]
        })
        setAlbumHasNextPage(Boolean(data.hasNextPage))
        setAlbumNextPage(data.nextPage || null)
      }
    } catch {
      if (selectedAlbum) {
        setPhotoHasNextPage(false)
        setPhotoNextPage(null)
      } else {
        setAlbumHasNextPage(false)
        setAlbumNextPage(null)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const getMasonryRowSpan = (ratio: number) => {
    const rowHeight = 8
    const columns = Math.max(columnCount, 1)
    const safeRatio = ratio > 0 ? ratio : 4 / 3
    const columnWidth = galleryWidth ? (galleryWidth - safeGap * (columns - 1)) / columns : 320
    const targetHeight = columnWidth / safeRatio

    return Math.max(8, Math.ceil((targetHeight + safeGap) / (rowHeight + safeGap)))
  }

  const buttonStyle = {
    ...getEventSuiteTextStyle(btnStyle, {
      fontFamily: 'cinzel' as const,
      fontSizeDesktop: 13,
      fontSizeMobile: 12,
      fontWeight: 'black' as const,
      lineHeight: 1,
    }),
    backgroundImage: resolveMediaBackground(loadMoreBackgroundImage),
    backgroundSize: loadMoreBackgroundImage ? '100% 100%' : undefined,
  }

  return (
    <section className="w-full px-3 sm:px-0">
      {selectedAlbum ? (
        <div className="mb-8 flex justify-start">
          <button
            className={cn(
              getEventSuiteTextClassName(btnStyle, 'black'),
              'inline-flex min-h-12 cursor-pointer items-center justify-center bg-center bg-no-repeat px-8 py-4',
            )}
            onClick={() => setSelectedAlbum(null)}
            style={buttonStyle}
            type="button"
          >
            ← Torna agli album
          </button>
        </div>
      ) : null}

      {visibleItems.length ? (
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
          {selectedAlbum
            ? photoItems.map((photo, photoIndex) => (
                <article
                  className="event-gallery-card scribble-border event-gallery-card-border group relative isolate h-full w-full min-w-0 overflow-visible"
                  key={photo.id}
                  style={{ gridRowEnd: `span ${getMasonryRowSpan(photo.ratio)}` }}
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
                        size={`(min-width: 1024px) ${Math.ceil(100 / safeDesktopColumns)}vw, (min-width: 680px) ${Math.ceil(100 / safeTabletColumns)}vw, ${Math.ceil(100 / safeMobileColumns)}vw`}
                      />
                    </div>
                  </div>
                </article>
              ))
            : albumItems.map((album, albumIndex) => (
                <button
                  aria-label={`Apri l'album ${album.title}`}
                  className="event-gallery-card scribble-border event-gallery-card-border group relative isolate h-full w-full min-w-0 cursor-pointer overflow-visible text-left"
                  key={album.eventId}
                  onClick={() => openAlbum(album)}
                  style={{ gridRowEnd: `span ${getMasonryRowSpan(album.ratio)}` }}
                  type="button"
                >
                  <div className="event-gallery-card__media relative z-0 h-full min-w-0 overflow-hidden">
                    <div className="absolute inset-0">
                      <Media
                        fill
                        imgClassName="block h-full w-full object-cover object-center transition duration-500 group-hover:scale-[1.035]"
                        loading={albumIndex === 0 ? 'eager' : 'lazy'}
                        pictureClassName="absolute inset-0 block h-full w-full"
                        priority={albumIndex === 0}
                        quality={75}
                        resource={album.cover}
                        size={`(min-width: 1024px) ${Math.ceil(100 / safeDesktopColumns)}vw, (min-width: 680px) ${Math.ceil(100 / safeTabletColumns)}vw, ${Math.ceil(100 / safeMobileColumns)}vw`}
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
                        {album.title}
                      </h3>
                      <span
                        className={cn(getEventSuiteTextClassName(dtStyle, 'black'), 'mt-1.5 block')}
                        style={getEventSuiteTextStyle(dtStyle, {
                          fontFamily: 'cinzel',
                          fontSizeDesktop: 12,
                          fontSizeMobile: 11,
                          fontWeight: 'black',
                          lineHeight: 1,
                        })}
                      >
                        {getGalleryDateLabel(album)}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
        </div>
      ) : !isLoading ? (
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
      ) : (
        <div aria-live="polite" className="min-h-32" role="status">
          <span className="sr-only">Caricamento foto…</span>
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
            style={buttonStyle}
            type="button"
          >
            {selectedAlbum ? loadMoreLabel || 'Carica altre foto' : 'Carica altri album'}
          </button>
        </div>
      ) : null}
    </section>
  )
}
