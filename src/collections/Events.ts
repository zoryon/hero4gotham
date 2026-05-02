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
    defaultColumns: ['title', 'activity', 'startsAt', 'venue', 'updatedAt'],
    group: 'Content',
    useAsTitle: 'title',
  },
  defaultPopulate: {
    activity: true,
    dateDayLabel: true,
    dateMonthLabel: true,
    description: true,
    link: true,
    startsAt: true,
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
      type: 'row',
      fields: [
        {
          name: 'dateDayLabel',
          type: 'text',
          admin: {
            description: 'Optional override for the displayed day.',
            width: '50%',
          },
          label: 'Displayed day',
        },
        {
          name: 'dateMonthLabel',
          type: 'text',
          admin: {
            description: 'Optional override for the displayed month.',
            width: '50%',
          },
          label: 'Displayed month',
        },
      ],
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
