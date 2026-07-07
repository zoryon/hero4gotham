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
      label: 'Album / foto per caricamento',
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
          label: 'Colonne su mobile',
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
          label: 'Colonne su tablet',
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
          label: 'Colonne su desktop',
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
      label: 'Spazio tra gli elementi (px)',
      min: 0,
      max: 80,
    },
    {
      name: 'loadMoreLabel',
      type: 'text',
      defaultValue: 'Carica altre foto',
      label: 'Testo del pulsante “Carica altre foto”',
      required: true,
    },
    labelImageField('loadMoreBackgroundImage', 'Sfondo del pulsante “Carica altre foto”'),
    {
      name: 'emptyStateLabel',
      type: 'text',
      defaultValue: 'Nessuna foto trovata',
      label: 'Messaggio quando non ci sono foto',
      required: true,
    },
    textStyleField('ttlStyle', "Stile del titolo dell'album", {
      colorTheme: 'primary',
      fontFamily: 'cinzel',
      fontSizeDesktop: 22,
      fontSizeMobile: 18,
      fontWeight: 'black',
      textTransform: 'uppercase',
    }),
    textStyleField('dtStyle', "Stile della data dell'album", {
      colorTheme: 'green',
      fontFamily: 'cinzel',
      fontSizeDesktop: 12,
      fontSizeMobile: 11,
      fontWeight: 'black',
      textTransform: 'uppercase',
    }),
    textStyleField('btnStyle', 'Stile del pulsante di caricamento', {
      colorTheme: 'green',
      fontFamily: 'cinzel',
      fontSizeDesktop: 13,
      fontSizeMobile: 12,
      fontWeight: 'black',
      textTransform: 'uppercase',
    }),
    textStyleField('emptyStateStyle', 'Stile del messaggio senza risultati', {
      colorTheme: 'primary',
      fontFamily: 'cinzel',
      fontSizeDesktop: 16,
      fontSizeMobile: 14,
      fontWeight: 'black',
      textTransform: 'uppercase',
    }),
  ],
  labels: {
    plural: 'Gallerie eventi',
    singular: 'Galleria eventi',
  },
}
