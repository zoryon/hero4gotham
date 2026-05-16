import type { Block, Field } from 'payload'

import {
  typographyFontFamilyOptions,
  typographyFontWeightOptions,
  typographyLetterSpacingOptions,
  typographyVerticalScaleOptions,
} from '@/fields/typography'
import { textTransformOptions } from '@/fields/uiOptions'

const textStyleField = (
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
          max: 96,
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
          max: 120,
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
            description: 'CSS color, for example #93b51f or rgba(255,255,255,0.78).',
            width: '50%',
          },
        },
      ],
    },
  ],
})

export const ProcessSteps: Block = {
  slug: 'processSteps',
  interfaceName: 'ProcessStepsBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'In pochi passi, dentro il caos',
      label: 'Heading',
    },
    textStyleField('headingStyle', 'Heading typography', {
      color: '#93b51f',
      fontFamily: 'rye',
      fontSizeDesktop: 22,
      fontSizeMobile: 18,
      fontStyle: 'normal',
      fontWeight: 'regular',
      letterSpacing: 'normal',
      lineHeight: 1,
      textTransform: 'uppercase',
      verticalScale: 'tall',
    }),
    {
      name: 'steps',
      type: 'array',
      label: 'Steps',
      labels: {
        plural: 'Steps',
        singular: 'Step',
      },
      minRows: 1,
      defaultValue: [
        {
          description: 'Inserisci i tuoi dati e raccontaci chi sei.',
          numberLabel: '1',
          title: 'Compila la domanda',
        },
        {
          description: 'Il nostro team esaminera la tua richiesta e ti rispondera al piu presto.',
          numberLabel: '2',
          title: 'Ti ricontattiamo',
        },
        {
          description: 'Partecipa alle attivita e scopri i progetti in corso.',
          numberLabel: '3',
          title: "Conosci l'associazione",
        },
        {
          description: 'Diventa socio e vivi il caos con noi.',
          numberLabel: '4',
          title: 'Entra nella community',
        },
      ],
      fields: [
        {
          name: 'icon',
          type: 'upload',
          label: 'Circle icon image',
          relationTo: 'media',
        },
        {
          type: 'row',
          fields: [
            {
              name: 'numberLabel',
              type: 'text',
              defaultValue: '1',
              label: 'Number label',
              required: true,
              admin: {
                width: '25%',
              },
            },
            {
              name: 'title',
              type: 'text',
              defaultValue: 'Step title',
              label: 'Title',
              required: true,
              admin: {
                width: '75%',
              },
            },
          ],
        },
        {
          name: 'description',
          type: 'textarea',
          defaultValue: 'Step description.',
          label: 'Description',
        },
      ],
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Step Typography',
          fields: [
            textStyleField('stepTitleStyle', 'Step title typography', {
              color: '#93b51f',
              fontFamily: 'rye',
              fontSizeDesktop: 16,
              fontSizeMobile: 14,
              fontStyle: 'normal',
              fontWeight: 'regular',
              letterSpacing: 'tight',
              lineHeight: 1,
              textTransform: 'uppercase',
              verticalScale: 'tall',
            }),
            textStyleField('stepDescriptionStyle', 'Step description typography', {
              color: 'rgba(244,240,220,0.82)',
              fontFamily: 'geistSans',
              fontSizeDesktop: 13,
              fontSizeMobile: 12,
              fontStyle: 'normal',
              fontWeight: 'bold',
              letterSpacing: 'tight',
              lineHeight: 1.45,
              textTransform: 'normal',
              verticalScale: 'normal',
            }),
            textStyleField('numberStyle', 'Number typography', {
              color: '#171717',
              fontFamily: 'geistSans',
              fontSizeDesktop: 12,
              fontSizeMobile: 11,
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
          label: 'Layout',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'circleSize',
                  type: 'number',
                  defaultValue: 112,
                  label: 'Circle size (px)',
                  min: 72,
                  max: 180,
                  admin: {
                    step: 1,
                    width: '33.333%',
                  },
                },
                {
                  name: 'iconSize',
                  type: 'number',
                  defaultValue: 50,
                  label: 'Icon size (px)',
                  min: 24,
                  max: 120,
                  admin: {
                    step: 1,
                    width: '33.333%',
                  },
                },
                {
                  name: 'maxWidth',
                  type: 'number',
                  defaultValue: 1200,
                  label: 'Max width (px)',
                  min: 320,
                  max: 1800,
                  admin: {
                    step: 1,
                    width: '33.333%',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'circleBorderColor',
                  type: 'text',
                  defaultValue: '#8f2b83',
                  label: 'Circle border color',
                  admin: {
                    width: '50%',
                  },
                },
                {
                  name: 'arrowColor',
                  type: 'text',
                  defaultValue: '#93b51f',
                  label: 'Arrow color',
                  admin: {
                    width: '50%',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  labels: {
    plural: 'Process Steps',
    singular: 'Process Steps',
  },
}
