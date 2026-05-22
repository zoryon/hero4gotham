import React from 'react'

import type {
  Media as MediaDocument,
  UpcomingEventsCtaBlock as UpcomingEventsCtaBlockProps,
} from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import {
  typographyFontFamilyStyles,
  typographyFontSizeClasses,
  typographyFontWeightClasses,
  typographyLetterSpacingClasses,
  typographySubtitleFontSizeClasses,
  typographyVerticalScaleValues,
} from '@/fields/typography'
import { getMediaUrl } from '@/utilities/getMediaUrl'

const resolveBackgroundImage = (image: MediaDocument | number | null | undefined) => {
  if (!image || typeof image !== 'object') return undefined

  const url = getMediaUrl(image.url, image.updatedAt)
  return url ? `url("${url.replace(/"/g, '\\"')}")` : undefined
}

const getRecordValue = <T extends Record<string, string>>(
  record: T,
  value: null | string | undefined,
  fallback: keyof T,
) => record[(value || fallback) as keyof T] || record[fallback]

const getFontSizeClass = (value: null | string | undefined, sizeKind: 'display' | 'subtitle') => {
  if (sizeKind === 'display') {
    return getRecordValue(typographyFontSizeClasses, value, 'compact')
  }

  return getRecordValue(typographySubtitleFontSizeClasses, value, 'small')
}

const getTextClassName = ({
  base,
  fontSize,
  fontWeight,
  letterSpacing,
  sizeKind = 'subtitle',
}: {
  base?: string
  fontSize?: null | string
  fontWeight?: null | string
  letterSpacing?: null | string
  sizeKind?: 'display' | 'subtitle'
}) =>
  [
    base,
    getFontSizeClass(fontSize, sizeKind),
    getRecordValue(typographyFontWeightClasses, fontWeight, 'black'),
    getRecordValue(typographyLetterSpacingClasses, letterSpacing, 'tight'),
  ]
    .filter(Boolean)
    .join(' ')

const getTextStyle = ({
  color,
  fontFamily,
  fontStyle,
  verticalScale,
}: {
  color?: null | string
  fontFamily?: null | string
  fontStyle?: null | string
  verticalScale?: null | string
}): React.CSSProperties => ({
  color: color || undefined,
  display: 'inline-block',
  fontFamily: getRecordValue(typographyFontFamilyStyles, fontFamily, 'cinzel'),
  fontStyle: fontStyle === 'italic' ? 'italic' : 'normal',
  transform: `scaleY(${getRecordValue(typographyVerticalScaleValues, verticalScale, 'normal')})`,
  transformOrigin: 'top left',
})

export const UpcomingEventsCtaBlock = ({
  ctaButtonBackgroundColor = '#84cc16',
  ctaButtonFontFamily,
  ctaButtonFontSize,
  ctaButtonFontStyle,
  ctaButtonFontWeight,
  ctaButtonLetterSpacing,
  ctaButtonVerticalScale,
  ctaButtonTextColor = '#251414',
  ctaGlyph,
  ctaLink,
  ctaLinkBackgroundImage,
  ctaLinkFallbackLabel = 'Unisciti a noi',
  ctaAccentLabel = 'Fai la differenza',
  ctaText,
  ctaTextColor = '#ffffff',
  ctaTextFontFamily,
  ctaTextFontSize,
  ctaTextFontStyle,
  ctaTextFontWeight,
  ctaTextLetterSpacing,
  ctaTextVerticalScale,
  ctaTitle,
  ctaTitleFontFamily,
  ctaTitleFontSize,
  ctaTitleFontStyle,
  ctaTitleFontWeight,
  ctaTitleLetterSpacing,
  ctaTitleVerticalScale,
  rightBackground,
}: UpcomingEventsCtaBlockProps) => {
  const ctaButtonLabel = ctaLink?.label || ctaLinkFallbackLabel || 'Unisciti a noi'
  const ctaButtonClassName = getTextClassName({
    base: 'inline-flex w-fit max-w-full justify-center px-7 py-3 text-center uppercase shadow-[0_5px_0_rgb(0_0_0_/_0.18)] [overflow-wrap:anywhere] md:px-8 md:py-3.5',
    fontSize: ctaButtonFontSize,
    fontWeight: ctaButtonFontWeight,
    letterSpacing: ctaButtonLetterSpacing,
  })
  const ctaButtonStyle: React.CSSProperties = {
    backgroundColor: ctaLinkBackgroundImage ? 'transparent' : ctaButtonBackgroundColor || '#84cc16',
    backgroundImage: resolveBackgroundImage(ctaLinkBackgroundImage),
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '100% 100%',
    clipPath: 'polygon(2% 0, 100% 0, 98% 93%, 0 100%)',
    color: ctaButtonTextColor || '#251414',
    fontFamily: getRecordValue(typographyFontFamilyStyles, ctaButtonFontFamily, 'cinzel'),
    fontStyle: ctaButtonFontStyle === 'italic' ? 'italic' : 'normal',
    transform: `scaleY(${getRecordValue(
      typographyVerticalScaleValues,
      ctaButtonVerticalScale,
      'normal',
    )})`,
    transformOrigin: 'center',
  }
  const ctaLinkHasHref = Boolean(
    ctaLink?.url ||
    (ctaLink?.type === 'reference' &&
      ctaLink.reference?.value &&
      typeof ctaLink.reference.value === 'object' &&
      ctaLink.reference.value.slug),
  )

  return (
    <aside
      className="upcoming-events-cta-strip relative isolate mt-3 min-h-[13.5rem] w-full overflow-hidden md:mt-4 md:min-h-[12rem] lg:min-h-[10.75rem] xl:min-h-[11.25rem]"
      style={{
        backgroundImage: resolveBackgroundImage(rightBackground),
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-black/10" />

      {ctaGlyph && typeof ctaGlyph === 'object' ? (
        <div className="pointer-events-none absolute bottom-[-18%] left-[2%] z-0 h-36 w-36 opacity-95 md:bottom-[-24%] md:left-[5%] md:h-44 md:w-44 xl:h-52 xl:w-52">
          <Media
            fill
            imgClassName="object-contain"
            pictureClassName="absolute inset-0"
            resource={ctaGlyph}
            size="(max-width: 767px) 9rem, (max-width: 1279px) 11rem, 13rem"
          />
        </div>
      ) : null}

      <div className="relative z-10 grid min-h-[13.5rem] items-center gap-6 px-6 py-7 md:min-h-[12rem] md:grid-cols-[minmax(0,1fr)_auto] md:px-10 lg:min-h-[10.75rem] lg:px-16 lg:py-6 xl:min-h-[11.25rem] xl:grid-cols-[minmax(0,1fr)_minmax(13rem,0.34fr)] xl:px-24">
        <div className="upcoming-events-cta-copy-backdrop relative z-10 min-w-0 max-w-[50rem] justify-self-center text-center md:justify-self-start md:pl-[20%] md:text-left lg:pl-[18%] xl:pl-[16%]">
          <h2
            className={getTextClassName({
              base: 'max-w-full uppercase [overflow-wrap:anywhere]',
              fontSize: ctaTitleFontSize,
              fontWeight: ctaTitleFontWeight,
              letterSpacing: ctaTitleLetterSpacing,
              sizeKind: 'display',
            })}
            style={getTextStyle({
              color: ctaTextColor || '#ffffff',
              fontFamily: ctaTitleFontFamily,
              fontStyle: ctaTitleFontStyle,
              verticalScale: ctaTitleVerticalScale,
            })}
          >
            {ctaTitle}
          </h2>
          {ctaText ? (
            <p
              className={getTextClassName({
                base: 'mt-3 max-w-[38rem] [overflow-wrap:anywhere] md:mt-7 lg:mt-4',
                fontSize: ctaTextFontSize,
                fontWeight: ctaTextFontWeight,
                letterSpacing: ctaTextLetterSpacing,
              })}
              style={{
                ...getTextStyle({
                  color: ctaTextColor || '#ffffff',
                  fontFamily: ctaTextFontFamily,
                  fontStyle: ctaTextFontStyle,
                  verticalScale: ctaTextVerticalScale,
                }),
                display: 'block',
              }}
            >
              {ctaText}
            </p>
          ) : null}
        </div>

        <div className="relative z-10 grid justify-items-center gap-3 md:justify-self-end">
          {ctaLinkHasHref ? (
            <CMSLink
              {...ctaLink}
              className={ctaButtonClassName}
              label={ctaButtonLabel}
              style={ctaButtonStyle}
            />
          ) : (
            <span className={ctaButtonClassName} style={ctaButtonStyle}>
              {ctaButtonLabel}
            </span>
          )}
          {ctaAccentLabel ? (
            <div className="upcoming-events-cta-accent flex items-center gap-4">
              <span className="upcoming-events-cta-accent-arrow hidden md:block" aria-hidden />
              <span className="grid justify-items-start">
                <span
                  className="whitespace-nowrap text-sm font-semibold leading-none md:text-base"
                  style={{
                    color: ctaTextColor || '#ffffff',
                    fontFamily: getRecordValue(
                      typographyFontFamilyStyles,
                      ctaTextFontFamily,
                      'geistSans',
                    ),
                    fontStyle: ctaTextFontStyle === 'italic' ? 'italic' : 'normal',
                  }}
                >
                  {ctaAccentLabel}
                </span>
                <span className="upcoming-events-cta-accent-underline" aria-hidden />
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </aside>
  )
}
