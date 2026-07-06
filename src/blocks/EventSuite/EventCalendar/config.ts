import type { Block } from 'payload'

import { labelImageField, textStyleField } from '@/blocks/EventSuite/shared'

export const EventCalendar: Block = {
  slug: 'eventCalendar',
  interfaceName: 'EventCalendarBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Calendario eventi',
      required: true,
    },
    labelImageField('headingBackgroundImage', 'Heading background image'),
    {
      name: 'monthOffset',
      type: 'number',
      defaultValue: 0,
      label: 'Month offset',
      min: 0,
      max: 12,
      admin: {
        description: '0 is current month, 1 is next month, and so on.',
      },
    },
    {
      name: 'markerColor',
      type: 'text',
      label: 'Event marker color',
      admin: {
        description: 'Optional CSS color for days that contain events.',
      },
    },
    textStyleField('hdgStyle', 'Heading typography', {
      colorTheme: 'green',
      fontFamily: 'cinzel',
      fontSizeDesktop: 13,
      fontSizeMobile: 12,
      fontWeight: 'black',
      textTransform: 'uppercase',
    }),
    textStyleField('monStyle', 'Month typography', {
      colorTheme: 'secondary',
      fontFamily: 'cinzel',
      fontSizeDesktop: 12,
      fontSizeMobile: 12,
      fontWeight: 'black',
      textTransform: 'uppercase',
    }),
    textStyleField('dayStyle', 'Day typography', {
      colorTheme: 'primary',
      fontFamily: 'geistMono',
      fontSizeDesktop: 10,
      fontSizeMobile: 10,
      fontWeight: 'regular',
    }),
  ],
  labels: {
    plural: 'Event Calendars',
    singular: 'Event Calendar',
  },
}
