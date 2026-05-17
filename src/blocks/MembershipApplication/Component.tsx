import React from 'react'

import { getCachedGlobal } from '@/utilities/getGlobals'

import { MembershipApplicationBlock as MembershipApplicationBlockClient } from './Component.client'

type Props = React.ComponentProps<typeof MembershipApplicationBlockClient>

export const MembershipApplicationBlock = async (props: Props) => {
  const membershipDocuments = await getCachedGlobal('membershipDocuments', 1)()

  return (
    <MembershipApplicationBlockClient
      {...props}
      privacyDocuments={membershipDocuments.privacyDocuments}
    />
  )
}
