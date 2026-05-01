import type { Block, Field } from 'payload'

import {
  typographyFontFamilyOptions,
  typographyFontWeightOptions,
  typographyLetterSpacingOptions,
  typographyVerticalScaleOptions,
} from '@/fields/typography'
import { textAlignOptions, textTransformOptions } from '@/fields/uiOptions'

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
            description: 'CSS color, for example #2f1631, white, or rgba(0,0,0,0.8).',
            width: '34%',
          },
        },
        {
          name: 'align',
          type: 'select',
          defaultValue: 'center',
          label: 'Text align',
          options: [...textAlignOptions],
          admin: {
            width: '33%',
          },
        },
      ],
    },
  ],
})

export const QuoteBanner: Block = {
  slug: 'quoteBanner',
  interfaceName: 'QuoteBannerBlock',
  fields: [
    {
      name: 'backgroundImage',
      type: 'upload',
      label: 'Background image',
      relationTo: 'media',
    },
    {
      name: 'quote',
      type: 'textarea',
      defaultValue:
        "Crediamo nell'arte come atto di liberta, nel gioco come forma di conoscenza, nella diversita come ricchezza, e nella comunita come forza creativa.",
      required: true,
    },
    {
      name: 'showQuotes',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show quote marks',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'leftQuote',
          type: 'text',
          defaultValue: '\u201C',
          label: 'Left quote mark',
          admin: {
            width: '50%',
          },
        },
        {
          name: 'rightQuote',
          type: 'text',
          defaultValue: '\u201D',
          label: 'Right quote mark',
          admin: {
            width: '50%',
          },
        },
      ],
    },
    textStyleFields('textStyle', 'Quote typography', {
      color: '#2f1631',
      fontFamily: 'cinzel',
      fontSizeDesktop: 18,
      fontSizeMobile: 16,
      fontStyle: 'normal',
      fontWeight: 'black',
      letterSpacing: 'normal',
      lineHeight: 1.22,
      textTransform: 'normal',
      verticalScale: 'normal',
    }),
    textStyleFields('quoteMarkStyle', 'Quote mark typography', {
      color: '#7b2d83',
      fontFamily: 'cinzel',
      fontSizeDesktop: 42,
      fontSizeMobile: 34,
      fontStyle: 'normal',
      fontWeight: 'black',
      letterSpacing: 'tight',
      lineHeight: 1,
      textTransform: 'normal',
      verticalScale: 'normal',
    }),
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
              defaultValue: 72,
              label: 'Mobile height (px)',
              min: 40,
              max: 500,
              admin: {
                step: 1,
                width: '25%',
              },
            },
            {
              name: 'heightDesktop',
              type: 'number',
              defaultValue: 66,
              label: 'Desktop height (px)',
              min: 40,
              max: 500,
              admin: {
                step: 1,
                width: '25%',
              },
            },
            {
              name: 'contentMaxWidth',
              type: 'number',
              defaultValue: 980,
              label: 'Content max width (px)',
              min: 240,
              max: 1800,
              admin: {
                step: 1,
                width: '25%',
              },
            },
            {
              name: 'quoteGap',
              type: 'number',
              defaultValue: 18,
              label: 'Quote gap (px)',
              min: 0,
              max: 240,
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
              defaultValue: 72,
              label: 'Horizontal padding (px)',
              min: 0,
              max: 240,
              admin: {
                step: 1,
                width: '33%',
              },
            },
            {
              name: 'paddingY',
              type: 'number',
              defaultValue: 8,
              label: 'Vertical padding (px)',
              min: 0,
              max: 160,
              admin: {
                step: 1,
                width: '33%',
              },
            },
            {
              name: 'quoteOffsetY',
              type: 'number',
              defaultValue: 0,
              label: 'Quote vertical offset (px)',
              min: -120,
              max: 120,
              admin: {
                step: 1,
                width: '34%',
              },
            },
          ],
        },
      ],
    },
  ],
  labels: {
    plural: 'Quote Banners',
    singular: 'Quote Banner',
  },
}
