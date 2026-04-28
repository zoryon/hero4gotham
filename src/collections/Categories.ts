import type { CollectionConfig } from 'payload'

import { adminOnly, hideFromNonAdmins } from '@/access/roles'
import { anyone } from '../access/anyone'
import { slugField } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  access: {
    create: adminOnly,
    delete: adminOnly,
    read: anyone,
    update: adminOnly,
  },
  admin: {
    hidden: hideFromNonAdmins,
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    slugField({
      position: undefined,
    }),
  ],
}
