import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '../../fields/linkGroup'
import {
  typographyFontFamilyOptions,
  typographyFontWeightOptions,
  typographyLetterSpacingOptions,
} from '@/fields/typography'

const spacingOptions = [
  {
    label: 'Nessuno',
    value: 'none',
  },
  {
    label: 'XS',
    value: 'xs',
  },
  {
    label: 'SM',
    value: 'sm',
  },
  {
    label: 'MD',
    value: 'md',
  },
  {
    label: 'LG',
    value: 'lg',
  },
  {
    label: 'XL',
    value: 'xl',
  },
] as const

const colorOptions = [
  {
    label: 'Default',
    value: 'default',
  },
  {
    label: 'Text primary',
    value: 'primary',
  },
  {
    label: 'Text secondary',
    value: 'secondary',
  },
  {
    label: 'Text muted',
    value: 'muted',
  },
  {
    label: 'Text accent',
    value: 'accent',
  },
  {
    label: 'Bianco',
    value: 'white',
  },
  {
    label: 'Nero',
    value: 'black',
  },
] as const

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
      label: 'Bordo',
      options: [
        {
          label: 'Default',
          value: 'default',
        },
        {
          label: 'Nessuno',
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
                  label: 'Colore testo',
                  options: [...colorOptions],
                  admin: {
                    width: '50%',
                  },
                },
                {
                  name: 'buttonTextColor',
                  type: 'select',
                  defaultValue: 'default',
                  label: 'Colore testo bottoni',
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
                  label: 'Gap contenuto/azioni',
                  options: [...spacingOptions],
                  admin: {
                    width: '50%',
                  },
                },
                {
                  name: 'actionsGap',
                  type: 'select',
                  dbName: 'agap',
                  defaultValue: 'md',
                  label: 'Gap bottoni',
                  options: [...spacingOptions],
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
                  options: [...spacingOptions],
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
                  options: [...spacingOptions],
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
                  options: [...spacingOptions],
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
                  options: [...spacingOptions],
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
                  options: [...spacingOptions],
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
                  options: [...spacingOptions],
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
                  options: [...spacingOptions],
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
                  options: [...spacingOptions],
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
                  label: 'Dimensione font',
                  options: [
                    {
                      label: 'Piccolo',
                      value: 'small',
                    },
                    {
                      label: 'Normale',
                      value: 'base',
                    },
                    {
                      label: 'Grande',
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
                  label: 'Peso font',
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
                  label: 'Famiglia font',
                  options: [...typographyFontFamilyOptions],
                  admin: {
                    width: '50%',
                  },
                },
                {
                  name: 'letterSpacing',
                  type: 'select',
                  defaultValue: 'normal',
                  label: 'Distanza lettere',
                  options: [...typographyLetterSpacingOptions],
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
              label: 'Trasformazione testo',
              options: [
                {
                  label: 'Normale',
                  value: 'normal',
                },
                {
                  label: 'Uppercase',
                  value: 'uppercase',
                },
              ],
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
