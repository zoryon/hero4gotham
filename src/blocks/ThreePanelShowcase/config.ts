import type { Block, Field } from 'payload'

import {
  typographyFontFamilyOptions,
  typographyFontWeightOptions,
  typographyLetterSpacingOptions,
  typographyVerticalScaleOptions,
} from '@/fields/typography'
import { textTransformOptions } from '@/fields/uiOptions'

const panelImageField = (name: string, label: string): Field => ({
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
            description: 'CSS color, for example #a6bd17, white, or rgba(255,255,255,0.85).',
            width: '34%',
          },
        },
        {
          name: 'maxWidth',
          type: 'number',
          defaultValue: 420,
          label: 'Max width (px)',
          min: 160,
          max: 1200,
          admin: {
            step: 1,
            width: '33%',
          },
        },
      ],
    },
  ],
})

export const ThreePanelShowcase: Block = {
  slug: 'threePanelShowcase',
  interfaceName: 'ThreePanelShowcaseBlock',
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Panels',
          fields: [
            {
              type: 'row',
              fields: [
                panelImageField('leftImage', 'Left background image'),
                panelImageField('centerImage', 'Center background image'),
                panelImageField('rightImage', 'Right background image'),
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'leftBorder',
                  type: 'checkbox',
                  defaultValue: false,
                  label: 'Left panel vintage border',
                  admin: {
                    width: '33%',
                  },
                },
                {
                  name: 'centerBorder',
                  type: 'checkbox',
                  defaultValue: false,
                  label: 'Center panel vintage border',
                  admin: {
                    width: '34%',
                  },
                },
                {
                  name: 'rightBorder',
                  type: 'checkbox',
                  defaultValue: false,
                  label: 'Right panel vintage border',
                  admin: {
                    width: '33%',
                  },
                },
              ],
            },
            {
              name: 'height',
              type: 'number',
              defaultValue: 380,
              label: 'Desktop height (px)',
              min: 180,
              max: 900,
              admin: {
                step: 1,
              },
            },
            {
              name: 'mobilePanelHeight',
              type: 'number',
              defaultValue: 260,
              label: 'Mobile image panel height (px)',
              min: 160,
              max: 720,
              admin: {
                step: 1,
              },
            },
          ],
        },
        {
          label: 'Center text',
          fields: [
            {
              name: 'title',
              type: 'text',
              defaultValue: 'Chi siamo',
              required: true,
            },
            {
              name: 'body',
              type: 'textarea',
              defaultValue:
                "Siamo un gruppo eterogeneo di artisti, designer, creativi, educatori, sognatori e instancabili organizzatori di caos.\n\nCi unisce la passione per la cultura e la convinzione che l'immaginazione sia uno strumento potentissimo per trasformare il mondo.",
              required: true,
            },
            textStyleFields('titleStyle', 'Title typography', {
              color: '#a6bd17',
              fontFamily: 'cinzel',
              fontSizeDesktop: 26,
              fontSizeMobile: 24,
              fontStyle: 'normal',
              fontWeight: 'black',
              letterSpacing: 'normal',
              lineHeight: 1,
              textTransform: 'uppercase',
              verticalScale: 'normal',
            }),
            textStyleFields('bodyStyle', 'Body typography', {
              color: '#f4f0dc',
              fontFamily: 'geistSans',
              fontSizeDesktop: 15,
              fontSizeMobile: 14,
              fontStyle: 'normal',
              fontWeight: 'regular',
              letterSpacing: 'tight',
              lineHeight: 1.45,
              textTransform: 'normal',
              verticalScale: 'normal',
            }),
          ],
        },
        {
          label: 'Layout',
          fields: [
            {
              name: 'containerWidth',
              type: 'select',
              defaultValue: 'full',
              label: 'Width',
              options: [
                {
                  label: 'Full width',
                  value: 'full',
                },
                {
                  label: 'Contained',
                  value: 'contained',
                },
                {
                  label: 'Wide',
                  value: 'wide',
                },
              ],
            },
            {
              name: 'leftColumn',
              type: 'number',
              defaultValue: 36,
              label: 'Left column (%)',
              min: 15,
              max: 70,
              admin: {
                step: 1,
              },
            },
            {
              name: 'centerColumn',
              type: 'number',
              defaultValue: 25,
              label: 'Center column (%)',
              min: 15,
              max: 70,
              admin: {
                step: 1,
              },
            },
            {
              name: 'contentPadding',
              type: 'number',
              defaultValue: 38,
              label: 'Center padding (px)',
              min: 0,
              max: 140,
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
    plural: 'Three Panel Showcases',
    singular: 'Three Panel Showcase',
  },
}
