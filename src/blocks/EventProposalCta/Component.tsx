import React from 'react'

import type {
  EventProposalCtaBlock as EventProposalCtaBlockProps,
  Media as MediaDocument,
} from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import {
  typographyFontFamilyStyles,
  typographyFontWeightClasses,
  typographyLetterSpacingClasses,
  typographyVerticalScaleValues,
} from '@/fields/typography'
import { formatTextTransform, textTransformClass } from '@/fields/uiOptions'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { cn } from '@/utilities/ui'
import configPromise from '@payload-config'
import { Sparkles } from 'lucide-react'
import { getPayload } from 'payload'

type LinkField = NonNullable<EventProposalCtaBlockProps['ctaLink']>

type TextStyle = {
  color?: null | string
  fontFamily?: null | string
  fontSizeDesktop?: null | number
  fontSizeMobile?: null | number
  fontStyle?: null | string
  fontWeight?: null | string
  letterSpacing?: null | string
  lineHeight?: null | number
  textTransform?: null | string
  verticalScale?: null | string
}

const defaultContentGap = 12
const defaultIconSizeDesktop = 56
const defaultIconSizeMobile = 48
const legacyDefaultContentGap = 18
const legacyDefaultIconSizeDesktop = 88
const legacyDefaultIconSizeMobile = 78

const normalizeLegacyDefault = (
  value: null | number | undefined,
  fallback: number,
  legacyFallback: number,
) => (value == null || value === legacyFallback ? fallback : value)

const resolveMediaDocument = async (image: MediaDocument | number | null | undefined) => {
  if (!image) return null
  if (typeof image === 'object' && image.url) return image

  try {
    const payload = await getPayload({ config: configPromise })

    return await payload.findByID({
      collection: 'media',
      depth: 0,
      id: typeof image === 'object' ? image.id : image,
    })
  } catch {
    return null
  }
}

const getRecordValue = <T extends Record<string, string>>(
  record: T,
  value: null | string | undefined,
  fallback: keyof T,
) => record[(value || fallback) as keyof T] || record[fallback]

const getTextStyle = (
  style: TextStyle,
  fallback: {
    color: string
    fontFamily: keyof typeof typographyFontFamilyStyles
    fontSizeDesktop: number
    fontSizeMobile: number
    fontStyle: 'italic' | 'normal'
    lineHeight: number
    verticalScale: keyof typeof typographyVerticalScaleValues
  },
  prefix: string,
): React.CSSProperties =>
  ({
    [`--${prefix}-font-size-mobile`]: `${style.fontSizeMobile ?? fallback.fontSizeMobile}px`,
    [`--${prefix}-font-size-desktop`]: `${style.fontSizeDesktop ?? fallback.fontSizeDesktop}px`,
    color: style.color || fallback.color,
    display: 'inline-block',
    fontFamily: getRecordValue(typographyFontFamilyStyles, style.fontFamily, fallback.fontFamily),
    fontStyle: style.fontStyle === 'italic' ? 'italic' : fallback.fontStyle,
    lineHeight: style.lineHeight ?? fallback.lineHeight,
    transform: `scaleY(${getRecordValue(
      typographyVerticalScaleValues,
      style.verticalScale,
      fallback.verticalScale,
    )})`,
    transformOrigin: 'left center',
  }) as React.CSSProperties

const getTextClassName = ({
  base,
  fontWeight,
  letterSpacing,
  textTransform,
}: {
  base: string
  fontWeight?: null | string
  letterSpacing?: null | string
  textTransform?: null | string
}) =>
  cn(
    base,
    textTransformClass(textTransform),
    getRecordValue(typographyFontWeightClasses, fontWeight, 'regular'),
    getRecordValue(typographyLetterSpacingClasses, letterSpacing, 'tight'),
  )

const hasLinkHref = (link: LinkField | null | undefined) => {
  if (!link) return false
  if (link.type === 'custom') return Boolean(link.url)

  return Boolean(link.reference)
}

const resolveMediaBackground = (image: MediaDocument | null) => {
  if (!image) return undefined

  const url = getMediaUrl(image.url, image.updatedAt)
  return url ? `url("${url.replace(/"/g, '\\"')}")` : undefined
}

export const EventProposalCtaBlock = async ({
  body = "Hai un'idea fuori dagli schemi?\nProponi il tuo evento e diventa parte del caos creativo.",
  bodyColor = '#f1ecdf',
  bodyFontFamily,
  bodyFontSizeDesktop = 15,
  bodyFontSizeMobile = 14,
  bodyFontStyle,
  bodyFontWeight,
  bodyLetterSpacing,
  bodyLineHeight = 1.24,
  bodyTextTransform,
  bodyVerticalScale,
  buttonBackgroundColor = 'rgb(99 29 94 / 0.58)',
  buttonBackgroundImage,
  buttonColor = '#f1d5f5',
  buttonFontFamily,
  buttonFontSizeDesktop = 19,
  buttonFontSizeMobile = 17,
  buttonFontStyle,
  buttonFontWeight,
  buttonHeight = 42,
  buttonLetterSpacing,
  buttonLineHeight = 1,
  buttonTextTransform,
  buttonVerticalScale,
  contentGap = 12,
  ctaFallbackLabel = 'INVIA LA TUA PROPOSTA',
  ctaLink,
  iconImage,
  iconSizeDesktop = 56,
  iconSizeMobile = 48,
  maxWidth = 560,
  minHeightDesktop = 150,
  minHeightMobile = 230,
  paddingX = 20,
  paddingY = 16,
  title = 'PROPONI UN EVENTO',
  titleColor = '#a6bd17',
  titleFontFamily,
  titleFontSizeDesktop = 24,
  titleFontSizeMobile = 22,
  titleFontStyle,
  titleFontWeight,
  titleLetterSpacing,
  titleLineHeight = 1,
  titleTextTransform,
  titleVerticalScale,
}: EventProposalCtaBlockProps) => {
  const resolvedContentGap = normalizeLegacyDefault(
    contentGap,
    defaultContentGap,
    legacyDefaultContentGap,
  )
  const resolvedIconSizeDesktop = normalizeLegacyDefault(
    iconSizeDesktop,
    defaultIconSizeDesktop,
    legacyDefaultIconSizeDesktop,
  )
  const resolvedIconSizeMobile = normalizeLegacyDefault(
    iconSizeMobile,
    defaultIconSizeMobile,
    legacyDefaultIconSizeMobile,
  )
  const [buttonBackgroundMedia, iconMedia] = await Promise.all([
    resolveMediaDocument(buttonBackgroundImage),
    resolveMediaDocument(iconImage),
  ])
  const ctaLabel = ctaLink?.label || ctaFallbackLabel || 'INVIA LA TUA PROPOSTA'
  const titleStyle: TextStyle = {
    color: titleColor,
    fontFamily: titleFontFamily,
    fontSizeDesktop: titleFontSizeDesktop,
    fontSizeMobile: titleFontSizeMobile,
    fontStyle: titleFontStyle,
    fontWeight: titleFontWeight,
    letterSpacing: titleLetterSpacing,
    lineHeight: titleLineHeight,
    textTransform: titleTextTransform,
    verticalScale: titleVerticalScale,
  }
  const bodyStyle: TextStyle = {
    color: bodyColor,
    fontFamily: bodyFontFamily,
    fontSizeDesktop: bodyFontSizeDesktop,
    fontSizeMobile: bodyFontSizeMobile,
    fontStyle: bodyFontStyle,
    fontWeight: bodyFontWeight,
    letterSpacing: bodyLetterSpacing,
    lineHeight: bodyLineHeight,
    textTransform: bodyTextTransform,
    verticalScale: bodyVerticalScale,
  }
  const buttonStyle: TextStyle = {
    color: buttonColor,
    fontFamily: buttonFontFamily,
    fontSizeDesktop: buttonFontSizeDesktop,
    fontSizeMobile: buttonFontSizeMobile,
    fontStyle: buttonFontStyle,
    fontWeight: buttonFontWeight,
    letterSpacing: buttonLetterSpacing,
    lineHeight: buttonLineHeight,
    textTransform: buttonTextTransform,
    verticalScale: buttonVerticalScale,
  }
  const ctaClassName = getTextClassName({
    base: 'event-proposal-cta__button text-[length:var(--event-proposal-button-font-size-mobile)] md:text-[length:var(--event-proposal-button-font-size-desktop)]',
    fontWeight: buttonFontWeight,
    letterSpacing: buttonLetterSpacing,
    textTransform: buttonTextTransform,
  })
  const ctaStyles = {
    ...getTextStyle(
      buttonStyle,
      {
        color: '#f1d5f5',
        fontFamily: 'rye',
        fontSizeDesktop: 19,
        fontSizeMobile: 17,
        fontStyle: 'normal',
        lineHeight: 1,
        verticalScale: 'normal',
      },
      'event-proposal-button',
    ),
    backgroundColor: buttonBackgroundMedia ? 'transparent' : buttonBackgroundColor || undefined,
    backgroundImage: resolveMediaBackground(buttonBackgroundMedia),
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: buttonBackgroundMedia ? '112% 145%' : undefined,
    minHeight: buttonHeight ? `${buttonHeight}px` : undefined,
  } as React.CSSProperties

  return (
    <aside
      className="event-proposal-cta"
      style={
        {
          '--event-proposal-content-gap': `${resolvedContentGap}px`,
          '--event-proposal-icon-size-desktop': `${resolvedIconSizeDesktop}px`,
          '--event-proposal-icon-size-mobile': `${resolvedIconSizeMobile}px`,
          '--event-proposal-max-width': `${maxWidth ?? 560}px`,
          '--event-proposal-min-height-desktop': `${minHeightDesktop ?? 150}px`,
          '--event-proposal-min-height-mobile': `${minHeightMobile ?? 230}px`,
          '--event-proposal-padding-x': `${paddingX ?? 20}px`,
          '--event-proposal-padding-y': `${paddingY ?? 16}px`,
        } as React.CSSProperties
      }
    >
      <div className="event-proposal-cta__inner">
        <div className="event-proposal-cta__icon" aria-hidden>
          {iconMedia ? (
            <Media
              fill
              imgClassName="object-contain"
              pictureClassName="absolute inset-0"
              resource={iconMedia}
              size="4rem"
            />
          ) : (
            <Sparkles className="h-[46%] w-[46%]" strokeWidth={2.3} />
          )}
        </div>

        <div className="event-proposal-cta__copy">
          <h2
            className={getTextClassName({
              base: 'event-proposal-cta__title text-[length:var(--event-proposal-title-font-size-mobile)] md:text-[length:var(--event-proposal-title-font-size-desktop)]',
              fontWeight: titleFontWeight,
              letterSpacing: titleLetterSpacing,
              textTransform: titleTextTransform,
            })}
            style={getTextStyle(
              titleStyle,
              {
                color: '#a6bd17',
                fontFamily: 'rye',
                fontSizeDesktop: 24,
                fontSizeMobile: 22,
                fontStyle: 'normal',
                lineHeight: 1,
                verticalScale: 'normal',
              },
              'event-proposal-title',
            )}
          >
            {formatTextTransform(title, titleTextTransform)}
          </h2>
          <p
            className={getTextClassName({
              base: 'event-proposal-cta__body text-[length:var(--event-proposal-body-font-size-mobile)] md:text-[length:var(--event-proposal-body-font-size-desktop)]',
              fontWeight: bodyFontWeight,
              letterSpacing: bodyLetterSpacing,
              textTransform: bodyTextTransform,
            })}
            style={getTextStyle(
              bodyStyle,
              {
                color: '#f1ecdf',
                fontFamily: 'geistSans',
                fontSizeDesktop: 15,
                fontSizeMobile: 14,
                fontStyle: 'normal',
                lineHeight: 1.24,
                verticalScale: 'normal',
              },
              'event-proposal-body',
            )}
          >
            {formatTextTransform(body, bodyTextTransform)}
          </p>
        </div>
        {hasLinkHref(ctaLink) ? (
          <CMSLink
            {...ctaLink}
            appearance="inline"
            className={ctaClassName}
            label={undefined}
            style={ctaStyles}
          >
            <span className="event-proposal-cta__button-label">
              {formatTextTransform(ctaLabel, buttonTextTransform)}
            </span>
          </CMSLink>
        ) : (
          <span className={ctaClassName} style={ctaStyles}>
            <span className="event-proposal-cta__button-label">
              {formatTextTransform(ctaLabel, buttonTextTransform)}
            </span>
          </span>
        )}
      </div>
    </aside>
  )
}
