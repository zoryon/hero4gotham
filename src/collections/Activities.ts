import type { CollectionBeforeValidateHook, CollectionConfig } from 'payload'

import { adminOrEventsManager } from '@/access/roles'

const enforceActivitiesLimit: CollectionBeforeValidateHook = async ({ data, operation, req }) => {
  if (operation !== 'create') return data

  const existing = await req.payload.count({
    collection: 'activities',
  })

  if (existing.totalDocs >= 8) {
    throw new Error('Puoi creare al massimo 8 attività.')
  }

  return data
}

export const Activities: CollectionConfig<'activities'> = {
  slug: 'activities',
  access: {
    create: adminOrEventsManager,
    delete: adminOrEventsManager,
    read: () => true,
    update: adminOrEventsManager,
  },
  admin: {
    defaultColumns: ['title', 'order', 'updatedAt'],
    group: 'Content',
    useAsTitle: 'title',
  },
  defaultPopulate: {
    cta: true,
    ctaImage: true,
    description: true,
    details: true,
    image: true,
    order: true,
    title: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'image',
      type: 'upload',
      label: 'Activity image',
      relationTo: 'media',
    },
    {
      name: 'cta',
      type: 'text',
      label: 'CTA label',
    },
    {
      name: 'ctaImage',
      type: 'upload',
      label: 'CTA strip image',
      relationTo: 'media',
    },
    {
      name: 'details',
      type: 'array',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'icon',
          type: 'upload',
          label: 'Icon',
          relationTo: 'media',
        },
        {
          name: 'text',
          type: 'text',
          required: true,
        },
      ],
      labels: {
        plural: 'Small labels',
        singular: 'Small label',
      },
      maxRows: 4,
    },
    {
      name: 'order',
      type: 'number',
      admin: {
        description: 'Lower numbers appear first in automatic activity blocks.',
        step: 1,
      },
      defaultValue: 0,
      index: true,
      label: 'Display order',
      min: 0,
    },
  ],
  hooks: {
    beforeValidate: [enforceActivitiesLimit],
  },
  labels: {
    plural: 'Activities',
    singular: 'Activity',
  },
}
