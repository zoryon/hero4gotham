import type { GlobalConfig } from 'payload'

import { adminOrEventsManager } from '@/access/roles'
import { revalidateMembershipDocuments } from './hooks/revalidateMembershipDocuments'

export const MembershipDocuments: GlobalConfig = {
  slug: 'membershipDocuments',
  label: 'Documenti',
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
          'Documenti scaricabili mostrati nei form selezionati.',
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
          name: 'showIn',
          type: 'select',
          defaultValue: ['membershipApplication'],
          hasMany: true,
          label: 'Mostra in',
          options: [
            {
              label: 'Form candidatura',
              value: 'membershipApplication',
            },
            {
              label: 'Form contatto',
              value: 'contactMessage',
            },
          ],
          required: true,
        },
        {
          name: 'document',
          type: 'upload',
          label: 'Documento scaricabile',
          relationTo: 'media',
          required: true,
        },
      ],
      label: 'Documenti',
    },
  ],
  hooks: {
    afterChange: [revalidateMembershipDocuments],
  },
}
