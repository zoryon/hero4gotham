import type { Block } from 'payload'

import { labelImageField, textStyleField } from '@/blocks/EventSuite/shared'

export const EventGallery: Block = {
  slug: 'eventGallery',
  dbName: 'event_gallery',
  interfaceName: 'EventGalleryBlock',
  fields: [
    {
      name: 'photosPerPage',
      type: 'number',
      defaultValue: 9,
      label: 'Albums / photos per load',
      min: 1,
      max: 24,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'mobileColumns',
          type: 'number',
          defaultValue: 1,
          label: 'Mobile columns',
          min: 1,
          max: 2,
          admin: {
            width: '33.333%',
          },
        },
        {
          name: 'tabletColumns',
          type: 'number',
          defaultValue: 2,
          label: 'Tablet columns',
          min: 1,
          max: 3,
          admin: {
            width: '33.333%',
          },
        },
        {
          name: 'desktopColumns',
          type: 'number',
          defaultValue: 4,
          label: 'Desktop columns',
          min: 1,
          max: 6,
          admin: {
            width: '33.333%',
          },
        },
      ],
    },
    {
      name: 'gap',
      type: 'number',
      defaultValue: 18,
      label: 'Gallery gap (px)',
      min: 0,
      max: 80,
    },
    {
      name: 'loadMoreLabel',
      type: 'text',
      defaultValue: 'Carica altre foto',
      label: 'Load more label',
      required: true,
    },
    labelImageField('loadMoreBackgroundImage', 'Load more background image'),
    {
      name: 'emptyStateLabel',
      type: 'text',
      defaultValue: 'Nessuna foto trovata',
      label: 'Empty state label',
      required: true,
    },
    textStyleField('ttlStyle', 'Album title typography', {
      colorTheme: 'primary',
      fontFamily: 'cinzel',
      fontSizeDesktop: 22,
      fontSizeMobile: 18,
      fontWeight: 'black',
      textTransform: 'uppercase',
    }),
    textStyleField('dtStyle', 'Album date typography', {
      colorTheme: 'green',
      fontFamily: 'cinzel',
      fontSizeDesktop: 12,
      fontSizeMobile: 11,
      fontWeight: 'black',
      textTransform: 'uppercase',
    }),
    textStyleField('btnStyle', 'Load more typography', {
      colorTheme: 'green',
      fontFamily: 'cinzel',
      fontSizeDesktop: 13,
      fontSizeMobile: 12,
      fontWeight: 'black',
      textTransform: 'uppercase',
    }),
    textStyleField('emptyStateStyle', 'Empty state typography', {
      colorTheme: 'primary',
      fontFamily: 'cinzel',
      fontSizeDesktop: 16,
      fontSizeMobile: 14,
      fontWeight: 'black',
      textTransform: 'uppercase',
    }),
  ],
  labels: {
    plural: 'Event Galleries',
    singular: 'Event Gallery',
  },
}
