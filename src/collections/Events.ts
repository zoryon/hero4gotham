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
    longDescription: true,
    gallery: true,
    artistsAndGuests: true,
    startsAt: true,
    slug: true,
    timeLabel: true,
    title: true,
    timeline: true,
    audience: true,
    banner: true,
    usefulInfo: true,
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
      name: 'banner',
      type: 'upload',
      admin: {
        description:
          'Optional special banner used on the generated event detail page, between the hero text and event info bar.',
      },
      label: 'Banner',
      relationTo: 'media',
    },
    {
      type: 'collapsible',
      label: 'Background',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'backgroundImage',
          type: 'upload',
          label: 'Desktop background image',
          relationTo: 'media',
        },
        {
          name: 'bgTab',
          type: 'upload',
          label: 'Tablet background image',
          relationTo: 'media',
          admin: {
            description: 'Optional. Falls back to the desktop image if empty.',
          },
        },
        {
          name: 'bgMob',
          type: 'upload',
          label: 'Mobile background image',
          relationTo: 'media',
          admin: {
            description: 'Optional. Falls back to the tablet or desktop image if empty.',
          },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'imageQuality',
              type: 'number',
              defaultValue: 95,
              label: 'Image quality',
              min: 75,
              max: 100,
              admin: {
                description:
                  'Higher values reduce compression artifacts. Use 95-100 for full-screen textured backgrounds.',
                step: 1,
                width: '25%',
              },
            },
            {
              name: 'imagePositionMobile',
              type: 'select',
              defaultValue: 'center',
              label: 'Mobile position',
              options: [
                { label: 'Center', value: 'center' },
                { label: 'Top', value: 'top' },
                { label: 'Bottom', value: 'bottom' },
                { label: 'Left', value: 'left' },
                { label: 'Right', value: 'right' },
                { label: 'Top left', value: 'topLeft' },
                { label: 'Top right', value: 'topRight' },
                { label: 'Bottom left', value: 'bottomLeft' },
                { label: 'Bottom right', value: 'bottomRight' },
              ],
              admin: {
                width: '25%',
              },
            },
            {
              name: 'imagePositionTablet',
              type: 'select',
              defaultValue: 'center',
              label: 'Tablet position',
              options: [
                { label: 'Center', value: 'center' },
                { label: 'Top', value: 'top' },
                { label: 'Bottom', value: 'bottom' },
                { label: 'Left', value: 'left' },
                { label: 'Right', value: 'right' },
                { label: 'Top left', value: 'topLeft' },
                { label: 'Top right', value: 'topRight' },
                { label: 'Bottom left', value: 'bottomLeft' },
                { label: 'Bottom right', value: 'bottomRight' },
              ],
              admin: {
                width: '25%',
              },
            },
            {
              name: 'imagePositionDesktop',
              type: 'select',
              defaultValue: 'center',
              label: 'Desktop position',
              options: [
                { label: 'Center', value: 'center' },
                { label: 'Top', value: 'top' },
                { label: 'Bottom', value: 'bottom' },
                { label: 'Left', value: 'left' },
                { label: 'Right', value: 'right' },
                { label: 'Top left', value: 'topLeft' },
                { label: 'Top right', value: 'topRight' },
                { label: 'Bottom left', value: 'bottomLeft' },
                { label: 'Bottom right', value: 'bottomRight' },
              ],
              admin: {
                width: '25%',
              },
            },
          ],
        },
        {
          name: 'overlay',
          type: 'select',
          defaultValue: 'medium',
          options: [
            { label: 'None', value: 'none' },
            { label: 'Light', value: 'light' },
            { label: 'Medium', value: 'medium' },
            { label: 'Strong', value: 'strong' },
          ],
        },
        {
          name: 'width',
          type: 'select',
          defaultValue: 'full',
          options: [
            { label: 'Full width', value: 'full' },
            { label: 'Contained', value: 'contained' },
          ],
        },
        {
          name: 'padding',
          type: 'select',
          defaultValue: 'medium',
          options: [
            { label: 'Small', value: 'small' },
            { label: 'Medium', value: 'medium' },
            { label: 'Large', value: 'large' },
          ],
        },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Short summary used in event cards, previews, and the top of the event page.',
      },
      label: 'Descrizione breve',
      required: true,
    },
    {
      name: 'longDescription',
      type: 'textarea',
      admin: {
        description: 'Optional longer text shown in the event detail page.',
      },
      label: 'Descrizione lunga',
    },
    {
      name: 'timeline',
      type: 'array',
      admin: {
        description:
          'Optional event schedule. Add time, short title, and a brief description for each step.',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'time',
          type: 'text',
          label: 'Orario',
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          label: 'Titolo',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Descrizione',
        },
      ],
      label: 'Timestamps / programma',
      labels: {
        plural: 'Timestamps',
        singular: 'Timestamp',
      },
    },
    {
      name: 'artistsAndGuests',
      type: 'array',
      admin: {
        description:
          'Optional section for artists, hosts, speakers, and guests shown in the event detail page.',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'firstName',
          type: 'text',
          label: 'Nome',
          required: true,
        },
        {
          name: 'lastName',
          type: 'text',
          label: 'Cognome',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Descrizione breve',
        },
        {
          name: 'photo',
          type: 'upload',
          label: 'Foto',
          relationTo: 'media',
        },
      ],
      label: 'Artisti ed ospiti',
      labels: {
        plural: 'Artisti ed ospiti',
        singular: 'Artista o ospite',
      },
    },
    {
      name: 'usefulInfo',
      type: 'array',
      admin: {
        description: 'Optional practical information blocks shown in the event detail page.',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'icon',
          type: 'upload',
          label: 'Icona',
          relationTo: 'media',
        },
        {
          name: 'title',
          type: 'text',
          label: 'Titolo',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Descrizione',
        },
      ],
      label: 'Informazioni utili',
      labels: {
        plural: 'Informazioni utili',
        singular: 'Informazione utile',
      },
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
