import type { Block, Field } from 'payload'

import {
  typographyFontFamilyOptions,
  typographyFontWeightOptions,
  typographyLetterSpacingOptions,
  typographyVerticalScaleOptions,
} from '@/fields/typography'
import { paddingOptions, textTransformOptions } from '@/fields/uiOptions'

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

const themeColorOptions = [
  {
    label: 'Primary text',
    value: 'primary',
  },
  {
    label: 'Secondary text',
    value: 'secondary',
  },
  {
    label: 'Accent text',
    value: 'accent',
  },
  {
    label: 'Muted text',
    value: 'muted',
  },
  {
    label: 'Green text',
    value: 'green',
  },
  {
    label: 'Purple text',
    value: 'purple',
  },
] as const

const textStyleFields = (
  name: string,
  label: string,
  defaults: {
    color: string
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
          dbName: 'ff',
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
          dbName: 'fw',
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
          dbName: 'fst',
          defaultValue: defaults.fontStyle,
          label: 'Font style',
          options: [
            {
              label: 'Normal',
              value: 'normal',
            },
            {
              label: 'Italic',
              value: 'italic',
            },
          ],
          admin: {
            width: '25%',
          },
        },
        {
          name: 'verticalScale',
          type: 'select',
          dbName: 'vs',
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
          max: 180,
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
          max: 220,
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
          max: 3,
          admin: {
            step: 0.01,
            width: '25%',
          },
        },
        {
          name: 'letterSpacing',
          type: 'select',
          dbName: 'ls',
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
          dbName: 'tt',
          defaultValue: defaults.textTransform,
          label: 'Text transform',
          options: [...textTransformOptions],
          admin: {
            width: '33%',
          },
        },
        {
          name: 'color',
          type: 'text',
          defaultValue: defaults.color,
          label: 'Text color',
          admin: {
            description: 'CSS color, e.g. #90a434, white, or rgba(255,255,255,0.85).',
            width: '34%',
          },
        },
        {
          name: 'maxWidth',
          type: 'number',
          defaultValue: 520,
          label: 'Max width (px)',
          min: 120,
          max: 1400,
          admin: {
            step: 1,
            width: '33%',
          },
        },
      ],
    },
  ],
})

const breakpointFields = (
  name: string,
  label: string,
  defaults: {
    columns: number
    rows: number
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

const cardTypographyFields = (
  name: string,
  label: string,
  defaults: {
    fontFamily: string
    fontSize: number
    fontWeight: string
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
          name: 'family',
          type: 'select',
          admin: {
            width: '25%',
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
            width: '25%',
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
            width: '25%',
          },
          defaultValue: defaults.fontWeight,
          label: 'Font weight',
          options: [...typographyFontWeightOptions],
        },
        {
          name: 'verticalScale',
          type: 'select',
          admin: {
            width: '25%',
          },
          defaultValue: defaults.verticalScale,
          label: 'Height stretch',
          options: [...typographyVerticalScaleOptions],
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
      type: 'collapsible',
      label: 'Heading',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'heading',
          type: 'text',
          label: 'Heading text',
        },
        {
          name: 'headingBannerImage',
          type: 'upload',
          label: 'Heading banner image',
          relationTo: 'media',
        },
        {
          name: 'headingPaddingX',
          type: 'number',
          defaultValue: 34,
          label: 'Heading horizontal padding (px)',
          min: 0,
          max: 240,
          admin: {
            step: 1,
          },
        },
        {
          name: 'headingPaddingY',
          type: 'number',
          defaultValue: 8,
          label: 'Heading vertical padding (px)',
          min: 0,
          max: 120,
          admin: {
            step: 1,
          },
        },
        textStyleFields('headingStyle', 'Heading typography', {
          color: '#1b1b1b',
          fontFamily: 'cinzel',
          fontSizeDesktop: 22,
          fontSizeMobile: 16,
          fontStyle: 'normal',
          fontWeight: 'black',
          letterSpacing: 'wide',
          lineHeight: 1,
          textTransform: 'uppercase',
          verticalScale: 'normal',
        }),
      ],
    },
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
          admin: {
            description: 'Puoi usare variabili CMS, per esempio {{quota_annuale}}.',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description',
          admin: {
            description: 'Puoi usare variabili CMS, per esempio {{quota_annuale}}.',
          },
        },
        {
          type: 'collapsible',
          label: 'Collegamento nella descrizione',
          admin: {
            initCollapsed: true,
          },
          fields: [
            {
              name: 'descriptionLinkText',
              type: 'text',
              label: 'Testo cliccabile',
              admin: {
                description:
                  'Scrivi una parola o una frase presente nella descrizione. Verrà collegata la prima occorrenza.',
              },
            },
            {
              name: 'descriptionLinkType',
              type: 'select',
              label: 'Applicazione',
              options: [
                {
                  label: 'WhatsApp',
                  value: 'whatsapp',
                },
                {
                  label: 'Email',
                  value: 'email',
                },
                {
                  label: 'Telefono',
                  value: 'phone',
                },
              ],
              admin: {
                condition: (_, siblingData) => Boolean(siblingData?.descriptionLinkText),
              },
            },
            {
              name: 'descriptionLinkValue',
              type: 'text',
              label: 'Recapito',
              admin: {
                condition: (_, siblingData) => Boolean(siblingData?.descriptionLinkType),
                description:
                  'Per WhatsApp e Telefono inserisci il numero completo di prefisso internazionale; per Email inserisci l’indirizzo email.',
              },
            },
          ],
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
              verticalScale: 'normal',
            }),
            cardTypographyFields('descType', 'Description typography', {
              fontFamily: 'geistSans',
              fontSize: 12,
              fontWeight: 'regular',
              verticalScale: 'normal',
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
      name: 'cardGap',
      type: 'select',
      dbName: 'gap',
      defaultValue: 'none',
      label: 'Space between cards',
      options: [...tornCardSpacingOptions],
      admin: {
        description:
          'Default keeps cards joined. When spacing is enabled, each card gets its own vintage surface and border.',
      },
    },
    {
      name: 'containerWidth',
      type: 'select',
      defaultValue: 'wide',
      label: 'Width',
      options: [
        {
          label: 'Full width',
          value: 'full',
        },
        {
          label: 'Container',
          value: 'container',
        },
        {
          label: 'Wide',
          value: 'wide',
        },
        {
          label: 'Extra wide',
          value: 'extraWide',
        },
      ],
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
              name: 'titleColorMode',
              type: 'radio',
              defaultValue: 'custom',
              label: 'Title color mode',
              options: [
                {
                  label: 'Custom color',
                  value: 'custom',
                },
                {
                  label: 'Theme color',
                  value: 'theme',
                },
              ],
              admin: {
                layout: 'horizontal',
                width: '50%',
              },
            },
            {
              name: 'titleThemeColor',
              type: 'select',
              defaultValue: 'secondary',
              label: 'Theme title color',
              options: [...themeColorOptions],
              admin: {
                condition: (_, siblingData) => siblingData?.titleColorMode === 'theme',
                width: '50%',
              },
            },
            {
              name: 'titleColor',
              type: 'text',
              admin: {
                condition: (_, siblingData) => siblingData?.titleColorMode !== 'theme',
                description: 'Custom CSS color, for example #e8d5a0.',
                width: '50%',
              },
              defaultValue: '#e8d5a0',
              label: 'Custom title color',
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'textColorMode',
              type: 'radio',
              defaultValue: 'custom',
              label: 'Text color mode',
              options: [
                {
                  label: 'Custom color',
                  value: 'custom',
                },
                {
                  label: 'Theme color',
                  value: 'theme',
                },
              ],
              admin: {
                layout: 'horizontal',
                width: '50%',
              },
            },
            {
              name: 'textThemeColor',
              type: 'select',
              defaultValue: 'primary',
              label: 'Theme text color',
              options: [...themeColorOptions],
              admin: {
                condition: (_, siblingData) => siblingData?.textColorMode === 'theme',
                width: '50%',
              },
            },
            {
              name: 'textColor',
              type: 'text',
              admin: {
                condition: (_, siblingData) => siblingData?.textColorMode !== 'theme',
                description: 'Custom CSS color, for example #d9d0c2.',
                width: '50%',
              },
              defaultValue: '#d9d0c2',
              label: 'Custom text color',
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
