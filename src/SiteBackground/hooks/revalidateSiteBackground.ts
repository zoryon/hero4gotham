import type { GlobalAfterChangeHook } from 'payload'

import { revalidateTag } from 'next/cache'

export const revalidateSiteBackground: GlobalAfterChangeHook = ({
  doc,
  req: { context, payload },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating site background`)

    revalidateTag('global_siteBackground', 'max')
  }

  return doc
}
