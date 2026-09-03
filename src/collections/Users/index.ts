import type { CollectionConfig } from 'payload'

import {
  adminFieldOnly,
  adminOnly,
  adminOrSelf,
  canAccessAdmin,
  hideFromNonAdmins,
  showToAdmins,
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
    group: 'Amministrazione',
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
      admin: {
        condition: showToAdmins,
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
