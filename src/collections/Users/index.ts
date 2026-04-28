import type { CollectionConfig } from 'payload'

import { adminOnly, adminOrEventsManager, canAccessAdmin } from '@/access/roles'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: canAccessAdmin,
    create: adminOnly,
    delete: adminOnly,
    read: adminOrEventsManager,
    update: adminOnly,
  },
  admin: {
    defaultColumns: ['name', 'email'],
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
