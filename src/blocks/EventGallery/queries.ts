import { buildEventWhere } from '@/blocks/EventSuite/eventWhere'
import type { EventFilterParams } from '@/blocks/EventSuite/filters'
import type { EventSuiteItem, EventSuiteMedia } from '@/blocks/EventSuite/shared'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export const eventGalleryDefaultPageSize = 9

export type EventGalleryPhoto = {
  dateLabel?: null | string
  eventId: number | string
  id: string
  image: EventSuiteMedia
  ratio: number
  startsAt: string
  title: string
}

export type EventGalleryPage = {
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

const flattenEventGalleryPhotos = (events: EventSuiteItem[]): EventGalleryPhoto[] =>
  events.flatMap((event) =>
    (event.gallery || []).flatMap((item, index) => {
      const image = item.image && typeof item.image === 'object' ? item.image : null

      if (!image) return []

      return [
        {
          dateLabel: event.timeLabel,
          eventId: event.id,
          id: `${event.id}-${item.id || image.id || index}`,
          image: getGalleryMedia(image),
          ratio: getMediaRatio(image),
          startsAt: event.startsAt,
          title: event.title,
        },
      ]
    }),
  )

export const getEventGalleryPage = async ({
  filters,
  maxPhotos,
  page,
  photosPerPage,
}: {
  filters?: EventFilterParams
  maxPhotos: number
  page: number
  photosPerPage: number
}): Promise<EventGalleryPage> => {
  const safeMaxPhotos = Math.max(Math.min(maxPhotos || 60, 200), 1)
  const safePage = Math.max(page || 1, 1)
  const safePhotosPerPage = Math.max(Math.min(photosPerPage || eventGalleryDefaultPageSize, 24), 1)
  const start = (safePage - 1) * safePhotosPerPage

  if (start >= safeMaxPhotos) {
    return {
      hasNextPage: false,
      nextPage: null,
      photos: [],
    }
  }

  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'events',
    depth: 1,
    limit: 200,
    pagination: false,
    select: {
      gallery: {
        image: true,
      },
      startsAt: true,
      timeLabel: true,
      title: true,
    },
    sort: 'startsAt',
    where: buildEventWhere(filters),
  })
  const allPhotos = flattenEventGalleryPhotos(result.docs as EventSuiteItem[]).slice(
    0,
    safeMaxPhotos,
  )
  const end = Math.min(start + safePhotosPerPage, safeMaxPhotos)
  const photos = allPhotos.slice(start, end)
  const hasNextPage = end < allPhotos.length

  return {
    hasNextPage,
    nextPage: hasNextPage ? safePage + 1 : null,
    photos,
  }
}
