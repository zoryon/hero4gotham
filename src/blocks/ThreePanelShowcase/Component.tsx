import React from 'react'

import type {
  Media as MediaDocument,
  ThreePanelShowcaseBlock as ThreePanelShowcaseBlockProps,
} from '@/payload-types'

import { Media } from '@/components/Media'
import {
  typographyFontFamilyStyles,
  typographyFontWeightClasses,
  typographyLetterSpacingClasses,
  typographyVerticalScaleValues,
} from '@/fields/typography'
import { cn } from '@/utilities/ui'

type TextStyle = NonNullable<ThreePanelShowcaseBlockProps['titleStyle']>

const containerWidthClasses = {
  contained: 'container',
  full: 'w-full',
  wide: 'mx-auto w-full max-w-[88rem] px-4 md:px-8',
}

const getPanelImage = (image: MediaDocument | number | null | undefined) =>
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
    maxWidth: number
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
    maxWidth: style?.maxWidth ?? fallback.maxWidth,
    transform: `scaleY(${
      typographyVerticalScaleValues[
        (style?.verticalScale ||
          fallback.verticalScale) as keyof typeof typographyVerticalScaleValues
      ]
    })`,
    transformOrigin: 'left center',
  }) as React.CSSProperties

const textTransformClass = (value: string | null | undefined) =>
  value === 'uppercase' ? 'uppercase' : undefined

const PanelImage: React.FC<{
  className?: string
  image: MediaDocument | null
  label: string
}> = ({ className, image, label }) => (
  <div
    className={cn(
      'relative min-h-[var(--three-panel-mobile-height)] overflow-hidden xl:min-h-0',
      className,
    )}
  >
    {image ? (
      <Media
        fill
        imgClassName="object-cover object-center"
        pictureClassName="absolute inset-0"
        resource={image}
        size="(max-width: 768px) 100vw, 38vw"
      />
    ) : (
      <div className="flex h-full min-h-[var(--three-panel-mobile-height)] items-center justify-center text-xs uppercase tracking-[0.18em] text-zinc-500">
        {label}
      </div>
    )}
  </div>
)

export const ThreePanelShowcaseBlock: React.FC<ThreePanelShowcaseBlockProps> = ({
  body,
  bodyStyle,
  centerColumn = 25,
  centerImage,
  containerWidth = 'full',
  contentPadding = 38,
  height = 380,
  leftColumn = 36,
  leftImage,
  mobilePanelHeight = 260,
  rightImage,
  title,
  titleStyle,
}) => {
  const rightColumn = Math.max(100 - (leftColumn ?? 36) - (centerColumn ?? 25), 15)
  const centerImageDoc = getPanelImage(centerImage)

  return (
    <section className={containerWidthClasses[containerWidth ?? 'full']}>
      <div
        className="grid overflow-hidden md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] xl:grid-cols-[var(--three-panel-left)_var(--three-panel-center)_var(--three-panel-right)]"
        style={
          {
            '--three-panel-center': `${centerColumn ?? 25}%`,
            '--three-panel-height': `${height ?? 310}px`,
            '--three-panel-left': `${leftColumn ?? 36}%`,
            '--three-panel-mobile-height': `${mobilePanelHeight ?? 260}px`,
            '--three-panel-right': `${rightColumn}%`,
          } as React.CSSProperties
        }
      >
        <PanelImage
          className="md:order-1 md:row-span-2 md:min-h-[var(--three-panel-height)] xl:order-none xl:row-auto"
          image={getPanelImage(leftImage)}
          label="Left image"
        />

        <div
          className="relative isolate flex min-h-[var(--three-panel-mobile-height)] items-center overflow-hidden px-7 py-8 md:order-2 md:min-h-0 md:justify-start md:text-left xl:order-none xl:min-h-[var(--three-panel-height)]"
          style={{
            padding: contentPadding ?? 38,
          }}
        >
          {centerImageDoc ? (
            <Media
              fill
              imgClassName="object-cover object-center"
              pictureClassName="absolute inset-0 -z-20"
              resource={centerImageDoc}
              size="(max-width: 768px) 100vw, 28vw"
            />
          ) : null}

          <div className="w-full">
            <h2
              className={cn(
                'text-[length:var(--three-panel-title-font-size-mobile)] md:text-[length:var(--three-panel-title-font-size-desktop)]',
                textTransformClass(titleStyle?.textTransform),
                typographyFontWeightClasses[titleStyle?.fontWeight || 'black'],
                typographyLetterSpacingClasses[titleStyle?.letterSpacing || 'normal'],
              )}
              style={getTextStyle(
                titleStyle,
                {
                  color: '#a6bd17',
                  fontFamily: 'cinzel',
                  fontSizeDesktop: 26,
                  fontSizeMobile: 24,
                  fontStyle: 'normal',
                  lineHeight: 1,
                  maxWidth: 420,
                  verticalScale: 'normal',
                },
                'three-panel-title',
              )}
            >
              {title}
            </h2>

            <p
              className={cn(
                'mt-5 whitespace-pre-line text-[length:var(--three-panel-body-font-size-mobile)] md:text-[length:var(--three-panel-body-font-size-desktop)]',
                textTransformClass(bodyStyle?.textTransform),
                typographyFontWeightClasses[bodyStyle?.fontWeight || 'regular'],
                typographyLetterSpacingClasses[bodyStyle?.letterSpacing || 'tight'],
              )}
              style={getTextStyle(
                bodyStyle,
                {
                  color: '#f4f0dc',
                  fontFamily: 'geistSans',
                  fontSizeDesktop: 15,
                  fontSizeMobile: 14,
                  fontStyle: 'normal',
                  lineHeight: 1.45,
                  maxWidth: 420,
                  verticalScale: 'normal',
                },
                'three-panel-body',
              )}
            >
              {body}
            </p>
          </div>
        </div>

        <PanelImage
          className="md:order-3 md:col-start-2 md:min-h-[calc(var(--three-panel-height)*0.58)] xl:order-none xl:col-auto"
          image={getPanelImage(rightImage)}
          label="Right image"
        />
      </div>
    </section>
  )
}
