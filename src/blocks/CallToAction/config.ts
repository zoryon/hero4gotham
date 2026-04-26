import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import {
  typographyFontFamilyOptions,
  typographyFontWeightOptions,
  typographyLetterSpacingOptions,
  typographyVerticalScaleOptions,
} from '@/fields/typography'
import { linkGroup } from '../../fields/linkGroup'
import { colorOptions, paddingOptions, textTransformOptions } from '@/fields/uiOptions'

export const CallToAction: Block = {
  slug: 'cta',
  interfaceName: 'CallToActionBlock',
  fields: [
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: false,
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      label: 'Background image',
      relationTo: 'media',
    },
    {
      name: 'borderStyle',
      type: 'select',
      defaultValue: 'default',
      label: 'Border',
      options: [
        {
          label: 'Default',
          value: 'default',
        },
        {
          label: 'None',
          value: 'none',
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
          name: 'colors',
          type: 'group',
          label: false,
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'textColor',
                  type: 'select',
                  defaultValue: 'default',
                  label: 'Text color',
                  options: [...colorOptions],
                  admin: {
                    width: '50%',
                  },
                },
                {
                  name: 'buttonTextColor',
                  type: 'select',
                  defaultValue: 'default',
                  label: 'Button text color',
                  options: [...colorOptions],
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
    {
      type: 'collapsible',
      label: 'Spacing',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'spacing',
          type: 'group',
          label: false,
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'gap',
                  type: 'select',
                  dbName: 'gap',
                  defaultValue: 'md',
                  label: 'Content/actions gap',
                  options: [...paddingOptions],
                  admin: {
                    width: '50%',
                  },
                },
                {
                  name: 'actionsGap',
                  type: 'select',
                  dbName: 'agap',
                  defaultValue: 'md',
                  label: 'Button gap',
                  options: [...paddingOptions],
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
                  name: 'paddingTop',
                  type: 'select',
                  dbName: 'pt',
                  defaultValue: 'sm',
                  label: 'Padding top',
                  options: [...paddingOptions],
                  admin: {
                    width: '25%',
                  },
                },
                {
                  name: 'paddingRight',
                  type: 'select',
                  dbName: 'pr',
                  defaultValue: 'sm',
                  label: 'Padding right',
                  options: [...paddingOptions],
                  admin: {
                    width: '25%',
                  },
                },
                {
                  name: 'paddingBottom',
                  type: 'select',
                  dbName: 'pb',
                  defaultValue: 'sm',
                  label: 'Padding bottom',
                  options: [...paddingOptions],
                  admin: {
                    width: '25%',
                  },
                },
                {
                  name: 'paddingLeft',
                  type: 'select',
                  dbName: 'pl',
                  defaultValue: 'sm',
                  label: 'Padding left',
                  options: [...paddingOptions],
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
                  name: 'marginTop',
                  type: 'select',
                  dbName: 'mt',
                  defaultValue: 'none',
                  label: 'Margin top',
                  options: [...paddingOptions],
                  admin: {
                    width: '25%',
                  },
                },
                {
                  name: 'marginRight',
                  type: 'select',
                  dbName: 'mr',
                  defaultValue: 'none',
                  label: 'Margin right',
                  options: [...paddingOptions],
                  admin: {
                    width: '25%',
                  },
                },
                {
                  name: 'marginBottom',
                  type: 'select',
                  dbName: 'mb',
                  defaultValue: 'none',
                  label: 'Margin bottom',
                  options: [...paddingOptions],
                  admin: {
                    width: '25%',
                  },
                },
                {
                  name: 'marginLeft',
                  type: 'select',
                  dbName: 'ml',
                  defaultValue: 'none',
                  label: 'Margin left',
                  options: [...paddingOptions],
                  admin: {
                    width: '25%',
                  },
                },
              ],
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
        {
          name: 'typography',
          type: 'group',
          label: false,
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'fontSize',
                  type: 'select',
                  defaultValue: 'base',
                  label: 'Font size',
                  options: [
                    {
                      label: 'Small',
                      value: 'small',
                    },
                    {
                      label: 'Normal',
                      value: 'base',
                    },
                    {
                      label: 'Large',
                      value: 'large',
                    },
                    {
                      label: 'Lead',
                      value: 'lead',
                    },
                  ],
                  admin: {
                    width: '50%',
                  },
                },
                {
                  name: 'fontWeight',
                  type: 'select',
                  defaultValue: 'regular',
                  label: 'Font weight',
                  options: [...typographyFontWeightOptions],
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
                  name: 'fontFamily',
                  type: 'select',
                  defaultValue: 'geistSans',
                  label: 'Font family',
                  options: [...typographyFontFamilyOptions],
                  admin: {
                    width: '50%',
                  },
                },
                {
                  name: 'verticalScale',
                  type: 'select',
                  defaultValue: 'normal',
                  label: 'Text height stretch',
                  options: [...typographyVerticalScaleOptions],
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
                  name: 'letterSpacing',
                  type: 'select',
                  defaultValue: 'normal',
                  label: 'Letter spacing',
                  options: [...typographyLetterSpacingOptions],
                  admin: {
                    width: '50%',
                  },
                },
                {
                  name: 'buttonVerticalScale',
                  type: 'select',
                  defaultValue: 'normal',
                  label: 'Button text height stretch',
                  options: [...typographyVerticalScaleOptions],
                  admin: {
                    width: '50%',
                  },
                },
              ],
            },
            {
              name: 'textTransform',
              type: 'select',
              defaultValue: 'normal',
              label: 'Text transform',
              options: [...textTransformOptions],
            },
          ],
        },
      ],
    },
    linkGroup({
      appearances: ['default', 'outline'],
      overrides: {
        maxRows: 2,
      },
    }),
  ],
  labels: {
    plural: 'Calls to Action',
    singular: 'Call to Action',
  },
}
