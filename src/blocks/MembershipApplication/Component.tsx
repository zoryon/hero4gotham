import React from 'react'

import { MembershipApplicationBlock as MembershipApplicationBlockClient } from './Component.client'

type Props = React.ComponentProps<typeof MembershipApplicationBlockClient>

export const MembershipApplicationBlock: React.FC<Props> = (props) => {
  return <MembershipApplicationBlockClient {...props} />
}
