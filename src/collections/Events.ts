import type { CollectionConfig } from 'payload'

import { adminOrEventsManager } from '@/access/roles'
import { slugField } from 'payload'
import { enforceSinglePinnedEvent } from './Events/hooks/enforceSinglePinnedEvent'
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
    defaultColumns: ['title', 'pinned', 'slug', 'activity', 'startsAt', 'venue', 'updatedAt'],
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
    pinned: true,
    startsAt: true,
    slug: true,
    title: true,
    timeline: true,
    audience: true,
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
      name: 'pinned',
      type: 'checkbox',
      admin: {
        description:
          "Porta questo evento alla prima posizione dell'elenco eventi. Attivandolo, l'eventuale evento già fissato verrà sostituito.",
        position: 'sidebar',
      },
      defaultValue: false,
      index: true,
      label: 'Fissa in cima',
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
      name: 'gallery',
      type: 'array',
      minRows: 1,
      required: true,
      admin: {
        description:
          "Foto dell'evento. Puoi scegliere una copertina per l'album e un banner per la pagina evento. Se non selezioni una copertina o un banner, verrà usata la prima foto.",
        initCollapsed: true,
      },
      validate: (value) => {
        if (!Array.isArray(value)) return true

        const coverCount = value.filter(
          (photo) =>
            photo && typeof photo === 'object' && 'isCover' in photo && photo.isCover === true,
        ).length
        const bannerCount = value.filter(
          (photo) =>
            photo && typeof photo === 'object' && 'isBanner' in photo && photo.isBanner === true,
        ).length

        if (coverCount > 1) return "Puoi selezionare una sola foto come copertina dell'album."
        if (bannerCount > 1)
          return 'Puoi selezionare una sola foto come banner della pagina evento.'

        return true
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          label: 'Foto',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
          label: 'Didascalia',
        },
        {
          name: 'isCover',
          type: 'checkbox',
          defaultValue: false,
          label: "Usa come copertina dell'album",
          admin: {
            description:
              'Facoltativa. Selezionando questa foto, ogni altra copertina scelta verrà deselezionata automaticamente.',
            components: {
              Field: '@/components/ExclusiveGalleryCheckboxField#ExclusiveGalleryCheckboxField',
            },
          },
        },
        {
          name: 'isBanner',
          type: 'checkbox',
          defaultValue: false,
          label: 'Usa come banner della pagina evento',
          admin: {
            description:
              'Facoltativo. Selezionando questa foto, ogni altro banner scelto verrà deselezionato automaticamente. La copertina dell’album non verrà modificata.',
            components: {
              Field: '@/components/ExclusiveGalleryCheckboxField#ExclusiveGalleryCheckboxField',
            },
          },
        },
      ],
      labels: {
        plural: 'Foto',
        singular: 'Foto',
      },
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
    beforeChange: [enforceSinglePinnedEvent],
  },
}
