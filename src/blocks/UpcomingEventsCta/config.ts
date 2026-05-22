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
  defaults,
  label,
  name,
  sizeOptions = typographySubtitleFontSizeOptions,
}: {
  defaults: {
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
          name: `${name}FontFamily`,
          type: 'select',
          admin: {
            width: '50%',
          },
          defaultValue: defaults.fontFamily || 'cinzel',
          label: 'Font family',
          options: [...typographyFontFamilyOptions],
        },
        {
          name: `${name}FontSize`,
          type: 'select',
          admin: {
            width: '50%',
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
          admin: {
            width: '50%',
          },
          defaultValue: defaults.fontWeight || 'black',
          label: 'Font weight',
          options: [...typographyFontWeightOptions],
        },
        {
          name: `${name}FontStyle`,
          type: 'select',
          admin: {
            width: '50%',
          },
          defaultValue: defaults.fontStyle || 'normal',
          label: 'Font style',
          options: [...fontStyleOptions],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: `${name}VerticalScale`,
          type: 'select',
          admin: {
            width: '50%',
          },
          defaultValue: defaults.verticalScale || 'normal',
          label: 'Letter height',
          options: [...typographyVerticalScaleOptions],
        },
        {
          name: `${name}LetterSpacing`,
          type: 'select',
          admin: {
            width: '50%',
          },
          defaultValue: defaults.letterSpacing || 'normal',
          label: 'Letter spacing',
          options: [...typographyLetterSpacingOptions],
        },
      ],
    },
  ],
})

export const UpcomingEventsCta: Block = {
  slug: 'upcomingEventsCta',
  dbName: 'ue_cta',
  interfaceName: 'UpcomingEventsCtaBlock',
  fields: [
    {
      name: 'rightBackground',
      type: 'upload',
      label: 'CTA panel background',
      relationTo: 'media',
    },
    {
      name: 'ctaTitle',
      type: 'text',
      defaultValue: 'Diventa socio',
      label: 'CTA title',
      required: true,
    },
    {
      name: 'ctaText',
      type: 'textarea',
      defaultValue:
        'Sostieni le nostre attivita e fai parte di una comunita che trasforma il diverso in straordinario.',
      label: 'CTA text',
    },
    link({
      appearances: false,
      overrides: {
        name: 'ctaLink',
        label: 'CTA link',
      },
    }),
    {
      name: 'ctaLinkFallbackLabel',
      type: 'text',
      defaultValue: 'Unisciti a noi',
      label: 'CTA link fallback label',
      required: true,
    },
    {
      name: 'ctaLinkBackgroundImage',
      type: 'upload',
      label: 'CTA link background image',
      relationTo: 'media',
    },
    {
      name: 'ctaAccentLabel',
      type: 'text',
      defaultValue: 'Fai la differenza',
      label: 'CTA accent label',
    },
    {
      name: 'ctaGlyph',
      type: 'upload',
      label: 'CTA decorative image',
      relationTo: 'media',
    },
    {
      type: 'collapsible',
      label: 'Text style',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'ctaTextColor',
              type: 'text',
              admin: {
                width: '50%',
              },
              defaultValue: '#ffffff',
              label: 'CTA text color',
            },
            {
              name: 'ctaButtonBackgroundColor',
              type: 'text',
              admin: {
                width: '50%',
              },
              defaultValue: '#84cc16',
              label: 'CTA button background',
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'ctaButtonTextColor',
              type: 'text',
              admin: {
                width: '50%',
              },
              defaultValue: '#251414',
              label: 'CTA button text color',
            },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Right panel text formats',
      admin: {
        initCollapsed: true,
      },
      fields: [
        textStyleFields({
          defaults: {
            fontFamily: 'cinzel',
            fontSize: 'compact',
            fontWeight: 'black',
            letterSpacing: 'tight',
            verticalScale: 'normal',
          },
          label: 'CTA title',
          name: 'ctaTitle',
          sizeOptions: typographyFontSizeOptions,
        }),
        textStyleFields({
          defaults: {
            fontFamily: 'geistSans',
            fontSize: 'small',
            fontWeight: 'regular',
            letterSpacing: 'tight',
            verticalScale: 'normal',
          },
          label: 'CTA text',
          name: 'ctaText',
        }),
        textStyleFields({
          defaults: {
            fontFamily: 'cinzel',
            fontSize: 'small',
            fontWeight: 'black',
            letterSpacing: 'tight',
            verticalScale: 'normal',
          },
          label: 'CTA button',
          name: 'ctaButton',
        }),
      ],
    },
  ],
  labels: {
    plural: 'Upcoming Events CTAs',
    singular: 'Upcoming Events CTA',
  },
}
