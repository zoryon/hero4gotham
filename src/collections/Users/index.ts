import type { CollectionConfig } from 'payload'

import {
  adminFieldOnly,
  adminOnly,
  adminOrSelf,
  canAccessAdmin,
  hideFromNonAdmins,
} from '@/access/roles'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: canAccessAdmin,
    create: adminOnly,
    delete: adminOnly,
    read: adminOrSelf,
    update: adminOrSelf,
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
      access: {
        create: adminFieldOnly,
        update: adminFieldOnly,
      },
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
