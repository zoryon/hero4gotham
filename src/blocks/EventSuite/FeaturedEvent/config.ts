import type { Block } from 'payload'

import { labelImageField, specialBorderField, textStyleField } from '@/blocks/EventSuite/shared'

export const FeaturedEvent: Block = {
  slug: 'featuredEvent',
  interfaceName: 'FeaturedEventBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Evento in evidenza',
      required: true,
    },
    labelImageField('headingBackgroundImage', 'Heading background image'),
    {
      name: 'eventSource',
      type: 'radio',
      defaultValue: 'automatic',
      label: 'Featured event source',
      options: [
        {
          label: 'Automatic: next upcoming event',
          value: 'automatic',
        },
        {
          label: 'Manual selection',
          value: 'manual',
        },
      ],
      admin: {
        layout: 'horizontal',
      },
    },
    {
      name: 'manualEvent',
      type: 'relationship',
      label: 'Manual featured event',
      relationTo: 'events',
      admin: {
        condition: (_, siblingData) => siblingData?.eventSource === 'manual',
      },
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      label: 'Card background image',
      relationTo: 'media',
      admin: {
        description:
          'Optional override for this card. If empty, the selected event image is used, then the fallback image.',
      },
    },
    {
      name: 'fallbackImage',
      type: 'upload',
      label: 'Fallback image',
      relationTo: 'media',
    },
    {
      name: 'linkFallbackLabel',
      type: 'text',
      defaultValue: 'Scopri di piu',
      required: true,
    },
    labelImageField('linkBackgroundImage', 'Link background image'),
    specialBorderField(),
    textStyleField('hdgStyle', 'Heading typography', {
      colorTheme: 'green',
      fontFamily: 'cinzel',
      fontSizeDesktop: 13,
      fontSizeMobile: 12,
      fontWeight: 'black',
      textTransform: 'uppercase',
    }),
    textStyleField('ttlStyle', 'Title typography', {
      colorTheme: 'accent',
      fontFamily: 'cinzel',
      fontSizeDesktop: 24,
      fontSizeMobile: 22,
      fontWeight: 'black',
      textTransform: 'uppercase',
    }),
    textStyleField('dtStyle', 'Date typography', {
      colorTheme: 'green',
      fontFamily: 'cinzel',
      fontSizeDesktop: 12,
      fontSizeMobile: 12,
      fontWeight: 'black',
      textTransform: 'uppercase',
    }),
    textStyleField('typStyle', 'Event typologies typography', {
      colorTheme: 'purple',
      fontFamily: 'cinzel',
      fontSizeDesktop: 9,
      fontSizeMobile: 9,
      fontWeight: 'black',
      textTransform: 'uppercase',
    }),
    textStyleField('descStyle', 'Description typography', {
      colorTheme: 'primary',
      fontFamily: 'geistSans',
      fontSizeDesktop: 11,
      fontSizeMobile: 11,
      fontWeight: 'regular',
    }),
    textStyleField('lnkStyle', 'Link typography', {
      colorTheme: 'green',
      fontFamily: 'cinzel',
      fontSizeDesktop: 10,
      fontSizeMobile: 10,
      fontWeight: 'black',
      textTransform: 'uppercase',
    }),
  ],
  labels: {
    plural: 'Featured Events',
    singular: 'Featured Event',
  },
}
