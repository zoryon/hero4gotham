import React from 'react'

import { getCachedGlobal } from '@/utilities/getGlobals'

import { ContactMessageBlock as ContactMessageBlockClient } from './Component.client'

type Props = React.ComponentProps<typeof ContactMessageBlockClient>

export const ContactMessageBlock = async (props: Props) => {
  const membershipDocuments = await getCachedGlobal('membershipDocuments', 1)()
  const privacyDocuments =
    membershipDocuments.privacyDocuments?.filter((item) => item.showIn?.includes('contactMessage')) ||
    []

  return <ContactMessageBlockClient {...props} privacyDocuments={privacyDocuments} />
}
