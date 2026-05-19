'use client'

import type { Media as MediaDocument } from '@/payload-types'

import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'
import { useEffect, useMemo, useRef, useState } from 'react'

export type EventDetailGalleryPhoto = {
  caption?: null | string
  id: string
  image: MediaDocument
}

type Props = {
  initialCount?: number
  pageSize?: number
  photos: EventDetailGalleryPhoto[]
}

const clampNumber = (value: number | undefined, fallback: number, min: number, max: number) =>
  Math.max(Math.min(value || fallback, max), min)

const getResponsiveColumnCount = () => {
  if (typeof window === 'undefined') return 3
  if (window.matchMedia('(min-width: 1024px)').matches) return 3
  if (window.matchMedia('(min-width: 680px)').matches) return 2

  return 1
}

const getMediaRatio = (image: MediaDocument) => {
  const width = image.width || image.sizes?.large?.width || image.sizes?.medium?.width || 4
  const height = image.height || image.sizes?.large?.height || image.sizes?.medium?.height || 3

  return width > 0 && height > 0 ? width / height : 4 / 3
}

export const EventDetailGallery = ({ initialCount = 6, pageSize = 6, photos }: Props) => {
  const safeInitialCount = clampNumber(initialCount, 6, 1, 18)
  const safePageSize = clampNumber(pageSize, 6, 1, 18)
  const safeGap = 18
  const [visibleCount, setVisibleCount] = useState(() => Math.min(safeInitialCount, photos.length))
  const [columnCount, setColumnCount] = useState(3)
  const [galleryWidth, setGalleryWidth] = useState(0)
  const galleryRef = useRef<HTMLDivElement | null>(null)
  const visiblePhotos = useMemo(() => photos.slice(0, visibleCount), [photos, visibleCount])
  const hasMorePhotos = visibleCount < photos.length

  useEffect(() => {
    setVisibleCount(Math.min(safeInitialCount, photos.length))
  }, [photos, safeInitialCount])

  useEffect(() => {
    const updateColumnCount = () => {
      setColumnCount(getResponsiveColumnCount())
    }

    updateColumnCount()
    window.addEventListener('resize', updateColumnCount)

    return () => window.removeEventListener('resize', updateColumnCount)
  }, [])

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

  const getMasonryRowSpan = (photo: EventDetailGalleryPhoto) => {
    const rowHeight = 8
    const columns = Math.max(columnCount, 1)
    const ratio = getMediaRatio(photo.image)
    const fallbackColumnWidth = 320
    const columnWidth = galleryWidth
      ? (galleryWidth - safeGap * (columns - 1)) / columns
      : fallbackColumnWidth
    const targetHeight = columnWidth / ratio

    return Math.max(8, Math.ceil((targetHeight + safeGap) / (rowHeight + safeGap)))
  }

  if (!photos.length) return null

  return (
    <div className="w-full">
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
        {visiblePhotos.map((photo, photoIndex) => (
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
                  quality={78}
                  resource={photo.image}
                  size="(min-width: 1024px) 33vw, (min-width: 680px) 50vw, 100vw"
                />
              </div>
              {photo.caption ? (
                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/78 via-black/34 to-transparent px-5 pb-5 pt-14">
                  <p className="text-sm font-semibold leading-5 text-white">{photo.caption}</p>
                </div>
              ) : null}
            </div>
          </article>
        ))}
      </div>

      {hasMorePhotos ? (
        <div className="mt-10 flex justify-center">
          <button
            className={cn(
              'font-rye-western inline-flex min-h-11 min-w-44 cursor-pointer items-center justify-center px-7 py-3 text-xs uppercase leading-none',
              'border border-[color:var(--theme-text-green)] bg-black/25 text-[var(--theme-text-green)] transition hover:bg-[color:var(--theme-text-green)]/15 hover:text-[var(--theme-text-secondary)]',
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--theme-text-green)]',
            )}
            onClick={() =>
              setVisibleCount((current) => Math.min(current + safePageSize, photos.length))
            }
            type="button"
          >
            Carica altre foto
          </button>
        </div>
      ) : null}
    </div>
  )
}
