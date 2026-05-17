import type { GlobalAfterChangeHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

export const revalidatePrivacyPolicy: GlobalAfterChangeHook = ({ doc, req: { context, payload } }) => {
  if (!context.disableRevalidate) {
    payload.logger.info('Revalidating privacy policy')

    revalidateTag('global_privacyPolicy', 'max')
    revalidatePath('/privacy-policy')
  }

  return doc
}
