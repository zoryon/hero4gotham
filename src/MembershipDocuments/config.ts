import type { GlobalConfig } from 'payload'

import { adminOrEventsManager } from '@/access/roles'
import { revalidateMembershipDocuments } from './hooks/revalidateMembershipDocuments'

export const MembershipDocuments: GlobalConfig = {
  slug: 'membershipDocuments',
  label: 'Documenti candidatura associazione',
  access: {
    read: () => true,
    update: adminOrEventsManager,
  },
  fields: [
    {
      name: 'privacyDocuments',
      type: 'array',
      admin: {
        components: {
          RowLabel: '@/MembershipDocuments/RowLabel#RowLabel',
        },
        description:
          'Documenti mostrati nel quadrante Dichiarazioni del blocco candidatura associazione.',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Titolo',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Descrizione',
        },
        {
          name: 'document',
          type: 'upload',
          label: 'Documento scaricabile',
          relationTo: 'media',
          required: true,
        },
      ],
      label: 'Documenti privacy',
    },
  ],
  hooks: {
    afterChange: [revalidateMembershipDocuments],
  },
}
