import { textAlignOptions, textTransformOptions } from '@/fields/uiOptions'
import type { Block } from 'payload'

import {
  typographyDistressOptions,
  typographyFontFamilyOptions,
  typographyLetterSpacingOptions,
  typographySubtitleFontSizeOptions,
  typographyVerticalScaleOptions,
  typographyFontWeightOptions,
} from '@/fields/typography'

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
] as const

export const Subtitle: Block = {
  slug: 'subtitle',
  interfaceName: 'SubtitleBlock',
  fields: [
    {
      name: 'text',
      type: 'text',
      required: true,
      defaultValue: 'Nel nostro caos',
      admin: {
        description: 'Supporta anche ritorni a capo per ottenere sottotitoli su piu righe.',
      },
    },
    {
      name: 'lineBreaks',
      type: 'array',
      label: 'Automatic line breaks',
      admin: {
        description:
          'Inserisce ritorni a capo dopo parole o frasi specifiche del sottotitolo. Le regole vengono applicate in ordine.',
      },
      fields: [
        {
          name: 'word',
          type: 'text',
          required: true,
          label: 'Word or phrase',
        },
        {
          name: 'occurrences',
          type: 'number',
          defaultValue: 1,
          min: 0,
          max: 20,
          label: 'Occurrence count',
          admin: {
            description: '0 = tutte le occorrenze trovate.',
          },
        },
        {
          name: 'breaks',
          type: 'number',
          defaultValue: 1,
          min: 1,
          max: 5,
          label: 'Line break count',
        },
      ],
    },
    {
      name: 'fontSize',
      type: 'select',
      defaultValue: 'base',
      label: 'Font size',
      options: [...typographySubtitleFontSizeOptions],
    },
    {
      name: 'fontWeight',
      type: 'select',
      defaultValue: 'regular',
      label: 'Font weight',
      options: [...typographyFontWeightOptions],
    },
    {
      name: 'fontFamily',
      type: 'select',
      defaultValue: 'geistSans',
      label: 'Font family',
      options: [...typographyFontFamilyOptions],
    },
    {
      name: 'verticalScale',
      type: 'select',
      defaultValue: 'normal',
      label: 'Line height',
      options: [...typographyVerticalScaleOptions],
    },
    {
      name: 'letterSpacing',
      type: 'select',
      defaultValue: 'wide',
      label: 'Letter spacing',
      options: [...typographyLetterSpacingOptions],
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
          name: 'themeTextColor',
          type: 'select',
          defaultValue: 'secondary',
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
          defaultValue: '',
          label: 'Custom text color',
          admin: {
            condition: (_, siblingData) => siblingData?.textColorMode !== 'theme',
            description: 'Optional CSS color, for example #f4f0dc or rgba(255,255,255,0.85).',
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'distress',
      type: 'select',
      defaultValue: 'none',
      label: 'Distress effect',
      options: [...typographyDistressOptions],
    },
    {
      name: 'textTransform',
      type: 'select',
      defaultValue: 'uppercase',
      label: 'Text transform',
      options: [...textTransformOptions],
    },
    {
      name: 'align',
      type: 'select',
      defaultValue: 'center',
      options: [...textAlignOptions],
    },
  ],
  labels: {
    singular: 'Subtitle',
    plural: 'Subtitles',
  },
}
