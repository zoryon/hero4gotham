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

const eventTextFontSizeOptions = [
  {
    label: 'Tiny',
    value: 'tiny',
  },
  {
    label: 'Extra small',
    value: 'xs',
  },
  ...typographySubtitleFontSizeOptions,
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

export const UpcomingEvents: Block = {
  slug: 'upcomingEvents',
  interfaceName: 'UpcomingEventsBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Prossimi eventi',
      required: true,
    },
    {
      name: 'headingBackgroundImage',
      type: 'upload',
      label: 'Heading background image',
      relationTo: 'media',
    },
    {
      name: 'emptyEventsTitle',
      type: 'text',
      defaultValue: 'Nessun evento in programma',
      label: 'Empty events title',
      required: true,
    },
    {
      name: 'emptyEventsText',
      type: 'textarea',
      defaultValue: 'Torna presto per scoprire le prossime date.',
      label: 'Empty events text',
    },
    {
      name: 'eventLinkLabel',
      type: 'text',
      defaultValue: 'Scopri di piu',
      label: 'Event link fallback label',
      required: true,
    },
    {
      name: 'eventLinkBackgroundImage',
      type: 'upload',
      label: 'Event link background image',
      relationTo: 'media',
    },
    {
      name: 'eventDescriptionMaxCharacters',
      type: 'number',
      admin: {
        description:
          'Maximum visible description characters. The text continues to the next space before adding "...". Set 0 to disable truncation.',
        step: 1,
      },
      defaultValue: 140,
      label: 'Event description max characters',
      min: 0,
    },
    {
      name: 'eventSource',
      type: 'radio',
      admin: {
        layout: 'horizontal',
      },
      defaultValue: 'automatic',
      label: 'Events source',
      options: [
        {
          label: 'Automatic: next 2 by date',
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
      name: 'manualEvents',
      type: 'relationship',
      admin: {
        condition: (_, siblingData) => siblingData?.eventSource === 'manual',
        description: 'Choose the events to show. The block will render the first two selected.',
      },
      hasMany: true,
      label: 'Manual events',
      maxRows: 2,
      relationTo: 'events',
    },
    {
      name: 'leftPanelScribbleBorder',
      type: 'checkbox',
      defaultValue: false,
      label: 'Left panel scribble border',
    },
    {
      name: 'featureImage',
      type: 'upload',
      label: 'Events feature image',
      relationTo: 'media',
    },
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
              name: 'headingColor',
              type: 'text',
              admin: {
                width: '50%',
              },
              defaultValue: '#211713',
              label: 'Heading color',
            },
            {
              name: 'dateColor',
              type: 'text',
              admin: {
                width: '50%',
              },
              defaultValue: '#e879f9',
              label: 'Date color',
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'eventTitleColor',
              type: 'text',
              admin: {
                width: '50%',
              },
              defaultValue: '#fef3c7',
              label: 'Event title color',
            },
            {
              name: 'eventTextColor',
              type: 'text',
              admin: {
                width: '50%',
              },
              defaultValue: '#f4f4f5',
              label: 'Event text color',
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'eventLinkColor',
              type: 'text',
              admin: {
                width: '50%',
              },
              defaultValue: '#a3e635',
              label: 'Event link color',
            },
            {
              name: 'ctaTextColor',
              type: 'text',
              admin: {
                width: '50%',
              },
              defaultValue: '#ffffff',
              label: 'CTA text color',
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'ctaButtonBackgroundColor',
              type: 'text',
              admin: {
                width: '50%',
              },
              defaultValue: '#84cc16',
              label: 'CTA button background',
            },
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
      label: 'Left panel text formats',
      admin: {
        initCollapsed: true,
      },
      fields: [
        textStyleFields({
          defaults: {
            fontFamily: 'cinzel',
            fontSize: 'small',
            fontWeight: 'black',
            letterSpacing: 'tight',
            verticalScale: 'normal',
          },
          label: 'Heading',
          name: 'heading',
        }),
        textStyleFields({
          defaults: {
            fontFamily: 'cinzel',
            fontSize: 'medium',
            fontWeight: 'black',
            letterSpacing: 'tight',
            verticalScale: 'normal',
          },
          label: 'Date day',
          name: 'dateDay',
          sizeOptions: typographyFontSizeOptions,
        }),
        textStyleFields({
          defaults: {
            fontFamily: 'cinzel',
            fontSize: 'small',
            fontWeight: 'black',
            letterSpacing: 'normal',
            verticalScale: 'normal',
          },
          label: 'Date month',
          name: 'dateMonth',
        }),
        textStyleFields({
          defaults: {
            fontFamily: 'cinzel',
            fontSize: 'small',
            fontWeight: 'black',
            letterSpacing: 'tight',
            verticalScale: 'normal',
          },
          label: 'Event title',
          name: 'eventTitle',
        }),
        textStyleFields({
          defaults: {
            fontFamily: 'geistSans',
            fontSize: 'xs',
            fontWeight: 'regular',
            letterSpacing: 'tight',
            verticalScale: 'normal',
          },
          label: 'Event text',
          name: 'eventText',
          sizeOptions: eventTextFontSizeOptions,
        }),
        textStyleFields({
          defaults: {
            fontFamily: 'cinzel',
            fontSize: 'small',
            fontWeight: 'black',
            letterSpacing: 'tight',
            verticalScale: 'normal',
          },
          label: 'Event link',
          name: 'eventLink',
        }),
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
    plural: 'Upcoming Events',
    singular: 'Upcoming Events',
  },
}
