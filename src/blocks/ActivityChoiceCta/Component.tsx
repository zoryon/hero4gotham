import React from 'react'

import type {
  ActivityChoiceCtaBlock as ActivityChoiceCtaBlockProps,
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
import { cn } from '@/utilities/ui'

type TextStyle = NonNullable<ActivityChoiceCtaBlockProps['topTextStyle']>

const objectPositionClasses = {
  bottom: 'object-bottom',
  center: 'object-center',
  left: 'object-left',
  right: 'object-right',
  top: 'object-top',
}

const getImage = (image: MediaDocument | number | null | undefined) =>
  image && typeof image === 'object' ? image : null

const getImageUrl = (image: MediaDocument | number | null | undefined) => {
  const resolvedImage = getImage(image)

  return resolvedImage?.url || null
}

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

const textTransformClass = (value: string | null | undefined) =>
  value === 'uppercase' ? 'uppercase' : undefined

const SideImage: React.FC<{
  className?: string
  image: MediaDocument | null
  label: string
  position?: keyof typeof objectPositionClasses | null
}> = ({ className, image, label, position }) => (
  <div
    className={cn(
      'relative min-h-[var(--activity-choice-mobile-image-height)] overflow-hidden md:min-h-[var(--activity-choice-height-tablet)] xl:min-h-[var(--activity-choice-height-desktop)]',
      className,
    )}
  >
    {image ? (
      <Media
        fill
        imgClassName={cn('object-cover', objectPositionClasses[position || 'center'])}
        pictureClassName="absolute inset-0"
        resource={image}
        size="(max-width: 768px) 100vw, 28vw"
      />
    ) : (
      <div className="flex h-full min-h-[var(--activity-choice-mobile-image-height)] items-center justify-center text-xs uppercase tracking-[0.18em] text-zinc-500 md:min-h-[var(--activity-choice-height-tablet)] xl:min-h-[var(--activity-choice-height-desktop)]">
        {label}
      </div>
    )}
  </div>
)

export const ActivityChoiceCtaBlock: React.FC<ActivityChoiceCtaBlockProps> = ({
  accentText,
  accentTextStyle,
  bottomText,
  bottomTextStyle,
  ctaBackgroundImage,
  ctaTextStyle,
  heightDesktop = 160,
  heightTablet = 132,
  leftImage,
  leftImagePosition,
  links,
  mobileImageHeight = 150,
  rightImage,
  rightImagePosition,
  topText,
  topTextStyle,
}) => {
  const primaryLink = links?.[0]?.link
  const ctaBackgroundUrl = getImageUrl(ctaBackgroundImage)

  return (
    <section
      className="activity-choice-cta grid w-full overflow-hidden text-center md:grid-cols-[minmax(0,0.72fr)_minmax(20rem,1fr)_minmax(0,0.72fr)] md:items-stretch xl:grid-cols-[minmax(12rem,0.52fr)_minmax(30rem,1fr)_minmax(12rem,0.52fr)]"
      style={
        {
          '--activity-choice-height-desktop': `${heightDesktop ?? 160}px`,
          '--activity-choice-height-tablet': `${heightTablet ?? 132}px`,
          '--activity-choice-mobile-image-height': `${mobileImageHeight ?? 150}px`,
        } as React.CSSProperties
      }
    >
      <SideImage
        className="hidden md:block"
        image={getImage(leftImage)}
        label="Left image"
        position={leftImagePosition as keyof typeof objectPositionClasses}
      />

      <div className="relative isolate flex min-h-[var(--activity-choice-height-tablet)] flex-col items-center justify-center overflow-hidden px-4 py-7 md:px-6 md:py-3 xl:min-h-[var(--activity-choice-height-desktop)]">
        <div className="flex flex-col items-center justify-center gap-1 md:gap-0">
          <p
            className={cn(
              'text-[length:var(--activity-choice-top-font-size-mobile)] md:text-[length:var(--activity-choice-top-font-size-desktop)]',
              textTransformClass(topTextStyle?.textTransform),
              typographyFontWeightClasses[topTextStyle?.fontWeight || 'regular'],
              typographyLetterSpacingClasses[topTextStyle?.letterSpacing || 'normal'],
            )}
            style={getTextStyle(
              topTextStyle,
              {
                color: '#f4f0dc',
                fontFamily: 'rye',
                fontSizeDesktop: 30,
                fontSizeMobile: 26,
                fontStyle: 'normal',
                lineHeight: 0.95,
                verticalScale: 'tall',
              },
              'activity-choice-top',
            )}
          >
            {topText}
          </p>

          <p className="flex flex-wrap items-baseline justify-center gap-x-2 gap-y-1">
            <span
              className={cn(
                'inline-block text-[length:var(--activity-choice-bottom-font-size-mobile)] md:text-[length:var(--activity-choice-bottom-font-size-desktop)]',
                textTransformClass(bottomTextStyle?.textTransform),
                typographyFontWeightClasses[bottomTextStyle?.fontWeight || 'regular'],
                typographyLetterSpacingClasses[bottomTextStyle?.letterSpacing || 'normal'],
              )}
              style={getTextStyle(
                bottomTextStyle,
                {
                  color: '#f4f0dc',
                  fontFamily: 'rye',
                  fontSizeDesktop: 30,
                  fontSizeMobile: 26,
                  fontStyle: 'normal',
                  lineHeight: 0.95,
                  verticalScale: 'tall',
                },
                'activity-choice-bottom',
              )}
            >
              {bottomText}
            </span>
            <span
              className={cn(
                'inline-block text-[length:var(--activity-choice-accent-font-size-mobile)] md:text-[length:var(--activity-choice-accent-font-size-desktop)]',
                textTransformClass(accentTextStyle?.textTransform),
                typographyFontWeightClasses[accentTextStyle?.fontWeight || 'regular'],
                typographyLetterSpacingClasses[accentTextStyle?.letterSpacing || 'normal'],
              )}
              style={getTextStyle(
                accentTextStyle,
                {
                  color: '#a6bd17',
                  fontFamily: 'rye',
                  fontSizeDesktop: 30,
                  fontSizeMobile: 26,
                  fontStyle: 'normal',
                  lineHeight: 0.95,
                  verticalScale: 'tall',
                },
                'activity-choice-accent',
              )}
            >
              {accentText}
            </span>
          </p>
        </div>

        {primaryLink ? (
          <CMSLink
            {...primaryLink}
            appearance="inline"
            className="relative mt-5 inline-flex min-h-10 min-w-[15rem] items-center justify-center overflow-hidden px-8 py-2 text-center no-underline"
            label={undefined}
            style={
              {
                backgroundColor: ctaBackgroundUrl ? undefined : '#a6bd17',
                backgroundImage: ctaBackgroundUrl ? `url(${ctaBackgroundUrl})` : undefined,
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '100% 100%',
              } as React.CSSProperties
            }
          >
            <span
              className={cn(
                'relative z-10 text-[length:var(--activity-choice-cta-font-size-mobile)] md:text-[length:var(--activity-choice-cta-font-size-desktop)]',
                textTransformClass(ctaTextStyle?.textTransform),
                typographyFontWeightClasses[ctaTextStyle?.fontWeight || 'regular'],
                typographyLetterSpacingClasses[ctaTextStyle?.letterSpacing || 'tight'],
              )}
              style={getTextStyle(
                ctaTextStyle,
                {
                  color: '#17200c',
                  fontFamily: 'rye',
                  fontSizeDesktop: 16,
                  fontSizeMobile: 14,
                  fontStyle: 'normal',
                  lineHeight: 1,
                  verticalScale: 'normal',
                },
                'activity-choice-cta',
              )}
            >
              {primaryLink.label}
            </span>
          </CMSLink>
        ) : null}
      </div>

      <SideImage
        className="hidden md:block"
        image={getImage(rightImage)}
        label="Right image"
        position={rightImagePosition as keyof typeof objectPositionClasses}
      />
    </section>
  )
}
