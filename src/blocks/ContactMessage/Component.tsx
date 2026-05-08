import React from 'react'

import { ContactMessageBlock as ContactMessageBlockClient } from './Component.client'

type Props = React.ComponentProps<typeof ContactMessageBlockClient>

export const ContactMessageBlock: React.FC<Props> = (props) => {
  return <ContactMessageBlockClient {...props} />
}
