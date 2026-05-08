import React from 'react'

import { EventGalleryClient } from '@/blocks/EventGallery/Component.client'
import { getEventGalleryPage } from '@/blocks/EventGallery/queries'
import { unstable_cache } from 'next/cache'

type Props = React.ComponentProps<typeof EventGalleryClient>

const getInitialGalleryPage = unstable_cache(
  async (maxPhotos: number, photosPerPage: number) =>
    getEventGalleryPage({ maxPhotos, page: 1, photosPerPage }),
  ['event-gallery-initial'],
  {
    revalidate: 300,
    tags: ['events'],
  },
)

export const EventGalleryBlock = async ({ maxPhotos = 60, photosPerPage = 9, ...props }: Props) => {
  const safeMaxPhotos = Math.max(Math.min(maxPhotos || 60, 200), 1)
  const safePhotosPerPage = Math.max(Math.min(photosPerPage || 9, 24), 1)
  const initialPage = await getInitialGalleryPage(safeMaxPhotos, safePhotosPerPage)

  return (
    <EventGalleryClient
      {...props}
      initialHasNextPage={initialPage.hasNextPage}
      initialNextPage={initialPage.nextPage}
      maxPhotos={safeMaxPhotos}
      photos={initialPage.photos}
      photosPerPage={safePhotosPerPage}
    />
  )
}
