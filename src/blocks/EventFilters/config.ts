import type { Block, Field } from 'payload'

import {
  typographyFontFamilyOptions,
  typographyFontWeightOptions,
  typographyLetterSpacingOptions,
  typographyVerticalScaleOptions,
} from '@/fields/typography'
import { colorOptions, textTransformOptions } from '@/fields/uiOptions'

const fontStyleOptions = [
  {
    label: 'Normal',
    value: 'normal',
  },
  {
    label: 'Italic',
    value: 'italic',
  },
] as const

const textStyleFields = (
  name: string,
  label: string,
  defaults: {
    colorCustom: string
    colorGlobal: string
    colorMode: string
    fontFamily: string
    fontSizeDesktop: number
    fontSizeMobile: number
    fontStyle: string
    fontWeight: string
    letterSpacing: string
    lineHeight: number
    textTransform: string
    verticalScale: string
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
          name: 'fontFamily',
          type: 'select',
          defaultValue: defaults.fontFamily,
          label: 'Font family',
          options: [...typographyFontFamilyOptions],
          admin: {
            width: '25%',
          },
        },
        {
          name: 'fontWeight',
          type: 'select',
          defaultValue: defaults.fontWeight,
          label: 'Font weight',
          options: [...typographyFontWeightOptions],
          admin: {
            width: '25%',
          },
        },
        {
          name: 'fontStyle',
          type: 'select',
          defaultValue: defaults.fontStyle,
          label: 'Font style',
          options: [...fontStyleOptions],
          admin: {
            width: '25%',
          },
        },
        {
          name: 'verticalScale',
          type: 'select',
          defaultValue: defaults.verticalScale,
          label: 'Height stretch',
          options: [...typographyVerticalScaleOptions],
          admin: {
            width: '25%',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'fontSizeMobile',
          type: 'number',
          defaultValue: defaults.fontSizeMobile,
          label: 'Mobile size (px)',
          min: 8,
          max: 80,
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
          max: 90,
          admin: {
            step: 1,
            width: '25%',
          },
        },
        {
          name: 'lineHeight',
          type: 'number',
          defaultValue: defaults.lineHeight,
          label: 'Line height',
          min: 0.6,
          max: 2,
          admin: {
            step: 0.01,
            width: '25%',
          },
        },
        {
          name: 'letterSpacing',
          type: 'select',
          defaultValue: defaults.letterSpacing,
          label: 'Letter spacing',
          options: [...typographyLetterSpacingOptions],
          admin: {
            width: '25%',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'textTransform',
          type: 'select',
          defaultValue: defaults.textTransform,
          label: 'Text transform',
          options: [...textTransformOptions],
          admin: {
            width: '33%',
          },
        },
        {
          name: 'colorMode',
          type: 'radio',
          defaultValue: defaults.colorMode,
          label: 'Color source',
          options: [
            {
              label: 'Global theme',
              value: 'global',
            },
            {
              label: 'Custom',
              value: 'custom',
            },
          ],
          admin: {
            layout: 'horizontal',
            width: '33%',
          },
        },
        {
          name: 'colorGlobal',
          type: 'select',
          defaultValue: defaults.colorGlobal,
          label: 'Global color',
          options: [...colorOptions],
          admin: {
            condition: (_, siblingData) => siblingData?.colorMode !== 'custom',
            width: '33%',
          },
        },
      ],
    },
    {
      name: 'colorCustom',
      type: 'text',
      defaultValue: defaults.colorCustom,
      label: 'Custom color',
      admin: {
        condition: (_, siblingData) => siblingData?.colorMode === 'custom',
        description: 'CSS color, for example #a3e635 or rgb(255 255 255 / 0.8).',
      },
    },
  ],
})

export const EventFilters: Block = {
  slug: 'eventFilters',
  dbName: 'event_filters',
  interfaceName: 'EventFiltersBlock',
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Labels',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'allEventsLabel',
                  type: 'text',
                  defaultValue: 'Tutti gli eventi',
                  label: 'All events label',
                  required: true,
                  admin: {
                    width: '50%',
                  },
                },
                {
                  name: 'filterByLabel',
                  type: 'text',
                  defaultValue: 'Filtra per:',
                  label: 'Filter label',
                  required: true,
                  admin: {
                    width: '50%',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'searchPlaceholder',
                  type: 'text',
                  defaultValue: 'Cerca un evento...',
                  label: 'Search placeholder',
                  required: true,
                  admin: {
                    width: '50%',
                  },
                },
                {
                  name: 'dateLabel',
                  type: 'text',
                  defaultValue: 'Data',
                  label: 'Date label',
                  required: true,
                  admin: {
                    width: '50%',
                  },
                },
              ],
            },
            {
              name: 'typeLabel',
              type: 'text',
              defaultValue: 'Tipologia',
              label: 'Type label',
              required: true,
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'venueLabel',
                  type: 'text',
                  defaultValue: 'Luogo',
                  label: 'Venue label',
                  required: true,
                  admin: {
                    width: '50%',
                  },
                },
                {
                  name: 'allVenuesLabel',
                  type: 'text',
                  defaultValue: 'Tutti i luoghi',
                  label: 'All venues label',
                  required: true,
                  admin: {
                    width: '50%',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Style',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'textColor',
                  type: 'text',
                  defaultValue: '#f3eee5',
                  label: 'Text color',
                  admin: {
                    width: '33%',
                  },
                },
                {
                  name: 'accentColor',
                  type: 'text',
                  defaultValue: '#93b51f',
                  label: 'Accent color',
                  admin: {
                    width: '33%',
                  },
                },
                {
                  name: 'mutedColor',
                  type: 'text',
                  defaultValue: 'rgba(243,238,229,0.68)',
                  label: 'Muted color',
                  admin: {
                    width: '33%',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'searchBorder',
                  type: 'checkbox',
                  defaultValue: false,
                  label: 'Search border',
                  admin: {
                    width: '25%',
                  },
                },
                {
                  name: 'dateBorder',
                  type: 'checkbox',
                  defaultValue: false,
                  label: 'Date border',
                  admin: {
                    width: '25%',
                  },
                },
                {
                  name: 'typeBorder',
                  type: 'checkbox',
                  defaultValue: false,
                  label: 'Type border',
                  admin: {
                    width: '25%',
                  },
                },
                {
                  name: 'venueBorder',
                  type: 'checkbox',
                  defaultValue: false,
                  label: 'Venue border',
                  admin: {
                    width: '25%',
                  },
                },
              ],
            },
            textStyleFields('controlTextStyle', 'Control text', {
              colorCustom: '#f3eee5',
              colorGlobal: 'primary',
              colorMode: 'custom',
              fontFamily: 'geistSans',
              fontSizeDesktop: 14,
              fontSizeMobile: 14,
              fontStyle: 'normal',
              fontWeight: 'regular',
              letterSpacing: 'tight',
              lineHeight: 1.15,
              textTransform: 'normal',
              verticalScale: 'normal',
            }),
            textStyleFields('filterLabelTextStyle', 'Filter label text', {
              colorCustom: '#93b51f',
              colorGlobal: 'accent',
              colorMode: 'custom',
              fontFamily: 'geistSans',
              fontSizeDesktop: 12,
              fontSizeMobile: 12,
              fontStyle: 'normal',
              fontWeight: 'black',
              letterSpacing: 'tight',
              lineHeight: 1,
              textTransform: 'uppercase',
              verticalScale: 'normal',
            }),
          ],
        },
      ],
    },
  ],
  labels: {
    plural: 'Event Filters',
    singular: 'Event Filters',
  },
}
