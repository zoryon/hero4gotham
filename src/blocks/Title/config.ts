import { textAlignOptions, textTransformOptions } from '@/fields/uiOptions'
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
      label: 'Automatic line breaks',
      admin: {
        description:
          'Inserisce ritorni a capo dopo parole o frasi specifiche del titolo. Le regole vengono applicate in ordine.',
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
      label: 'Font size',
      options: [...typographyFontSizeOptions],
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
      defaultValue: 'cinzel',
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
      name: 'distress',
      type: 'select',
      defaultValue: 'none',
      label: 'Distress effect',
      options: [...typographyDistressOptions],
    },
    {
      name: 'align',
      type: 'select',
      defaultValue: 'center',
      options: [...textAlignOptions],
    },
    {
      type: 'collapsible',
      label: 'Title margin (px)',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'margin',
          type: 'group',
          label: false,
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'top',
                  type: 'number',
                  defaultValue: 0,
                  label: 'Top',
                  max: 1000,
                  min: -1000,
                  admin: {
                    step: 1,
                    width: '25%',
                  },
                },
                {
                  name: 'right',
                  type: 'number',
                  defaultValue: 0,
                  label: 'Right',
                  max: 1000,
                  min: -1000,
                  admin: {
                    step: 1,
                    width: '25%',
                  },
                },
                {
                  name: 'bottom',
                  type: 'number',
                  defaultValue: 0,
                  label: 'Bottom',
                  max: 1000,
                  min: -1000,
                  admin: {
                    step: 1,
                    width: '25%',
                  },
                },
                {
                  name: 'left',
                  type: 'number',
                  defaultValue: 0,
                  label: 'Left',
                  max: 1000,
                  min: -1000,
                  admin: {
                    step: 1,
                    width: '25%',
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
    singular: 'Title',
    plural: 'Titles',
  },
}
