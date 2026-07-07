import { buildEventWhere } from '@/blocks/EventSuite/eventWhere'
import type { EventFilterParams } from '@/blocks/EventSuite/filters'
import type { EventSuiteItem, EventSuiteMedia } from '@/blocks/EventSuite/shared'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export const eventGalleryDefaultPageSize = 9

export type EventGalleryAlbum = {
  cover: EventSuiteMedia
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

const getGalleryMedia = (image: EventSuiteMedia): EventSuiteMedia =>
  ({
    alt: image.alt,
    height: image.height,
    id: image.id,
    mimeType: image.mimeType,
    updatedAt: image.updatedAt,
    url: image.url,
    width: image.width,
  }) as EventSuiteMedia

const getPopulatedGallery = (event: EventSuiteItem) =>
  (event.gallery || []).flatMap((item, index) => {
    const image = item.image && typeof item.image === 'object' ? item.image : null

    return image ? [{ ...item, image, index }] : []
  })

const toAlbum = (event: EventSuiteItem): EventGalleryAlbum | null => {
  const gallery = getPopulatedGallery(event)
  const coverItem = gallery.find((item) => item.isCover) || gallery[0]

  if (!coverItem) return null

  const cover = getGalleryMedia(coverItem.image)

  return {
    cover,
    eventId: event.id,
    ratio: getMediaRatio(coverItem.image),
    startsAt: event.startsAt,
    title: event.title,
  }
}

const toPhotos = (event: EventSuiteItem): EventGalleryPhoto[] =>
  getPopulatedGallery(event).map((item) => {
    const image = getGalleryMedia(item.image)

    return {
      id: `${event.id}-${item.id || image.id || item.index}`,
      image,
      ratio: getMediaRatio(item.image),
    }
  })

const getSafePageSize = (pageSize: number) => Math.max(Math.min(pageSize || 9, 24), 1)

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
  const safePage = Math.max(page || 1, 1)
  const result = await payload.find({
    collection: 'events',
    depth: 1,
    limit: getSafePageSize(photosPerPage),
    page: safePage,
    select: {
      gallery: {
        image: true,
        isCover: true,
      },
      startsAt: true,
      title: true,
    },
    sort: 'startsAt',
    where: buildEventWhere(filters),
  })

  return {
    albums: (result.docs as EventSuiteItem[]).flatMap((event) => {
      const album = toAlbum(event)
      return album ? [album] : []
    }),
    hasNextPage: result.hasNextPage,
    nextPage: result.hasNextPage ? safePage + 1 : null,
  }
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
  const safePage = Math.max(page || 1, 1)
  const safePageSize = getSafePageSize(photosPerPage)
  const event = (await payload.findByID({
    collection: 'events',
    depth: 1,
    id: eventId,
    select: {
      gallery: {
        image: true,
      },
    },
  })) as EventSuiteItem
  const allPhotos = toPhotos(event)
  const start = (safePage - 1) * safePageSize
  const end = start + safePageSize
  const hasNextPage = end < allPhotos.length

  return {
    hasNextPage,
    nextPage: hasNextPage ? safePage + 1 : null,
    photos: allPhotos.slice(start, end),
  }
}
