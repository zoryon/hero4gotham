import type { EventFilterParams } from '@/blocks/EventSuite/filters'
import type { EventSuiteMedia } from '@/blocks/EventSuite/shared'
import configPromise from '@payload-config'
import { getPayload, type Payload } from 'payload'
import { buildAlbumPageQuery, buildPhotoPageQuery } from './sql'

export const eventGalleryDefaultPageSize = 9

export type EventGalleryAlbum = {
  cover: EventSuiteMedia
  endsAt?: null | string
  eventId: number | string
  ratio: number
  startsAt: string
  title: string
}

export type EventGalleryPhoto = {
  id: string
  image: EventSuiteMedia
  ratio: number
}

export type EventGalleryAlbumPage = {
  albums: EventGalleryAlbum[]
  hasNextPage: boolean
  nextPage: null | number
}

export type EventGalleryPhotoPage = {
  hasNextPage: boolean
  nextPage: null | number
  photos: EventGalleryPhoto[]
}

const getMediaRatio = (image: EventSuiteMedia) => {
  const width = image.width || image.sizes?.large?.width || image.sizes?.medium?.width || 4
  const height = image.height || image.sizes?.large?.height || image.sizes?.medium?.height || 3

  return width > 0 && height > 0 ? width / height : 4 / 3
}

const getGalleryMedia = (
  image: Pick<
    EventSuiteMedia,
    'alt' | 'height' | 'id' | 'mimeType' | 'updatedAt' | 'url' | 'width'
  >,
): EventSuiteMedia =>
  ({
    alt: image.alt,
    height: image.height,
    id: image.id,
    mimeType: image.mimeType,
    updatedAt: image.updatedAt,
    url: image.url,
    width: image.width,
  }) as EventSuiteMedia

type PhotoRow = { id: string; imageId: number }
type AlbumRow = {
  id: number
  imageId: number
  title: string
  startsAt: Date | string
  endsAt: Date | string | null
}

const getSafePageSize = (value: number) =>
  Number.isFinite(value) ? Math.max(1, Math.min(Math.floor(value || 9), 24)) : 9
const getSafePage = (value: number) =>
  Number.isFinite(value) ? Math.max(1, Math.floor(value || 1)) : 1
const toISOString = (value: Date | string) => new Date(value).toISOString()

const loadPageMedia = async (payload: Payload, rows: { imageId: number }[]) => {
  if (!rows.length) return new Map<number, EventSuiteMedia>()
  const ids = [...new Set(rows.map((row) => row.imageId))]
  const result = await payload.find({
    collection: 'media',
    depth: 0,
    limit: ids.length,
    where: { id: { in: ids } },
    select: { alt: true, height: true, mimeType: true, updatedAt: true, url: true, width: true },
  })
  return new Map(result.docs.map((image) => [image.id, getGalleryMedia(image)]))
}

export const getEventGalleryPage = async ({
  filters,
  page,
  photosPerPage,
}: {
  filters?: EventFilterParams
  page: number
  photosPerPage: number
}): Promise<EventGalleryAlbumPage> => {
  const payload = await getPayload({ config: configPromise })
  const safePage = getSafePage(page)
  const safePageSize = getSafePageSize(photosPerPage)
  // Eligibility and pagination run in PostgreSQL; only this page's covers are populated.
  // Events are publicly readable; media loading retains the existing Local API access behavior.
  const result = await payload.db.drizzle.execute(
    buildAlbumPageQuery(filters, safePageSize + 1, (safePage - 1) * safePageSize),
  )
  const rows = result.rows as AlbumRow[]
  const pageRows = rows.slice(0, safePageSize)
  const media = await loadPageMedia(payload, pageRows)
  const albums = pageRows.flatMap((row): EventGalleryAlbum[] => {
    const cover = media.get(row.imageId)
    return cover
      ? [
          {
            cover,
            endsAt: row.endsAt ? toISOString(row.endsAt) : null,
            eventId: row.id,
            ratio: getMediaRatio(cover),
            startsAt: toISOString(row.startsAt),
            title: row.title,
          },
        ]
      : []
  })
  const hasNextPage = rows.length > safePageSize
  return { albums, hasNextPage, nextPage: hasNextPage ? safePage + 1 : null }
}

export const getEventGalleryPhotosPage = async ({
  eventId,
  page,
  photosPerPage,
}: {
  eventId: number | string
  page: number
  photosPerPage: number
}): Promise<EventGalleryPhotoPage> => {
  const payload = await getPayload({ config: configPromise })
  const safePage = getSafePage(page)
  const safePageSize = getSafePageSize(photosPerPage)
  const result = await payload.db.drizzle.execute(
    buildPhotoPageQuery(eventId, safePageSize + 1, (safePage - 1) * safePageSize),
  )
  const rows = result.rows as PhotoRow[]
  const pageRows = rows.slice(0, safePageSize)
  const media = await loadPageMedia(payload, pageRows)
  const photos = pageRows.flatMap((row): EventGalleryPhoto[] => {
    const image = media.get(row.imageId)
    return image ? [{ id: `${eventId}-${row.id}`, image, ratio: getMediaRatio(image) }] : []
  })
  const hasNextPage = rows.length > safePageSize
  return { photos, hasNextPage, nextPage: hasNextPage ? safePage + 1 : null }
}
