import type { Block, Field } from 'payload'

import { link } from '@/fields/link'
import {
  typographyFontFamilyOptions,
  typographyFontSizeOptions,
  typographyFontWeightOptions,
  typographyLetterSpacingOptions,
  typographySubtitleFontSizeOptions,
  typographyVerticalScaleOptions,
} from '@/fields/typography'

const fontStyleOptions = [
  {
    label: 'Normal',
    value: 'normal',
  },
  {
    label: 'Italic',
    value: 'italic',
  },
] as const

const textStyleFields = ({
  dbNamePrefix,
  defaults,
  label,
  name,
  sizeOptions = typographySubtitleFontSizeOptions,
}: {
  dbNamePrefix: string
  defaults: {
    color?: string
    fontFamily?: string
    fontSize?: string
    fontStyle?: string
    fontWeight?: string
    letterSpacing?: string
    verticalScale?: string
  }
  label: string
  name: string
  sizeOptions?: ReadonlyArray<{ label: string; value: string }>
}): Field => ({
  type: 'collapsible',
  label,
  admin: {
    initCollapsed: true,
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: `${name}Color`,
          type: 'text',
          admin: {
            width: '33%',
          },
          defaultValue: defaults.color || '#f4f4f5',
          label: 'Color',
        },
        {
          name: `${name}FontFamily`,
          type: 'select',
          dbName: `${dbNamePrefix}_ff`,
          admin: {
            width: '33%',
          },
          defaultValue: defaults.fontFamily || 'rye',
          label: 'Font family',
          options: [...typographyFontFamilyOptions],
        },
        {
          name: `${name}FontSize`,
          type: 'select',
          dbName: `${dbNamePrefix}_fs`,
          admin: {
            width: '33%',
          },
          defaultValue: defaults.fontSize || 'base',
          label: 'Font size',
          options: [...sizeOptions],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: `${name}FontWeight`,
          type: 'select',
          dbName: `${dbNamePrefix}_fw`,
          admin: {
            width: '25%',
          },
          defaultValue: defaults.fontWeight || 'black',
          label: 'Font weight',
          options: [...typographyFontWeightOptions],
        },
        {
          name: `${name}FontStyle`,
          type: 'select',
          dbName: `${dbNamePrefix}_fst`,
          admin: {
            width: '25%',
          },
          defaultValue: defaults.fontStyle || 'normal',
          label: 'Font style',
          options: [...fontStyleOptions],
        },
        {
          name: `${name}VerticalScale`,
          type: 'select',
          dbName: `${dbNamePrefix}_vs`,
          admin: {
            width: '25%',
          },
          defaultValue: defaults.verticalScale || 'normal',
          label: 'Letter height',
          options: [...typographyVerticalScaleOptions],
        },
        {
          name: `${name}LetterSpacing`,
          type: 'select',
          dbName: `${dbNamePrefix}_ls`,
          admin: {
            width: '25%',
          },
          defaultValue: defaults.letterSpacing || 'tight',
          label: 'Letter spacing',
          options: [...typographyLetterSpacingOptions],
        },
      ],
    },
  ],
})

export const PhotoGalleryStrip: Block = {
  slug: 'photoGalleryStrip',
  dbName: 'pgs',
  interfaceName: 'PhotoGalleryStripBlock',
  fields: [
    {
      name: 'headingTop',
      type: 'text',
      defaultValue: 'Dalla nostra',
      required: true,
    },
    {
      name: 'headingBottom',
      type: 'text',
      defaultValue: 'Galleria',
      required: true,
    },
    {
      name: 'headingUnderlineColor',
      type: 'text',
      defaultValue: '#e879f9',
      label: 'Heading underline color',
    },
    {
      name: 'photoSource',
      type: 'radio',
      dbName: 'src',
      admin: {
        layout: 'horizontal',
      },
      defaultValue: 'automatic',
      label: 'Photos source',
      options: [
        {
          label: 'Automatic: 3 random event gallery photos',
          value: 'automatic',
        },
        {
          label: 'Manual selection',
          value: 'manual',
        },
      ],
      required: true,
    },
    {
      name: 'manualPhotos',
      type: 'relationship',
      admin: {
        condition: (_, siblingData) => siblingData?.photoSource === 'manual',
        description: 'Choose exactly 3 photos for the strip.',
      },
      hasMany: true,
      label: 'Manual photos',
      maxRows: 3,
      relationTo: 'media',
      validate: (value, { siblingData }) => {
        const data = siblingData as { photoSource?: string } | undefined

        if (data?.photoSource !== 'manual') return true

        return Array.isArray(value) && value.length === 3
          ? true
          : 'Choose exactly 3 photos when using manual selection.'
      },
    },
    {
      name: 'ctaLabel',
      type: 'text',
      defaultValue: 'Vedi tutte le foto',
      label: 'CTA label',
      required: true,
    },
    link({
      appearances: false,
      overrides: {
        name: 'ctaLink',
        label: 'CTA link',
      },
    }),
    {
      name: 'ctaBackgroundImage',
      type: 'upload',
      label: 'CTA background image',
      relationTo: 'media',
    },
    {
      name: 'ctaFallbackBackgroundColor',
      type: 'text',
      defaultValue: '#a3e635',
      label: 'CTA fallback background color',
    },
    {
      type: 'collapsible',
      label: 'Typography',
      admin: {
        initCollapsed: true,
      },
      fields: [
        textStyleFields({
          dbNamePrefix: 'ht',
          defaults: {
            color: '#f4f4f5',
            fontFamily: 'rye',
            fontSize: 'base',
            fontWeight: 'regular',
            letterSpacing: 'normal',
            verticalScale: 'normal',
          },
          label: 'Heading top',
          name: 'headingTop',
        }),
        textStyleFields({
          dbNamePrefix: 'hb',
          defaults: {
            color: '#f4f4f5',
            fontFamily: 'rye',
            fontSize: 'large',
            fontWeight: 'regular',
            letterSpacing: 'normal',
            verticalScale: 'normal',
          },
          label: 'Heading bottom',
          name: 'headingBottom',
        }),
        textStyleFields({
          dbNamePrefix: 'ct',
          defaults: {
            color: '#211713',
            fontFamily: 'cinzel',
            fontSize: 'small',
            fontWeight: 'black',
            letterSpacing: 'tight',
            verticalScale: 'normal',
          },
          label: 'CTA label',
          name: 'ctaLabel',
          sizeOptions: typographySubtitleFontSizeOptions,
        }),
      ],
    },
  ],
  labels: {
    plural: 'Photo Gallery Strips',
    singular: 'Photo Gallery Strip',
  },
}
