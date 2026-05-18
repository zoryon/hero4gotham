import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Event } from '../../../payload-types'

const getEventPath = (slug?: null | string) => (slug ? `/eventi/${slug}` : null)

export const revalidateEvent: CollectionAfterChangeHook<Event> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    const path = getEventPath(doc.slug)

    if (path) {
      payload.logger.info(`Revalidating event at path: ${path}`)
      revalidatePath(path)
    }

    const oldPath = getEventPath(previousDoc?.slug)

    if (oldPath && oldPath !== path) {
      payload.logger.info(`Revalidating old event at path: ${oldPath}`)
      revalidatePath(oldPath)
    }

    revalidateTag('events', 'max')
    revalidateTag('events-sitemap', 'max')
  }

  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Event> = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    const path = getEventPath(doc?.slug)

    if (path) {
      revalidatePath(path)
    }

    revalidateTag('events', 'max')
    revalidateTag('events-sitemap', 'max')
  }

  return doc
}
