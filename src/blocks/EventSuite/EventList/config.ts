import type { Block } from 'payload'

import { labelImageField, textStyleField } from '@/blocks/EventSuite/shared'

export const EventList: Block = {
  slug: 'eventList',
  interfaceName: 'EventListBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Prossimi eventi',
      required: true,
    },
    labelImageField('headingBackgroundImage', 'Heading background image'),
    {
      name: 'loadMoreLabel',
      type: 'text',
      defaultValue: 'Carica altri eventi',
      required: true,
    },
    labelImageField('loadMoreBackgroundImage', 'Load more background image'),
    {
      name: 'eventLinkFallbackLabel',
      type: 'text',
      defaultValue: 'Scopri di piu',
      required: true,
    },
    {
      name: 'maxEvents',
      type: 'number',
      defaultValue: 30,
      label: 'Maximum upcoming events to load',
      min: 5,
      max: 100,
    },
    {
      name: 'rowHeight',
      type: 'number',
      defaultValue: 128,
      label: 'Event row height (px)',
      min: 112,
      max: 220,
    },
    {
      name: 'featuredBadgeLabel',
      type: 'text',
      defaultValue: 'In evidenza',
      label: 'First event badge label',
    },
    {
      name: 'dividerColor',
      type: 'text',
      label: 'Divider color',
      admin: {
        description: 'Optional CSS color. Leave empty for no visible divider.',
      },
    },
    textStyleField('hdgStyle', 'Heading typography', {
      colorTheme: 'green',
      fontFamily: 'cinzel',
      fontSizeDesktop: 14,
      fontSizeMobile: 13,
      fontWeight: 'black',
      textTransform: 'uppercase',
    }),
    textStyleField('ddyStyle', 'Date day typography', {
      colorTheme: 'accent',
      fontFamily: 'cinzel',
      fontSizeDesktop: 44,
      fontSizeMobile: 34,
      fontWeight: 'black',
      textTransform: 'uppercase',
    }),
    textStyleField('dmtStyle', 'Date meta typography', {
      colorTheme: 'primary',
      fontFamily: 'cinzel',
      fontSizeDesktop: 13,
      fontSizeMobile: 10,
      fontWeight: 'black',
      textTransform: 'uppercase',
    }),
    textStyleField('ttlStyle', 'Event title typography', {
      colorTheme: 'secondary',
      fontFamily: 'cinzel',
      fontSizeDesktop: 19,
      fontSizeMobile: 16,
      fontWeight: 'black',
      textTransform: 'uppercase',
    }),
    textStyleField('descStyle', 'Event description typography', {
      colorTheme: 'primary',
      fontFamily: 'geistSans',
      fontSizeDesktop: 12,
      fontSizeMobile: 10,
      fontWeight: 'regular',
    }),
    textStyleField('lnkStyle', 'Event link typography', {
      colorTheme: 'green',
      fontFamily: 'cinzel',
      fontSizeDesktop: 10,
      fontSizeMobile: 10,
      fontWeight: 'black',
      textTransform: 'uppercase',
    }),
    textStyleField('btnStyle', 'Load more typography', {
      colorTheme: 'green',
      fontFamily: 'cinzel',
      fontSizeDesktop: 10,
      fontSizeMobile: 10,
      fontWeight: 'black',
      textTransform: 'uppercase',
    }),
  ],
  labels: {
    plural: 'Event Lists',
    singular: 'Event List',
  },
}
