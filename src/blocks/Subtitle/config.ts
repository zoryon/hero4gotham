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
