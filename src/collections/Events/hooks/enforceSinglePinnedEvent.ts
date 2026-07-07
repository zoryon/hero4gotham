import type { CollectionBeforeChangeHook, Where } from 'payload'

import type { Event } from '../../../payload-types'

export const enforceSinglePinnedEvent: CollectionBeforeChangeHook<Event> = async ({
  context,
  data,
  originalDoc,
  req,
}) => {
  if (context.skipPinnedEventSync || data.pinned !== true || originalDoc?.pinned === true) {
    return data
  }

  const where: Where = originalDoc?.id
    ? {
        and: [{ pinned: { equals: true } }, { id: { not_equals: originalDoc.id } }],
      }
    : { pinned: { equals: true } }

  await req.payload.update({
    collection: 'events',
    context: {
      ...context,
      disableRevalidate: true,
      skipPinnedEventSync: true,
    },
    data: {
      pinned: false,
    },
    req,
    where,
  })

  return data
}
