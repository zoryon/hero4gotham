import type { Block } from 'payload'

import {
  typographyDistressOptions,
  typographyFontFamilyOptions,
  typographyFontSizeOptions,
  typographyVerticalScaleOptions,
  typographyFontWeightOptions,
} from '@/fields/typography'

export const Title: Block = {
  slug: 'title',
  interfaceName: 'TitleBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Benvenuti nel nostro caos',
      admin: {
        description: 'Supporta anche ritorni a capo per ottenere titoli su piu righe.',
      },
    },
    {
      name: 'lineBreaks',
      type: 'array',
      label: 'A capo automatici',
      admin: {
        description:
          'Inserisce ritorni a capo dopo parole o frasi specifiche del titolo. Le regole vengono applicate in ordine.',
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
      name: 'subtitle',
      type: 'text',
      admin: {
        hidden: true,
        description:
          'Legacy field kept to avoid deleting existing data. Use the Subtitle block for new content.',
      },
    },
    {
      name: 'fontSize',
      type: 'select',
      defaultValue: 'hero',
      label: 'Dimensione font',
      options: [...typographyFontSizeOptions],
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
      defaultValue: 'cinzel',
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
      name: 'distress',
      type: 'select',
      defaultValue: 'none',
      label: 'Effetto usura',
      options: [...typographyDistressOptions],
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
    singular: 'Title',
    plural: 'Titles',
  },
}
