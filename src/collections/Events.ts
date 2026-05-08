import type { CollectionConfig } from 'payload'

import { adminOrEventsManager } from '@/access/roles'
import { link } from '@/fields/link'

export const Events: CollectionConfig<'events'> = {
  slug: 'events',
  access: {
    create: adminOrEventsManager,
    delete: adminOrEventsManager,
    read: () => true,
    update: adminOrEventsManager,
  },
  admin: {
    defaultColumns: ['title', 'activity', 'startsAt', 'timeLabel', 'venue', 'updatedAt'],
    group: 'Content',
    useAsTitle: 'title',
  },
  defaultPopulate: {
    activity: true,
    description: true,
    gallery: true,
    image: true,
    link: true,
    startsAt: true,
    timeLabel: true,
    title: true,
    venue: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'activity',
      type: 'relationship',
      admin: {
        description: 'Activity used by the event filters.',
      },
      label: 'Event type',
      relationTo: 'activities',
    },
    {
      name: 'startsAt',
      type: 'date',
      index: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
      label: 'Event date',
      required: true,
    },
    {
      name: 'timeLabel',
      type: 'text',
      admin: {
        description:
          'Optional display time. If empty, the frontend formats the time from Event date.',
      },
      label: 'Display time',
    },
    {
      name: 'image',
      type: 'upload',
      admin: {
        description: 'Legacy fallback image. The frontend prefers the first gallery image.',
      },
      label: 'Fallback event image',
      relationTo: 'media',
    },
    {
      name: 'gallery',
      type: 'array',
      admin: {
        description:
          'Event photos. The first image is used anywhere the event card needs a single image.',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          label: 'Photo',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
        },
      ],
      labels: {
        plural: 'Photos',
        singular: 'Photo',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'venue',
      type: 'text',
      admin: {
        description: 'Place used by the event filters.',
      },
      index: true,
      label: 'Venue',
      validate: (value: unknown) =>
        typeof value === 'string' && value.trim().length > 0 ? true : 'Venue is required.',
    },
    link({
      appearances: false,
      overrides: {
        admin: {
          description: 'Link used by the "Scopri di piu" event action.',
        },
      },
    }),
  ],
}
