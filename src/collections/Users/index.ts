import type { CollectionConfig } from 'payload'

import { adminOnly, canAccessAdmin, hideFromNonAdmins } from '@/access/roles'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: canAccessAdmin,
    create: adminOnly,
    delete: adminOnly,
    read: adminOnly,
    update: adminOnly,
  },
  admin: {
    defaultColumns: ['name', 'email'],
    hidden: hideFromNonAdmins,
    useAsTitle: 'name',
  },
  auth: true,
  fields: [
    {
      name: 'role',
      type: 'select',
      defaultValue: 'admin',
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'Gestore eventi',
          value: 'eventsManager',
        },
      ],
      saveToJWT: true,
    },
    {
      name: 'name',
      type: 'text',
    },
  ],
  timestamps: true,
}
