import type { GlobalAfterChangeHook } from 'payload'

import { revalidateTag } from 'next/cache'

export const revalidateMembershipDocuments: GlobalAfterChangeHook = ({
  doc,
  req: { context, payload },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info('Revalidating documents')

    revalidateTag('global_membershipDocuments', 'max')
  }

  return doc
}
