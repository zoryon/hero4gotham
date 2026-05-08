import React from 'react'

import { EventGalleryClient } from '@/blocks/EventGallery/Component.client'
import { getEventGalleryPage } from '@/blocks/EventGallery/queries'
import { unstable_cache } from 'next/cache'

type Props = React.ComponentProps<typeof EventGalleryClient>

const getInitialGalleryPage = unstable_cache(
  async (photosPerPage: number) => getEventGalleryPage({ page: 1, photosPerPage }),
  ['event-gallery-initial'],
  {
    revalidate: 300,
    tags: ['events'],
  },
)

export const EventGalleryBlock = async ({ photosPerPage = 9, ...props }: Props) => {
  const safePhotosPerPage = Math.max(Math.min(photosPerPage || 9, 24), 1)
  const initialPage = await getInitialGalleryPage(safePhotosPerPage)

  return (
    <EventGalleryClient
      {...props}
      initialHasNextPage={initialPage.hasNextPage}
      initialNextPage={initialPage.nextPage}
      photos={initialPage.photos}
      photosPerPage={safePhotosPerPage}
    />
  )
}
