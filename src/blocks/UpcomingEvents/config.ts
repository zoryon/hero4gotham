import type { Block } from 'payload'

import { link } from '@/fields/link'

export const UpcomingEvents: Block = {
  slug: 'upcomingEvents',
  interfaceName: 'UpcomingEventsBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Prossimi eventi',
      required: true,
    },
    {
      name: 'events',
      type: 'array',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'day',
              type: 'text',
              admin: {
                width: '20%',
              },
              required: true,
            },
            {
              name: 'month',
              type: 'text',
              admin: {
                width: '20%',
              },
              required: true,
            },
            {
              name: 'title',
              type: 'text',
              admin: {
                width: '60%',
              },
              required: true,
            },
          ],
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
        },
        link({
          appearances: false,
          overrides: {
            admin: {
              description: 'Link used by the "Scopri di piu" action.',
            },
          },
        }),
      ],
      labels: {
        plural: 'Events',
        singular: 'Event',
      },
      minRows: 1,
      required: true,
    },
    {
      name: 'featureImage',
      type: 'upload',
      label: 'Feature image',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'posterText',
      type: 'textarea',
      admin: {
        description: 'Optional text shown over the image, like the poster in the reference.',
      },
    },
  ],
  labels: {
    plural: 'Upcoming Events',
    singular: 'Upcoming Events',
  },
}
