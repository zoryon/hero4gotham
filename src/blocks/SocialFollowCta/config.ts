import type { Block, Field } from 'payload'

import { link } from '@/fields/link'
import {
  typographyFontFamilyOptions,
  typographyFontWeightOptions,
  typographyLetterSpacingOptions,
  typographyVerticalScaleOptions,
} from '@/fields/typography'
import { textTransformOptions } from '@/fields/uiOptions'

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
          max: 120,
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
          max: 140,
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
            width: '50%',
          },
        },
        {
          name: 'color',
          type: 'text',
          defaultValue: defaults.color,
          label: 'Text color',
          admin: {
            description: 'CSS color, for example #a6bd17 or rgb(255 255 255 / 0.8).',
            width: '50%',
          },
        },
      ],
    },
  ],
})

export const SocialFollowCta: Block = {
  slug: 'socialFollowCta',
  interfaceName: 'SocialFollowCtaBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      defaultValue: 'SEGUICI O VIENI A TROVARCI',
      required: true,
    },
    {
      name: 'body',
      type: 'textarea',
      defaultValue:
        'Resta aggiornato su eventi, attivita e novita\ndel nostro mondo. Ti aspettiamo!',
      required: true,
    },
    {
      name: 'socialItems',
      type: 'array',
      defaultValue: [
        {
          label: 'Facebook',
          platform: 'facebook',
          url: '#',
        },
        {
          label: 'Instagram',
          platform: 'instagram',
          url: '#',
        },
        {
          label: 'Email',
          platform: 'email',
          url: 'info@example.com',
        },
      ],
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'platform',
              type: 'select',
              defaultValue: 'facebook',
              label: 'Platform',
              options: [
                {
                  label: 'Facebook',
                  value: 'facebook',
                },
                {
                  label: 'Instagram',
                  value: 'instagram',
                },
                {
                  label: 'Email',
                  value: 'email',
                },
                {
                  label: 'Custom',
                  value: 'custom',
                },
              ],
              required: true,
              admin: {
                width: '25%',
              },
            },
            {
              name: 'label',
              type: 'text',
              defaultValue: 'Social',
              required: true,
              admin: {
                width: '25%',
              },
            },
            {
              name: 'url',
              type: 'text',
              defaultValue: '#',
              required: true,
              admin: {
                width: '35%',
              },
            },
            {
              name: 'newTab',
              type: 'checkbox',
              defaultValue: true,
              label: 'Open in new tab',
              admin: {
                width: '15%',
              },
            },
          ],
        },
      ],
      labels: {
        plural: 'Social links',
        singular: 'Social link',
      },
      minRows: 1,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'primaryLabel',
          type: 'text',
          defaultValue: 'DIVENTA SOCIO',
          label: 'Primary CTA label',
          required: true,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'secondaryLabel',
          type: 'text',
          defaultValue: 'SCOPRI LE ATTIVITA',
          label: 'Secondary CTA label',
          required: true,
          admin: {
            width: '50%',
          },
        },
      ],
    },
    link({
      appearances: false,
      disableLabel: true,
      overrides: {
        name: 'primaryLink',
        label: 'Primary CTA link',
        defaultValue: {
          type: 'custom',
          url: '#',
        },
      },
    }),
    link({
      appearances: false,
      disableLabel: true,
      overrides: {
        name: 'secondaryLink',
        label: 'Secondary CTA link',
        defaultValue: {
          type: 'custom',
          url: '#',
        },
      },
    }),
    {
      type: 'row',
      fields: [
        {
          name: 'primaryBackgroundImage',
          type: 'upload',
          label: 'Primary CTA background image',
          relationTo: 'media',
          admin: {
            width: '50%',
          },
        },
        {
          name: 'primaryBackgroundColor',
          type: 'text',
          defaultValue: '#9fbd18',
          label: 'Primary CTA fallback background',
          admin: {
            width: '25%',
          },
        },
        {
          name: 'secondaryColor',
          type: 'text',
          defaultValue: '#9b2da0',
          label: 'Secondary CTA color',
          admin: {
            width: '25%',
          },
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
        textStyleFields('titleStyle', 'Title typography', {
          color: '#a6bd17',
          fontFamily: 'rye',
          fontSizeDesktop: 15,
          fontSizeMobile: 18,
          fontStyle: 'normal',
          fontWeight: 'regular',
          letterSpacing: 'normal',
          lineHeight: 1,
          textTransform: 'uppercase',
          verticalScale: 'normal',
        }),
        textStyleFields('bodyStyle', 'Body typography', {
          color: '#f4f0dc',
          fontFamily: 'geistSans',
          fontSizeDesktop: 10,
          fontSizeMobile: 13,
          fontStyle: 'normal',
          fontWeight: 'regular',
          letterSpacing: 'tight',
          lineHeight: 1.28,
          textTransform: 'normal',
          verticalScale: 'normal',
        }),
        textStyleFields('primaryStyle', 'Primary CTA typography', {
          color: '#182007',
          fontFamily: 'rye',
          fontSizeDesktop: 10,
          fontSizeMobile: 12,
          fontStyle: 'normal',
          fontWeight: 'regular',
          letterSpacing: 'tight',
          lineHeight: 1,
          textTransform: 'uppercase',
          verticalScale: 'normal',
        }),
        textStyleFields('secondaryStyle', 'Secondary CTA typography', {
          color: '#9b2da0',
          fontFamily: 'cinzel',
          fontSizeDesktop: 11,
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
              name: 'heightMobile',
              type: 'number',
              defaultValue: 170,
              label: 'Mobile height (px)',
              min: 80,
              max: 420,
              admin: {
                step: 1,
                width: '25%',
              },
            },
            {
              name: 'heightDesktop',
              type: 'number',
              defaultValue: 80,
              label: 'Desktop height (px)',
              min: 54,
              max: 220,
              admin: {
                step: 1,
                width: '25%',
              },
            },
            {
              name: 'contentMaxWidth',
              type: 'number',
              defaultValue: 1180,
              label: 'Content max width (px)',
              min: 320,
              max: 1800,
              admin: {
                step: 1,
                width: '25%',
              },
            },
            {
              name: 'paddingX',
              type: 'number',
              defaultValue: 36,
              label: 'Horizontal padding (px)',
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
              name: 'paddingY',
              type: 'number',
              defaultValue: 12,
              label: 'Vertical padding (px)',
              min: 0,
              max: 120,
              admin: {
                step: 1,
                width: '20%',
              },
            },
            {
              name: 'accentColor',
              type: 'text',
              defaultValue: '#9fbd18',
              label: 'Accent color',
              admin: {
                width: '20%',
              },
            },
            {
              name: 'dividerColor',
              type: 'text',
              defaultValue: 'rgb(159 189 24 / 0.68)',
              label: 'Divider color',
              admin: {
                width: '20%',
              },
            },
            {
              name: 'iconSize',
              type: 'number',
              defaultValue: 39,
              label: 'Icon size (px)',
              min: 24,
              max: 72,
              admin: {
                step: 1,
                width: '20%',
              },
            },
            {
              name: 'dividerHeight',
              type: 'number',
              defaultValue: 52,
              label: 'Divider height (px)',
              min: 20,
              max: 160,
              admin: {
                step: 1,
                width: '20%',
              },
            },
          ],
        },
      ],
    },
  ],
  labels: {
    plural: 'Social Follow CTAs',
    singular: 'Social Follow CTA',
  },
}
