import React from 'react'

import type {
  Media as MediaDocument,
  QuoteBannerBlock as QuoteBannerBlockProps,
} from '@/payload-types'

import { Media } from '@/components/Media'
import {
  typographyFontFamilyStyles,
  typographyFontWeightClasses,
  typographyLetterSpacingClasses,
  typographyVerticalScaleValues,
} from '@/fields/typography'
import { formatTextTransform, textTransformClass } from '@/fields/uiOptions'
import { cn } from '@/utilities/ui'

type TextStyle = NonNullable<QuoteBannerBlockProps['textStyle']>

const alignClasses = {
  center: 'text-center',
  left: 'text-left',
}

const getImage = (image: MediaDocument | number | null | undefined) =>
  image && typeof image === 'object' ? image : null

const getTextStyle = (
  style: TextStyle | null | undefined,
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
    [`--${prefix}-font-size-mobile`]: `${style?.fontSizeMobile ?? fallback.fontSizeMobile}px`,
    [`--${prefix}-font-size-desktop`]: `${style?.fontSizeDesktop ?? fallback.fontSizeDesktop}px`,
    color: style?.color || fallback.color,
    fontFamily:
      typographyFontFamilyStyles[
        (style?.fontFamily || fallback.fontFamily) as keyof typeof typographyFontFamilyStyles
      ],
    fontStyle: style?.fontStyle === 'italic' ? 'italic' : fallback.fontStyle,
    lineHeight: style?.lineHeight ?? fallback.lineHeight,
    transform: `scaleY(${
      typographyVerticalScaleValues[
        (style?.verticalScale ||
          fallback.verticalScale) as keyof typeof typographyVerticalScaleValues
      ]
    })`,
    transformOrigin: 'center',
  }) as React.CSSProperties

const normalizeLegacyDefault = (
  value: number | null | undefined,
  legacyDefault: number,
  nextDefault: number,
) => {
  if (value == null || value === legacyDefault) return nextDefault

  return value
}

export const QuoteBannerBlock: React.FC<QuoteBannerBlockProps> = ({
  backgroundImage,
  contentMaxWidth = 980,
  heightDesktop = 66,
  heightMobile = 72,
  leftQuote = '\u201C',
  paddingX = 72,
  paddingY = 8,
  quote,
  quoteGap = 18,
  quoteMarkStyle,
  quoteOffsetY = 0,
  rightQuote = '\u201D',
  showQuotes = true,
  textStyle,
}) => {
  const image = getImage(backgroundImage)
  const resolvedHeightDesktop = normalizeLegacyDefault(heightDesktop, 96, 66)
  const resolvedHeightMobile = normalizeLegacyDefault(heightMobile, 112, 72)
  const resolvedPaddingX = Math.max(paddingX ?? 72, 8)
  const resolvedPaddingY = normalizeLegacyDefault(paddingY, 16, 8)
  const resolvedQuoteOffsetY = quoteOffsetY === -6 ? 0 : (quoteOffsetY ?? 0)
  const resolvedTextStyle = textStyle
    ? {
        ...textStyle,
        fontSizeMobile: Math.min(textStyle.fontSizeMobile ?? 11, 11),
        lineHeight: Math.min(Math.max(textStyle.lineHeight ?? 1.06, 1.02), 1.08),
      }
    : textStyle
  const resolvedQuoteMarkStyle = quoteMarkStyle
    ? {
        ...quoteMarkStyle,
        fontSizeMobile: Math.min(quoteMarkStyle.fontSizeMobile ?? 24, 24),
      }
    : quoteMarkStyle

  return (
    <section
      className="relative isolate hidden h-[var(--quote-banner-mobile-height)] items-center overflow-hidden min-[820px]:flex min-[960px]:h-[var(--quote-banner-desktop-height)]"
      style={
        {
          '--quote-banner-desktop-height': `${resolvedHeightDesktop}px`,
          '--quote-banner-mobile-height': `${resolvedHeightMobile}px`,
          padding: `${resolvedPaddingY}px clamp(8px, 3vw, ${resolvedPaddingX}px)`,
        } as React.CSSProperties
      }
    >
      {image ? (
        <Media
          fill
          imgClassName="object-cover object-center"
          pictureClassName="absolute inset-0 -z-10"
          resource={image}
          size="100vw"
        />
      ) : null}

      <div
        className="relative mx-auto grid w-full grid-cols-1 items-center min-[960px]:grid-cols-[minmax(1.8rem,4rem)_minmax(0,1fr)_minmax(1.8rem,4rem)]"
        style={{
          columnGap: quoteGap ?? 18,
          maxWidth: contentMaxWidth ?? 980,
        }}
      >
        {showQuotes ? (
          <span
            aria-hidden
            className={cn(
              'absolute left-0 top-1/2 justify-self-center text-[length:var(--quote-mark-font-size-mobile)] leading-none -translate-y-1/2 min-[960px]:static min-[960px]:translate-y-0 min-[960px]:text-[length:var(--quote-mark-font-size-desktop)]',
              textTransformClass(resolvedQuoteMarkStyle?.textTransform),
              typographyFontWeightClasses[resolvedQuoteMarkStyle?.fontWeight || 'black'],
              typographyLetterSpacingClasses[resolvedQuoteMarkStyle?.letterSpacing || 'tight'],
            )}
            style={{
              ...getTextStyle(
                resolvedQuoteMarkStyle,
                {
                  color: '#7b2d83',
                  fontFamily: 'cinzel',
                  fontSizeDesktop: 42,
                  fontSizeMobile: 34,
                  fontStyle: 'normal',
                  lineHeight: 1,
                  verticalScale: 'normal',
                },
                'quote-mark',
              ),
              translate: `0 ${resolvedQuoteOffsetY}px`,
            }}
          >
            {formatTextTransform(leftQuote, resolvedQuoteMarkStyle?.textTransform)}
          </span>
        ) : null}

        <p
          className={cn(
            'px-7 whitespace-pre-line text-[length:var(--quote-text-font-size-mobile)] min-[960px]:px-0 min-[960px]:text-[length:var(--quote-text-font-size-desktop)]',
            alignClasses[resolvedTextStyle?.align || 'center'],
            textTransformClass(resolvedTextStyle?.textTransform),
            typographyFontWeightClasses[resolvedTextStyle?.fontWeight || 'black'],
            typographyLetterSpacingClasses[resolvedTextStyle?.letterSpacing || 'normal'],
          )}
          style={getTextStyle(
            resolvedTextStyle,
            {
              color: '#2f1631',
              fontFamily: 'cinzel',
              fontSizeDesktop: 18,
              fontSizeMobile: 16,
              fontStyle: 'normal',
              lineHeight: 1.22,
              verticalScale: 'normal',
            },
            'quote-text',
          )}
        >
          {formatTextTransform(quote, resolvedTextStyle?.textTransform)}
        </p>

        {showQuotes ? (
          <span
            aria-hidden
            className={cn(
              'absolute right-0 top-1/2 justify-self-center text-[length:var(--quote-mark-font-size-mobile)] leading-none -translate-y-1/2 min-[960px]:static min-[960px]:translate-y-0 min-[960px]:text-[length:var(--quote-mark-font-size-desktop)]',
              textTransformClass(resolvedQuoteMarkStyle?.textTransform),
              typographyFontWeightClasses[resolvedQuoteMarkStyle?.fontWeight || 'black'],
              typographyLetterSpacingClasses[resolvedQuoteMarkStyle?.letterSpacing || 'tight'],
            )}
            style={{
              ...getTextStyle(
                resolvedQuoteMarkStyle,
                {
                  color: '#7b2d83',
                  fontFamily: 'cinzel',
                  fontSizeDesktop: 42,
                  fontSizeMobile: 34,
                  fontStyle: 'normal',
                  lineHeight: 1,
                  verticalScale: 'normal',
                },
                'quote-mark',
              ),
              translate: `0 ${resolvedQuoteOffsetY}px`,
            }}
          >
            {formatTextTransform(rightQuote, resolvedQuoteMarkStyle?.textTransform)}
          </span>
        ) : null}
      </div>
    </section>
  )
}
