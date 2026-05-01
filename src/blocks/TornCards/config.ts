import type { Block, Field } from 'payload'

import {
  typographyFontFamilyOptions,
  typographyFontWeightOptions,
} from '@/fields/typography'
import { paddingOptions } from '@/fields/uiOptions'

const tornCardSpacingOptions = paddingOptions.flatMap((option) =>
  option.value === 'xs'
    ? [
        option,
        {
          label: 'XXS',
          value: 'xxs',
        },
      ]
    : [option],
)

const breakpointFields = (name: string, label: string, defaults: {
  columns: number
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
            width: '50%',
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
            width: '50%',
          },
          defaultValue: defaults.rows,
          label: 'Rows',
          max: 12,
          min: 1,
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
          options: [...tornCardSpacingOptions],
        },
        {
          name: 'right',
          type: 'select',
          admin: {
            width: '25%',
          },
          defaultValue: name === 'padding' ? 'sm' : 'none',
          label: 'Right',
          options: [...tornCardSpacingOptions],
        },
        {
          name: 'bottom',
          type: 'select',
          admin: {
            width: '25%',
          },
          defaultValue: name === 'padding' ? 'sm' : 'none',
          label: 'Bottom',
          options: [...tornCardSpacingOptions],
        },
        {
          name: 'left',
          type: 'select',
          admin: {
            width: '25%',
          },
          defaultValue: name === 'padding' ? 'sm' : 'none',
          label: 'Left',
          options: [...tornCardSpacingOptions],
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
          name: 'scribbleBorder',
          type: 'checkbox',
          defaultValue: false,
          label: 'Scribble border',
          admin: {
            description: 'Adds the optional vintage border to this single card.',
          },
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
                  options: [...tornCardSpacingOptions],
                },
                {
                  name: 'titleDescriptionGap',
                  type: 'select',
                  admin: {
                    width: '50%',
                  },
                  defaultValue: 'xs',
                  label: 'Title/description gap',
                  options: [...tornCardSpacingOptions],
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
              rows: 4,
            }),
            breakpointFields('tablet', 'Tablet', {
              columns: 2,
              rows: 2,
            }),
            breakpointFields('laptop', 'Laptop', {
              columns: 3,
              rows: 2,
            }),
            breakpointFields('desktop', 'Desktop', {
              columns: 4,
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
