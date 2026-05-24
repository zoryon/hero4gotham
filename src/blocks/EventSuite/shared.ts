import type { Field } from 'payload'
import type React from 'react'

import type { Media as MediaDocument } from '@/payload-types'
import {
  typographyFontFamilyOptions,
  typographyFontFamilyStyles,
  typographyFontWeightClasses,
  typographyFontWeightOptions,
  typographyLetterSpacingClasses,
  typographyLetterSpacingOptions,
  typographyVerticalScaleOptions,
  typographyVerticalScaleValues,
} from '@/fields/typography'
import { textTransformCssValue, textTransformOptions } from '@/fields/uiOptions'
import { getMediaUrl } from '@/utilities/getMediaUrl'

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

export const themeColorOptions = [
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
    label: 'Text green',
    value: 'green',
  },
  {
    label: 'Text purple',
    value: 'purple',
  },
] as const

export type EventSuiteMedia = MediaDocument

export type EventSuiteTextStyle = {
  colorCustom?: null | string
  colorTheme?: 'accent' | 'green' | 'muted' | 'primary' | 'purple' | 'secondary' | null
  fontFamily?: keyof typeof typographyFontFamilyStyles | null
  fontSizeDesktop?: null | number
  fontSizeMobile?: null | number
  fontStyle?: 'italic' | 'normal' | null
  fontWeight?: keyof typeof typographyFontWeightClasses | null
  letterSpacing?: keyof typeof typographyLetterSpacingClasses | null
  textTransform?: null | string
  verticalScale?: keyof typeof typographyVerticalScaleValues | null
}

export type EventSuiteItem = {
  activity?:
    | {
        details?:
          | {
              text?: null | string
            }[]
          | null
        color?: null | string
        shortName?: null | string
        title?: null | string
      }
    | number
    | null
  audience?: null | string
  banner?: EventSuiteMedia | number | null
  description?: null | string
  gallery?:
    | {
        caption?: null | string
        id?: null | string
        image?: EventSuiteMedia | number | null
      }[]
    | null
  id: number | string
  slug?: null | string
  startsAt: string
  timeLabel?: null | string
  title: string
  venue?: null | string
  venueAddress?: null | string
}

export const eventSuiteSelect = {
  activity: true,
  audience: true,
  banner: true,
  description: true,
  gallery: {
    caption: true,
    image: true,
  },
  startsAt: true,
  slug: true,
  timeLabel: true,
  title: true,
  venue: true,
  venueAddress: true,
} as const

export const getEventDetailHref = (event: Pick<EventSuiteItem, 'slug'>) =>
  event.slug ? `/eventi/${encodeURIComponent(event.slug)}` : null

export const getEventPrimaryLink = (event: EventSuiteItem) => {
  const detailHref = getEventDetailHref(event)

  if (detailHref) {
    return {
      label: 'Scopri di più',
      type: 'custom' as const,
      url: detailHref,
    }
  }

  return null
}

export const getEventTypeLabel = (activity: EventSuiteItem['activity']) => {
  if (!activity || typeof activity !== 'object') return null

  return activity.shortName || activity.title || null
}

export const getEventDisplayImage = (event: EventSuiteItem) => {
  const galleryImage = event.gallery?.find((item) => item.image)?.image

  return galleryImage || null
}

export const resolveMediaBackground = (image: EventSuiteMedia | number | null | undefined) => {
  if (!image || typeof image !== 'object') return undefined

  const url = getMediaUrl(image.url, image.updatedAt)
  return url ? `url("${url.replace(/"/g, '\\"')}")` : undefined
}

const themeColorValues = {
  accent: 'var(--theme-text-accent)',
  green: 'var(--theme-text-green)',
  muted: 'var(--theme-text-muted)',
  primary: 'var(--theme-text-primary)',
  purple: 'var(--theme-text-purple)',
  secondary: 'var(--theme-text-secondary)',
}

const getRecordValue = <T extends Record<string, string>>(
  record: T,
  value: null | string | undefined,
  fallback: keyof T,
) => record[(value || fallback) as keyof T] || record[fallback]

export const textStyleField = (
  name: string,
  label: string,
  defaults: {
    colorTheme?: string
    fontFamily: string
    fontSizeDesktop: number
    fontSizeMobile: number
    fontWeight: string
    textTransform?: string
  },
): Field => ({
  name,
  type: 'group',
  label,
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'fontFamily',
          type: 'select',
          dbName: 'ff',
          defaultValue: defaults.fontFamily,
          label: 'Font family',
          options: [...typographyFontFamilyOptions],
          admin: {
            width: '25%',
          },
        },
        {
          name: 'fontWeight',
          type: 'select',
          dbName: 'fw',
          defaultValue: defaults.fontWeight,
          label: 'Font weight',
          options: [...typographyFontWeightOptions],
          admin: {
            width: '25%',
          },
        },
        {
          name: 'fontStyle',
          type: 'select',
          dbName: 'fst',
          defaultValue: 'normal',
          label: 'Font style',
          options: [...fontStyleOptions],
          admin: {
            width: '25%',
          },
        },
        {
          name: 'verticalScale',
          type: 'select',
          dbName: 'vs',
          defaultValue: 'normal',
          label: 'Height stretch',
          options: [...typographyVerticalScaleOptions],
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
          name: 'fontSizeMobile',
          type: 'number',
          defaultValue: defaults.fontSizeMobile,
          label: 'Mobile size (px)',
          min: 8,
          max: 160,
          admin: {
            step: 1,
            width: '25%',
          },
        },
        {
          name: 'fontSizeDesktop',
          type: 'number',
          defaultValue: defaults.fontSizeDesktop,
          label: 'Desktop size (px)',
          min: 8,
          max: 180,
          admin: {
            step: 1,
            width: '25%',
          },
        },
        {
          name: 'letterSpacing',
          type: 'select',
          dbName: 'ls',
          defaultValue: 'tight',
          label: 'Letter spacing',
          options: [...typographyLetterSpacingOptions],
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
          name: 'textTransform',
          type: 'select',
          dbName: 'tt',
          defaultValue: defaults.textTransform || 'normal',
          label: 'Text transform',
          options: [...textTransformOptions],
          admin: {
            width: '25%',
          },
        },
        {
          name: 'colorTheme',
          type: 'select',
          dbName: 'ct',
          defaultValue: defaults.colorTheme || 'primary',
          label: 'Theme color',
          options: [...themeColorOptions],
          admin: {
            width: '25%',
          },
        },
        {
          name: 'colorCustom',
          type: 'text',
          label: 'Custom color',
          admin: {
            description: 'Optional. If set, this custom CSS color overrides the theme color.',
            width: '25%',
          },
        },
      ],
    },
  ],
})

export const labelImageField = (name: string, label: string): Field => ({
  name,
  type: 'upload',
  label,
  relationTo: 'media',
})

export const specialBorderField = (name = 'specialBorder'): Field => ({
  name,
  type: 'checkbox',
  defaultValue: false,
  label: 'Special vintage border',
})

export const getEventSuiteTextStyle = (
  style: EventSuiteTextStyle | null | undefined,
  fallback: {
    fontFamily: keyof typeof typographyFontFamilyStyles
    fontSizeDesktop: number
    fontSizeMobile: number
    fontWeight: keyof typeof typographyFontWeightClasses
    lineHeight: number
  },
): React.CSSProperties =>
  ({
    '--event-suite-font-size-desktop': `${style?.fontSizeDesktop ?? fallback.fontSizeDesktop}px`,
    '--event-suite-font-size-mobile': `${style?.fontSizeMobile ?? fallback.fontSizeMobile}px`,
    color:
      style?.colorCustom ||
      themeColorValues[(style?.colorTheme || 'primary') as keyof typeof themeColorValues],
    display: 'inline-block',
    fontFamily: getRecordValue(typographyFontFamilyStyles, style?.fontFamily, fallback.fontFamily),
    fontStyle: style?.fontStyle === 'italic' ? 'italic' : 'normal',
    lineHeight: fallback.lineHeight,
    textTransform: textTransformCssValue(style?.textTransform),
    transform: `scaleY(${getRecordValue(
      typographyVerticalScaleValues,
      style?.verticalScale,
      'normal',
    )})`,
    transformOrigin: 'top left',
  }) as React.CSSProperties

export const getEventSuiteTextClassName = (
  style: EventSuiteTextStyle | null | undefined,
  fallbackWeight: keyof typeof typographyFontWeightClasses,
) =>
  [
    'text-[length:var(--event-suite-font-size-mobile)] md:text-[length:var(--event-suite-font-size-desktop)]',
    getRecordValue(typographyFontWeightClasses, style?.fontWeight, fallbackWeight),
    getRecordValue(typographyLetterSpacingClasses, style?.letterSpacing, 'tight'),
  ].join(' ')

export const formatEventDateParts = (value: string) => {
  const date = new Date(value)
  const parts = new Intl.DateTimeFormat('it-IT', {
    day: '2-digit',
    month: 'short',
  }).formatToParts(date)

  return {
    day: parts.find((part) => part.type === 'day')?.value || '',
    month: (parts.find((part) => part.type === 'month')?.value || '')
      .replace('.', '')
      .toUpperCase(),
    time: new Intl.DateTimeFormat('it-IT', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date),
    weekday: new Intl.DateTimeFormat('it-IT', {
      weekday: 'long',
    })
      .format(date)
      .toUpperCase(),
    year: String(date.getFullYear()),
  }
}
