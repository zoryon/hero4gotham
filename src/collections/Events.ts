import type { CollectionConfig } from 'payload'

import { adminOrEventsManager } from '@/access/roles'
import { slugField } from 'payload'
import { revalidateDelete, revalidateEvent } from './Events/hooks/revalidateEvent'

export const Events: CollectionConfig<'events'> = {
  slug: 'events',
  access: {
    create: adminOrEventsManager,
    delete: adminOrEventsManager,
    read: () => true,
    update: adminOrEventsManager,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'activity', 'startsAt', 'timeLabel', 'venue', 'updatedAt'],
    group: 'Content',
    preview: (data) => (data?.slug ? `/eventi/${data.slug as string}` : null),
    useAsTitle: 'title',
  },
  defaultPopulate: {
    activity: true,
    description: true,
    gallery: true,
    startsAt: true,
    slug: true,
    timeLabel: true,
    title: true,
    audience: true,
    venue: true,
    venueAddress: true,
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
      name: 'gallery',
      type: 'array',
      minRows: 1,
      required: true,
      admin: {
        description:
          'Event photos. Add at least one photo. The first image is used anywhere the event card needs a single image.',
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
        description: 'Display venue used by event lists and filters.',
      },
      index: true,
      label: 'Display venue',
      validate: (value: unknown) =>
        typeof value === 'string' && value.trim().length > 0 ? true : 'Venue is required.',
    },
    {
      name: 'venueAddress',
      type: 'text',
      admin: {
        description: 'Venue address shown on the generated event detail page.',
      },
      label: 'Venue address',
    },
    {
      name: 'audience',
      type: 'text',
      admin: {
        description: 'Public/audience label shown on the generated event detail page.',
      },
      label: 'Audience',
    },
    slugField(),
  ],
  hooks: {
    afterChange: [revalidateEvent],
    afterDelete: [revalidateDelete],
  },
}
