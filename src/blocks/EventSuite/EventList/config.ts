import type { Block, Field } from 'payload'

import { labelImageField, textStyleField, themeColorOptions } from '@/blocks/EventSuite/shared'
import { typographyVerticalScaleOptions } from '@/fields/typography'

const datePartTextStyleField = (
  name: string,
  label: string,
  defaults: {
    colorTheme: string
    fontSizeDesktop: number
    fontSizeMobile: number
  },
): Field => ({
  name,
  type: 'group',
  label,
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'fontSizeMobile',
          type: 'number',
          defaultValue: defaults.fontSizeMobile,
          label: 'Mobile size (px)',
          min: 8,
          max: 160,
          admin: {
            step: 1,
            width: '25%',
          },
        },
        {
          name: 'fontSizeDesktop',
          type: 'number',
          defaultValue: defaults.fontSizeDesktop,
          label: 'Desktop size (px)',
          min: 8,
          max: 180,
          admin: {
            step: 1,
            width: '25%',
          },
        },
        {
          name: 'verticalScale',
          type: 'select',
          dbName: 'vs',
          defaultValue: 'normal',
          label: 'Height stretch',
          options: [...typographyVerticalScaleOptions],
          admin: {
            width: '25%',
          },
        },
        {
          name: 'colorTheme',
          type: 'select',
          dbName: 'ct',
          defaultValue: defaults.colorTheme,
          label: 'Theme color',
          options: [...themeColorOptions],
          admin: {
            width: '25%',
          },
        },
      ],
    },
  ],
})

const eventTypeTextStyleField = (): Field => ({
  name: 'typStyle',
  type: 'group',
  label: 'Event type typography',
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'fontSizeMobile',
          type: 'number',
          defaultValue: 10,
          label: 'Mobile size (px)',
          min: 8,
          max: 160,
          admin: {
            step: 1,
            width: '33.333%',
          },
        },
        {
          name: 'fontSizeDesktop',
          type: 'number',
          defaultValue: 11,
          label: 'Desktop size (px)',
          min: 8,
          max: 180,
          admin: {
            step: 1,
            width: '33.333%',
          },
        },
        {
          name: 'colorTheme',
          type: 'select',
          dbName: 'ct',
          defaultValue: 'green',
          label: 'Theme color',
          options: [...themeColorOptions],
          admin: {
            width: '33.333%',
          },
        },
      ],
    },
  ],
})

const emptyStateTypographyField = (): Field => ({
  name: 'emptyStateTypography',
  type: 'array',
  defaultValue: [
    {
      style: {
        colorTheme: 'primary',
        fontFamily: 'cinzel',
        fontSizeDesktop: 16,
        fontSizeMobile: 14,
        fontWeight: 'black',
        textTransform: 'uppercase',
      },
    },
  ],
  label: 'Empty state typography',
  labels: {
    plural: 'Typography settings',
    singular: 'Typography setting',
  },
  maxRows: 1,
  fields: [
    textStyleField('style', 'Typography', {
      colorTheme: 'primary',
      fontFamily: 'cinzel',
      fontSizeDesktop: 16,
      fontSizeMobile: 14,
      fontWeight: 'black',
      textTransform: 'uppercase',
    }),
  ],
})

const yearTypographyField = (): Field => ({
  name: 'yearTypography',
  type: 'array',
  defaultValue: [
    {
      style: {
        colorTheme: 'primary',
        fontSizeDesktop: 11,
        fontSizeMobile: 9,
        verticalScale: 'normal',
      },
    },
  ],
  label: 'Date year typography',
  labels: {
    plural: 'Typography settings',
    singular: 'Typography setting',
  },
  maxRows: 1,
  fields: [
    datePartTextStyleField('style', 'Typography', {
      colorTheme: 'primary',
      fontSizeDesktop: 11,
      fontSizeMobile: 9,
    }),
  ],
})

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
      name: 'eventLinkFallbackLabel',
      type: 'text',
      defaultValue: 'Scopri di piu',
      required: true,
    },
    {
      name: 'emptyStateLabel',
      type: 'text',
      defaultValue: 'Non sono presenti eventi',
      label: 'Empty state label',
      required: true,
    },
    {
      name: 'maxEvents',
      type: 'number',
      defaultValue: 30,
      label: 'Maximum upcoming events to load',
      min: 3,
      max: 100,
    },
    {
      name: 'rowHeight',
      type: 'number',
      defaultValue: 112,
      label: 'Event row height (px)',
      min: 1,
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
    datePartTextStyleField('monthStyle', 'Date month typography', {
      colorTheme: 'primary',
      fontSizeDesktop: 13,
      fontSizeMobile: 10,
    }),
    yearTypographyField(),
    datePartTextStyleField('weekdayStyle', 'Date weekday typography', {
      colorTheme: 'primary',
      fontSizeDesktop: 13,
      fontSizeMobile: 10,
    }),
    datePartTextStyleField('timeStyle', 'Date time typography', {
      colorTheme: 'primary',
      fontSizeDesktop: 13,
      fontSizeMobile: 10,
    }),
    textStyleField('ttlStyle', 'Event title typography', {
      colorTheme: 'secondary',
      fontFamily: 'cinzel',
      fontSizeDesktop: 19,
      fontSizeMobile: 16,
      fontWeight: 'black',
      textTransform: 'uppercase',
    }),
    eventTypeTextStyleField(),
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
    emptyStateTypographyField(),
  ],
  labels: {
    plural: 'Event Lists',
    singular: 'Event List',
  },
}
