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
      label: 'A capo automatici',
      admin: {
        description:
          'Inserisce ritorni a capo dopo parole o frasi specifiche del sottotitolo. Le regole vengono applicate in ordine.',
      },
      fields: [
        {
          name: 'word',
          type: 'text',
          required: true,
          label: 'Parola o frase',
        },
        {
          name: 'occurrences',
          type: 'number',
          defaultValue: 1,
          min: 0,
          max: 20,
          label: 'Quante occorrenze',
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
          label: 'Quanti a capo',
        },
      ],
    },
    {
      name: 'fontSize',
      type: 'select',
      defaultValue: 'base',
      label: 'Dimensione font',
      options: [...typographySubtitleFontSizeOptions],
    },
    {
      name: 'fontWeight',
      type: 'select',
      defaultValue: 'regular',
      label: 'Peso font',
      options: [...typographyFontWeightOptions],
    },
    {
      name: 'fontFamily',
      type: 'select',
      defaultValue: 'geistSans',
      label: 'Famiglia font',
      options: [...typographyFontFamilyOptions],
    },
    {
      name: 'verticalScale',
      type: 'select',
      defaultValue: 'normal',
      label: 'Altezza lettere',
      options: [...typographyVerticalScaleOptions],
    },
    {
      name: 'letterSpacing',
      type: 'select',
      defaultValue: 'wide',
      label: 'Distanza lettere',
      options: [...typographyLetterSpacingOptions],
    },
    {
      name: 'distress',
      type: 'select',
      defaultValue: 'none',
      label: 'Effetto usura',
      options: [...typographyDistressOptions],
    },
    {
      name: 'textTransform',
      type: 'select',
      defaultValue: 'uppercase',
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
    {
      name: 'align',
      type: 'select',
      defaultValue: 'center',
      options: [
        {
          label: 'Center',
          value: 'center',
        },
        {
          label: 'Left',
          value: 'left',
        },
      ],
    },
  ],
  labels: {
    singular: 'Subtitle',
    plural: 'Subtitles',
  },
}
