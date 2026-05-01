import type { Block, Field } from 'payload'

import { linkGroup } from '@/fields/linkGroup'
import {
  typographyFontFamilyOptions,
  typographyFontWeightOptions,
  typographyLetterSpacingOptions,
  typographyVerticalScaleOptions,
} from '@/fields/typography'
import { textTransformOptions } from '@/fields/uiOptions'

const imageField = (name: string, label: string): Field => ({
  name,
  type: 'upload',
  label,
  relationTo: 'media',
})

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
          max: 2,
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
            description: 'CSS color, for example #a6bd17, white, or rgba(255,255,255,0.85).',
            width: '50%',
          },
        },
      ],
    },
  ],
})

const objectPositionOptions = [
  {
    label: 'Center',
    value: 'center',
  },
  {
    label: 'Top',
    value: 'top',
  },
  {
    label: 'Bottom',
    value: 'bottom',
  },
  {
    label: 'Left',
    value: 'left',
  },
  {
    label: 'Right',
    value: 'right',
  },
] as const

export const ActivityChoiceCta: Block = {
  slug: 'activityChoiceCta',
  interfaceName: 'ActivityChoiceCtaBlock',
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Images',
          fields: [
            {
              type: 'row',
              fields: [
                imageField('leftImage', 'Left image'),
                imageField('rightImage', 'Right image'),
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'leftImagePosition',
                  type: 'select',
                  defaultValue: 'center',
                  label: 'Left image position',
                  options: [...objectPositionOptions],
                  admin: {
                    width: '50%',
                  },
                },
                {
                  name: 'rightImagePosition',
                  type: 'select',
                  defaultValue: 'center',
                  label: 'Right image position',
                  options: [...objectPositionOptions],
                  admin: {
                    width: '50%',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Text',
          fields: [
            {
              name: 'topText',
              type: 'text',
              defaultValue: 'Scegli la tua attivita.',
              required: true,
            },
            {
              name: 'bottomText',
              type: 'text',
              defaultValue: 'Vivi il caos.',
              required: true,
            },
            {
              name: 'accentText',
              type: 'text',
              defaultValue: 'Crea meraviglia.',
              required: true,
            },
            textStyleFields('topTextStyle', 'Top text typography', {
              color: '#f4f0dc',
              fontFamily: 'rye',
              fontSizeDesktop: 30,
              fontSizeMobile: 26,
              fontStyle: 'normal',
              fontWeight: 'regular',
              letterSpacing: 'normal',
              lineHeight: 0.95,
              textTransform: 'uppercase',
              verticalScale: 'tall',
            }),
            textStyleFields('bottomTextStyle', 'Bottom text typography', {
              color: '#f4f0dc',
              fontFamily: 'rye',
              fontSizeDesktop: 30,
              fontSizeMobile: 26,
              fontStyle: 'normal',
              fontWeight: 'regular',
              letterSpacing: 'normal',
              lineHeight: 0.95,
              textTransform: 'uppercase',
              verticalScale: 'tall',
            }),
            textStyleFields('accentTextStyle', 'Accent text typography', {
              color: '#a6bd17',
              fontFamily: 'rye',
              fontSizeDesktop: 30,
              fontSizeMobile: 26,
              fontStyle: 'normal',
              fontWeight: 'regular',
              letterSpacing: 'normal',
              lineHeight: 0.95,
              textTransform: 'uppercase',
              verticalScale: 'tall',
            }),
          ],
        },
        {
          label: 'CTA',
          fields: [
            {
              name: 'ctaBackgroundImage',
              type: 'upload',
              label: 'CTA background image',
              relationTo: 'media',
            },
            textStyleFields('ctaTextStyle', 'CTA typography', {
              color: '#17200c',
              fontFamily: 'rye',
              fontSizeDesktop: 16,
              fontSizeMobile: 14,
              fontStyle: 'normal',
              fontWeight: 'regular',
              letterSpacing: 'tight',
              lineHeight: 1,
              textTransform: 'uppercase',
              verticalScale: 'normal',
            }),
            linkGroup({
              appearances: false,
              overrides: {
                maxRows: 1,
              },
            }),
          ],
        },
        {
          label: 'Layout',
          fields: [
            {
              name: 'heightDesktop',
              type: 'number',
              defaultValue: 160,
              label: 'Desktop height (px)',
              min: 100,
              max: 420,
              admin: {
                step: 1,
              },
            },
            {
              name: 'heightTablet',
              type: 'number',
              defaultValue: 132,
              label: 'Tablet height (px)',
              min: 90,
              max: 360,
              admin: {
                step: 1,
              },
            },
            {
              name: 'mobileImageHeight',
              type: 'number',
              defaultValue: 150,
              label: 'Mobile image height (px)',
              min: 80,
              max: 320,
              admin: {
                step: 1,
              },
            },
          ],
        },
      ],
    },
  ],
  labels: {
    plural: 'Activity Choice CTAs',
    singular: 'Activity Choice CTA',
  },
}
