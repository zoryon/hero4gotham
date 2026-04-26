import type { Block, Field } from 'payload'

import {
  typographyFontFamilyOptions,
  typographyFontWeightOptions,
} from '@/fields/typography'
import { paddingOptions } from '@/fields/uiOptions'

const breakpointFields = (name: string, label: string, defaults: {
  columns: number
  minHeight: number
  rows: number
}): Field => ({
  name,
  type: 'group',
  label,
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'columns',
          type: 'number',
          admin: {
            step: 1,
            width: '33%',
          },
          defaultValue: defaults.columns,
          label: 'Columns',
          max: 8,
          min: 1,
          required: true,
        },
        {
          name: 'rows',
          type: 'number',
          admin: {
            step: 1,
            width: '33%',
          },
          defaultValue: defaults.rows,
          label: 'Rows',
          max: 12,
          min: 1,
          required: true,
        },
        {
          name: 'minHeight',
          type: 'number',
          admin: {
            step: 10,
            width: '33%',
          },
          defaultValue: defaults.minHeight,
          label: 'Minimum card height',
          max: 800,
          min: 120,
          required: true,
        },
      ],
    },
  ],
})

const cardTypographyFields = (name: string, label: string, defaults: {
  fontFamily: string
  fontSize: number
  fontWeight: string
}): Field => ({
  name,
  type: 'group',
  label,
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'family',
          type: 'select',
          admin: {
            width: '33%',
          },
          defaultValue: defaults.fontFamily,
          label: 'Font family',
          options: [...typographyFontFamilyOptions],
        },
        {
          name: 'size',
          type: 'number',
          admin: {
            step: 1,
            width: '33%',
          },
          defaultValue: defaults.fontSize,
          label: 'Font size',
          max: 96,
          min: 8,
        },
        {
          name: 'weight',
          type: 'select',
          admin: {
            width: '34%',
          },
          defaultValue: defaults.fontWeight,
          label: 'Font weight',
          options: [...typographyFontWeightOptions],
        },
      ],
    },
  ],
})

const cardSpacingFields = (name: string, label: string): Field => ({
  name,
  type: 'group',
  label,
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'top',
          type: 'select',
          admin: {
            width: '25%',
          },
          defaultValue: name === 'padding' ? 'sm' : 'none',
          label: 'Top',
          options: [...paddingOptions],
        },
        {
          name: 'right',
          type: 'select',
          admin: {
            width: '25%',
          },
          defaultValue: name === 'padding' ? 'sm' : 'none',
          label: 'Right',
          options: [...paddingOptions],
        },
        {
          name: 'bottom',
          type: 'select',
          admin: {
            width: '25%',
          },
          defaultValue: name === 'padding' ? 'sm' : 'none',
          label: 'Bottom',
          options: [...paddingOptions],
        },
        {
          name: 'left',
          type: 'select',
          admin: {
            width: '25%',
          },
          defaultValue: name === 'padding' ? 'sm' : 'none',
          label: 'Left',
          options: [...paddingOptions],
        },
      ],
    },
  ],
})

export const TornCards: Block = {
  slug: 'tornCards',
  interfaceName: 'TornCardsBlock',
  fields: [
    {
      name: 'items',
      type: 'array',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          label: 'Image above title',
          relationTo: 'media',
        },
        {
          name: 'imageSize',
          type: 'select',
          defaultValue: 'md',
          label: 'Image size',
          options: [
            {
              label: 'Small',
              value: 'sm',
            },
            {
              label: 'Medium',
              value: 'md',
            },
            {
              label: 'Large',
              value: 'lg',
            },
          ],
        },
        {
          name: 'title',
          type: 'text',
          label: 'Title',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description',
        },
        {
          type: 'collapsible',
          label: 'Spacing',
          admin: {
            initCollapsed: true,
          },
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'imageTitleGap',
                  type: 'select',
                  admin: {
                    width: '50%',
                  },
                  defaultValue: 'xs',
                  label: 'Image/title gap',
                  options: [...paddingOptions],
                },
                {
                  name: 'titleDescriptionGap',
                  type: 'select',
                  admin: {
                    width: '50%',
                  },
                  defaultValue: 'xs',
                  label: 'Title/description gap',
                  options: [...paddingOptions],
                },
              ],
            },
            cardSpacingFields('padding', 'Padding'),
            cardSpacingFields('margin', 'Margin'),
          ],
        },
        {
          type: 'collapsible',
          label: 'Typography',
          admin: {
            initCollapsed: true,
          },
          fields: [
            cardTypographyFields('titleType', 'Title typography', {
              fontFamily: 'cinzel',
              fontSize: 14,
              fontWeight: 'semibold',
            }),
            cardTypographyFields('descType', 'Description typography', {
              fontFamily: 'geistSans',
              fontSize: 12,
              fontWeight: 'regular',
            }),
          ],
        },
        {
          name: 'descBreaks',
          type: 'array',
          label: 'Description line breaks',
          admin: {
            initCollapsed: true,
          },
          fields: [
            {
              name: 'word',
              type: 'text',
              label: 'Word or phrase',
              required: true,
            },
            {
              name: 'occurrences',
              type: 'number',
              admin: {
                description: '0 = every matching occurrence.',
              },
              defaultValue: 1,
              label: 'Occurrence count',
              max: 20,
              min: 0,
            },
            {
              name: 'breaks',
              type: 'number',
              defaultValue: 1,
              label: 'Line break count',
              max: 5,
              min: 1,
            },
          ],
          labels: {
            plural: 'Line break rules',
            singular: 'Line break rule',
          },
        },
      ],
      labels: {
        plural: 'Torn cards',
        singular: 'Torn card',
      },
      minRows: 1,
      required: true,
    },
    {
      name: 'fillDirection',
      type: 'select',
      defaultValue: 'row',
      label: 'Item arrangement',
      options: [
        {
          label: 'By rows',
          value: 'row',
        },
        {
          label: 'By columns',
          value: 'column',
        },
      ],
      required: true,
    },
    {
      type: 'collapsible',
      label: 'Responsive layout',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'responsive',
          type: 'group',
          label: false,
          fields: [
            breakpointFields('mobile', 'Mobile', {
              columns: 1,
              minHeight: 210,
              rows: 4,
            }),
            breakpointFields('tablet', 'Tablet', {
              columns: 2,
              minHeight: 220,
              rows: 2,
            }),
            breakpointFields('desktop', 'Desktop', {
              columns: 4,
              minHeight: 210,
              rows: 1,
            }),
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Style',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'cardBg',
              type: 'text',
              admin: {
                width: '50%',
              },
              defaultValue: '#1f1428',
              label: 'Card background',
            },
            {
              name: 'shadowColor',
              type: 'text',
              admin: {
                width: '50%',
              },
              defaultValue: '#0a0704',
              label: 'Torn edge shadow',
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'borderColor',
              type: 'text',
              admin: {
                width: '50%',
              },
              defaultValue: '#6b4635',
              label: 'Border color',
            },
            {
              name: 'accentColor',
              type: 'text',
              admin: {
                width: '50%',
              },
              defaultValue: '#8d2c8c',
              label: 'Accent',
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'titleColor',
              type: 'text',
              admin: {
                width: '50%',
              },
              defaultValue: '#e8d5a0',
              label: 'Title color',
            },
            {
              name: 'textColor',
              type: 'text',
              admin: {
                width: '50%',
              },
              defaultValue: '#d9d0c2',
              label: 'Text color',
            },
          ],
        },
      ],
    },
  ],
  labels: {
    plural: 'Torn Cards',
    singular: 'Torn Cards',
  },
}
