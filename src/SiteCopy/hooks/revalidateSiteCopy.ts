import type { GlobalAfterChangeHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

export const revalidateSiteCopy: GlobalAfterChangeHook = ({ doc, req }) => {
  if (!req.context.disableRevalidate) {
    revalidateTag('global_siteCopy', 'max')
    revalidatePath('/', 'layout')
  }

  return doc
}
