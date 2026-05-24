import type { Block, Field } from 'payload'

import { link } from '@/fields/link'
import {
  typographyFontFamilyOptions,
  typographyFontWeightOptions,
  typographyLetterSpacingOptions,
  typographyVerticalScaleOptions,
} from '@/fields/typography'
import { textTransformOptions } from '@/fields/uiOptions'

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
  prefix: 'body' | 'button' | 'title',
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
  type: 'collapsible',
  label,
  admin: {
    initCollapsed: true,
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: `${prefix}FontFamily`,
          type: 'select',
          dbName: `${prefix}_ff`,
          defaultValue: defaults.fontFamily,
          label: 'Font family',
          options: [...typographyFontFamilyOptions],
          admin: {
            width: '25%',
          },
        },
        {
          name: `${prefix}FontWeight`,
          type: 'select',
          dbName: `${prefix}_fw`,
          defaultValue: defaults.fontWeight,
          label: 'Font weight',
          options: [...typographyFontWeightOptions],
          admin: {
            width: '25%',
          },
        },
        {
          name: `${prefix}FontStyle`,
          type: 'select',
          dbName: `${prefix}_fst`,
          defaultValue: defaults.fontStyle,
          label: 'Font style',
          options: [...fontStyleOptions],
          admin: {
            width: '25%',
          },
        },
        {
          name: `${prefix}VerticalScale`,
          type: 'select',
          dbName: `${prefix}_vs`,
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
          name: `${prefix}FontSizeMobile`,
          type: 'number',
          defaultValue: defaults.fontSizeMobile,
          label: 'Mobile size (px)',
          min: 8,
          max: 96,
          admin: {
            step: 1,
            width: '25%',
          },
        },
        {
          name: `${prefix}FontSizeDesktop`,
          type: 'number',
          defaultValue: defaults.fontSizeDesktop,
          label: 'Desktop size (px)',
          min: 8,
          max: 110,
          admin: {
            step: 1,
            width: '25%',
          },
        },
        {
          name: `${prefix}LineHeight`,
          type: 'number',
          defaultValue: defaults.lineHeight,
          label: 'Line height',
          min: 0.75,
          max: 2,
          admin: {
            step: 0.01,
            width: '25%',
          },
        },
        {
          name: `${prefix}LetterSpacing`,
          type: 'select',
          dbName: `${prefix}_ls`,
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
          name: `${prefix}TextTransform`,
          type: 'select',
          dbName: `${prefix}_tt`,
          defaultValue: defaults.textTransform,
          label: 'Text transform',
          options: [...textTransformOptions],
          admin: {
            width: '50%',
          },
        },
        {
          name: `${prefix}Color`,
          type: 'text',
          defaultValue: defaults.color,
          label: 'Text color',
          admin: {
            description: 'Colore CSS, per esempio #a6bd17 o rgb(255 255 255 / 0.8).',
            width: '50%',
          },
        },
      ],
    },
  ],
})

export const EventProposalCta: Block = {
  slug: 'eventProposalCta',
  dbName: 'event_prop_cta',
  interfaceName: 'EventProposalCtaBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      defaultValue: 'PROPONI UN EVENTO',
      required: true,
    },
    {
      name: 'body',
      type: 'textarea',
      defaultValue:
        "Hai un'idea fuori dagli schemi?\nProponi il tuo evento e diventa parte del caos creativo.",
      required: true,
    },
    link({
      appearances: false,
      overrides: {
        name: 'ctaLink',
        label: 'CTA link',
        defaultValue: {
          label: 'INVIA LA TUA PROPOSTA',
          type: 'custom',
          url: '#',
        },
      },
    }),
    {
      name: 'ctaFallbackLabel',
      type: 'text',
      defaultValue: 'INVIA LA TUA PROPOSTA',
      label: 'CTA fallback label',
      required: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'iconImage',
          type: 'upload',
          label: 'Icon image',
          relationTo: 'media',
          admin: {
            width: '50%',
          },
        },
        {
          name: 'buttonBackgroundImage',
          type: 'upload',
          label: 'Button background image',
          relationTo: 'media',
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Colors',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'buttonBackgroundColor',
              type: 'text',
              defaultValue: 'rgb(99 29 94 / 0.58)',
              label: 'CTA button background',
              admin: {
                width: '100%',
              },
            },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Layout',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'maxWidth',
              type: 'number',
              defaultValue: 560,
              label: 'Max width (px)',
              min: 260,
              max: 1400,
              admin: {
                step: 1,
                width: '25%',
              },
            },
            {
              name: 'minHeightDesktop',
              type: 'number',
              defaultValue: 150,
              label: 'Desktop height (px)',
              min: 96,
              max: 420,
              admin: {
                step: 1,
                width: '25%',
              },
            },
            {
              name: 'minHeightMobile',
              type: 'number',
              defaultValue: 230,
              label: 'Mobile height (px)',
              min: 132,
              max: 520,
              admin: {
                step: 1,
                width: '25%',
              },
            },
            {
              name: 'contentGap',
              type: 'number',
              defaultValue: 12,
              label: 'Content gap (px)',
              min: 0,
              max: 80,
              admin: {
                step: 1,
                width: '25%',
              },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'paddingX',
              type: 'number',
              defaultValue: 20,
              label: 'Horizontal padding (px)',
              min: 0,
              max: 120,
              admin: {
                step: 1,
                width: '25%',
              },
            },
            {
              name: 'paddingY',
              type: 'number',
              defaultValue: 16,
              label: 'Vertical padding (px)',
              min: 0,
              max: 120,
              admin: {
                step: 1,
                width: '25%',
              },
            },
            {
              name: 'iconSizeDesktop',
              type: 'number',
              defaultValue: 56,
              label: 'Desktop icon size (px)',
              min: 0,
              max: 220,
              admin: {
                step: 1,
                width: '25%',
              },
            },
            {
              name: 'iconSizeMobile',
              type: 'number',
              defaultValue: 48,
              label: 'Mobile icon size (px)',
              min: 0,
              max: 180,
              admin: {
                step: 1,
                width: '25%',
              },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'buttonHeight',
              type: 'number',
              defaultValue: 42,
              label: 'Button height (px)',
              min: 28,
              max: 120,
              admin: {
                step: 1,
                width: '25%',
              },
            },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Typography',
      admin: {
        initCollapsed: true,
      },
      fields: [
        textStyleFields('title', 'Title typography', {
          color: '#a6bd17',
          fontFamily: 'rye',
          fontSizeDesktop: 24,
          fontSizeMobile: 22,
          fontStyle: 'normal',
          fontWeight: 'regular',
          letterSpacing: 'normal',
          lineHeight: 1,
          textTransform: 'uppercase',
          verticalScale: 'normal',
        }),
        textStyleFields('body', 'Body typography', {
          color: '#f1ecdf',
          fontFamily: 'geistSans',
          fontSizeDesktop: 15,
          fontSizeMobile: 14,
          fontStyle: 'normal',
          fontWeight: 'semibold',
          letterSpacing: 'tight',
          lineHeight: 1.24,
          textTransform: 'normal',
          verticalScale: 'normal',
        }),
        textStyleFields('button', 'Button typography', {
          color: '#f1d5f5',
          fontFamily: 'rye',
          fontSizeDesktop: 19,
          fontSizeMobile: 17,
          fontStyle: 'normal',
          fontWeight: 'regular',
          letterSpacing: 'tight',
          lineHeight: 1,
          textTransform: 'uppercase',
          verticalScale: 'normal',
        }),
      ],
    },
  ],
  labels: {
    plural: 'Event Proposal CTAs',
    singular: 'Event Proposal CTA',
  },
}
