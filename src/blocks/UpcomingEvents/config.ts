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
      name: 'emptyEventsTitle',
      type: 'text',
      defaultValue: 'Nessun evento in programma',
      label: 'Empty events title',
      required: true,
    },
    {
      name: 'emptyEventsText',
      type: 'textarea',
      defaultValue: 'Torna presto per scoprire le prossime date.',
      label: 'Empty events text',
    },
    {
      name: 'eventLinkLabel',
      type: 'text',
      defaultValue: 'Scopri di piu',
      label: 'Event link fallback label',
      required: true,
    },
    {
      name: 'eventSource',
      type: 'radio',
      admin: {
        layout: 'horizontal',
      },
      defaultValue: 'automatic',
      label: 'Events source',
      options: [
        {
          label: 'Automatic: next 2 by date',
          value: 'automatic',
        },
        {
          label: 'Manual selection',
          value: 'manual',
        },
      ],
      required: true,
    },
    {
      name: 'manualEvents',
      type: 'relationship',
      admin: {
        condition: (_, siblingData) => siblingData?.eventSource === 'manual',
        description: 'Choose the events to show. The block will render the first two selected.',
      },
      hasMany: true,
      label: 'Manual events',
      maxRows: 2,
      relationTo: 'events',
    },
    {
      name: 'leftBackground',
      type: 'upload',
      label: 'Events panel background',
      relationTo: 'media',
    },
    {
      name: 'featureImage',
      type: 'upload',
      label: 'Events feature image',
      relationTo: 'media',
    },
    {
      name: 'rightBackground',
      type: 'upload',
      label: 'CTA panel background',
      relationTo: 'media',
    },
    {
      name: 'ctaTitle',
      type: 'text',
      defaultValue: 'Diventa socio',
      label: 'CTA title',
      required: true,
    },
    {
      name: 'ctaText',
      type: 'textarea',
      defaultValue:
        'Sostieni le nostre attivita e fai parte di una comunita che trasforma il diverso in straordinario.',
      label: 'CTA text',
    },
    link({
      appearances: false,
      overrides: {
        name: 'ctaLink',
        label: 'CTA link',
      },
    }),
    {
      name: 'ctaLinkFallbackLabel',
      type: 'text',
      defaultValue: 'Unisciti a noi',
      label: 'CTA link fallback label',
      required: true,
    },
    {
      name: 'ctaGlyph',
      type: 'upload',
      label: 'CTA decorative image',
      relationTo: 'media',
    },
    {
      type: 'collapsible',
      label: 'Text style',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'headingColor',
              type: 'text',
              admin: {
                width: '50%',
              },
              defaultValue: '#211713',
              label: 'Heading color',
            },
            {
              name: 'dateColor',
              type: 'text',
              admin: {
                width: '50%',
              },
              defaultValue: '#e879f9',
              label: 'Date color',
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'eventTitleColor',
              type: 'text',
              admin: {
                width: '50%',
              },
              defaultValue: '#fef3c7',
              label: 'Event title color',
            },
            {
              name: 'eventTextColor',
              type: 'text',
              admin: {
                width: '50%',
              },
              defaultValue: '#f4f4f5',
              label: 'Event text color',
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'eventLinkColor',
              type: 'text',
              admin: {
                width: '50%',
              },
              defaultValue: '#a3e635',
              label: 'Event link color',
            },
            {
              name: 'ctaTextColor',
              type: 'text',
              admin: {
                width: '50%',
              },
              defaultValue: '#ffffff',
              label: 'CTA text color',
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'ctaButtonBackgroundColor',
              type: 'text',
              admin: {
                width: '50%',
              },
              defaultValue: '#84cc16',
              label: 'CTA button background',
            },
            {
              name: 'ctaButtonTextColor',
              type: 'text',
              admin: {
                width: '50%',
              },
              defaultValue: '#251414',
              label: 'CTA button text color',
            },
          ],
        },
      ],
    },
  ],
  labels: {
    plural: 'Upcoming Events',
    singular: 'Upcoming Events',
  },
}
