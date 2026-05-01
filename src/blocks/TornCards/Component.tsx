import React from 'react'

import type { Media as MediaDocument, TornCardsBlock as TornCardsBlockProps } from '@/payload-types'

import { Media } from '@/components/Media'
import {
  typographyFontFamilyStyles,
  typographyFontWeightClasses,
  typographyLetterSpacingClasses,
  typographyVerticalScaleValues,
} from '@/fields/typography'
import { cn } from '@/utilities/ui'

type TornCardItem = NonNullable<TornCardsBlockProps['items']>[number]
type ResponsiveLayout = NonNullable<TornCardsBlockProps['responsive']>
type TextStyle = TornCardsBlockProps['headingStyle']

const containerWidthClasses = {
  container: 'container',
  extraWide: 'mx-auto w-full max-w-[88rem] px-4 md:px-8',
  full: 'w-full',
  wide: 'mx-auto w-full max-w-7xl px-4 md:px-8',
} as const

const imageSizeClasses = {
  lg: 'h-24 w-24',
  md: 'h-20 w-20',
  sm: 'h-16 w-16',
}

const spacingValues = {
  lg: '3.5rem',
  md: '2.5rem',
  none: '0',
  sm: '1.5rem',
  xl: '5rem',
  xs: '0.75rem',
  xxs: '0.35rem',
} as const

const getSetting = (
  responsive: ResponsiveLayout | null | undefined,
  breakpoint: keyof ResponsiveLayout,
  key: 'columns' | 'rows',
  fallback: number,
) => {
  const value = responsive?.[breakpoint]?.[key]
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

const renderLineBreaks = (text: string, lineBreaks?: TornCardItem['descBreaks'] | null) => {
  const insertions = new Map<number, number>()

  lineBreaks?.forEach(({ word, occurrences, breaks }) => {
    const needle = word?.trim()

    if (!needle) return

    const matchLimit = occurrences == null ? 1 : clamp(occurrences, 0, 20)
    const breakCount = clamp(breaks ?? 1, 1, 5)
    const matcher = new RegExp(escapeRegExp(needle), 'gi')
    let applied = 0

    for (const match of text.matchAll(matcher)) {
      if (match.index == null) continue
      if (matchLimit > 0 && applied >= matchLimit) break

      const insertAt = match.index + match[0].length
      insertions.set(insertAt, Math.max(insertions.get(insertAt) ?? 0, breakCount))
      applied += 1
    }
  })

  if (!insertions.size) {
    return <span className="whitespace-pre-line">{text}</span>
  }

  const nodes: React.ReactNode[] = []
  let chunkStart = 0

  Array.from(insertions.entries())
    .sort(([left], [right]) => left - right)
    .forEach(([insertAt, breakCount], ruleIndex) => {
      nodes.push(text.slice(chunkStart, insertAt))

      for (let index = 0; index < breakCount; index += 1) {
        nodes.push(<br key={`${ruleIndex}-${index}`} />)
      }

      chunkStart = insertAt
    })

  nodes.push(text.slice(chunkStart))

  return <span className="whitespace-pre-line">{nodes}</span>
}

const getSpacingValue = (value: keyof typeof spacingValues | null | undefined) =>
  spacingValues[value || 'none']

const getMedia = (media: MediaDocument | number | null | undefined) =>
  media && typeof media === 'object' ? media : null

const textTransformClass = (value: string | null | undefined) =>
  value === 'uppercase' ? 'uppercase' : undefined

const getResponsiveFontSize = (mobile: number, desktop: number) => {
  if (mobile === desktop) return `${mobile}px`

  const min = Math.min(mobile, desktop)
  const max = Math.max(mobile, desktop)

  return `clamp(${min}px, calc(${mobile}px + ${desktop - mobile} * ((100vw - 360px) / 920)), ${max}px)`
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
    maxWidth: number
    verticalScale: keyof typeof typographyVerticalScaleValues
  },
): React.CSSProperties => {
  const fontSizeMobile = style?.fontSizeMobile ?? fallback.fontSizeMobile
  const fontSizeDesktop = style?.fontSizeDesktop ?? fallback.fontSizeDesktop

  return {
    color: style?.color || fallback.color,
    fontFamily:
      typographyFontFamilyStyles[
        (style?.fontFamily || fallback.fontFamily) as keyof typeof typographyFontFamilyStyles
      ],
    fontSize: getResponsiveFontSize(fontSizeMobile, fontSizeDesktop),
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
  }
}

const StyledText: React.FC<{
  as?: 'h2' | 'h3' | 'p' | 'span'
  children: React.ReactNode
  className?: string
  fallback: {
    color: string
    fontFamily: keyof typeof typographyFontFamilyStyles
    fontSizeDesktop: number
    fontSizeMobile: number
    fontStyle: 'italic' | 'normal'
    fontWeight: keyof typeof typographyFontWeightClasses
    letterSpacing: keyof typeof typographyLetterSpacingClasses
    lineHeight: number
    maxWidth: number
    textTransform: string
    verticalScale: keyof typeof typographyVerticalScaleValues
  }
  style?: React.CSSProperties
  styleConfig: TextStyle | null | undefined
}> = ({ as: Tag = 'span', children, className, fallback, style, styleConfig }) => (
  <Tag
    className={cn(
      textTransformClass(styleConfig?.textTransform || fallback.textTransform),
      typographyFontWeightClasses[
        (styleConfig?.fontWeight || fallback.fontWeight) as keyof typeof typographyFontWeightClasses
      ],
      typographyLetterSpacingClasses[
        (styleConfig?.letterSpacing ||
          fallback.letterSpacing) as keyof typeof typographyLetterSpacingClasses
      ],
      className,
    )}
    style={{
      ...getTextStyle(styleConfig, {
        color: fallback.color,
        fontFamily: fallback.fontFamily,
        fontSizeDesktop: fallback.fontSizeDesktop,
        fontSizeMobile: fallback.fontSizeMobile,
        fontStyle: fallback.fontStyle,
        lineHeight: fallback.lineHeight,
        maxWidth: fallback.maxWidth,
        verticalScale: fallback.verticalScale,
      }),
      ...style,
    }}
  >
    {children}
  </Tag>
)

const themeTextColorValues = {
  accent: 'var(--theme-text-accent)',
  green: 'var(--theme-text-green)',
  muted: 'var(--theme-text-muted)',
  primary: 'var(--theme-text-primary)',
  secondary: 'var(--theme-text-secondary)',
} as const

const resolveThemeColor = (
  mode: 'custom' | 'theme' | null | undefined,
  themeColor: keyof typeof themeTextColorValues | null | undefined,
  customColor: string | null | undefined,
  fallback: string,
) => (mode === 'theme' ? themeTextColorValues[themeColor || 'primary'] : customColor || fallback)

const getVerticalScaleStyle = (
  verticalScale: keyof typeof typographyVerticalScaleValues | null | undefined,
): React.CSSProperties => ({
  transform: `scaleY(${typographyVerticalScaleValues[verticalScale || 'normal']})`,
  transformOrigin: 'center',
})

const getCardSpacingStyle = (item: TornCardItem): React.CSSProperties => ({
  marginBottom: getSpacingValue(item.margin?.bottom),
  marginLeft: getSpacingValue(item.margin?.left),
  marginRight: getSpacingValue(item.margin?.right),
  marginTop: getSpacingValue(item.margin?.top),
  paddingBottom: getSpacingValue(item.padding?.bottom || 'sm'),
  paddingLeft: getSpacingValue(item.padding?.left || 'sm'),
  paddingRight: getSpacingValue(item.padding?.right || 'sm'),
  paddingTop: getSpacingValue(item.padding?.top || 'sm'),
})

const TornCard: React.FC<{
  item: TornCardItem
}> = ({ item }) => {
  const hasImage = Boolean(item.image && typeof item.image === 'object')
  const titleTypography = item.titleType
  const descriptionTypography = item.descType

  return (
    <article
      className={cn(
        'torn-card relative isolate flex flex-col items-center justify-center text-center',
        item.scribbleBorder && 'scribble-border',
      )}
      style={getCardSpacingStyle(item)}
    >
      <div className="relative z-40 flex max-w-72 flex-col items-center">
        {hasImage ? (
          <div
            className={cn('relative', imageSizeClasses[item.imageSize || 'md'])}
            style={{
              filter: 'saturate(1.45) contrast(1.08)',
              marginBottom: getSpacingValue(item.imageTitleGap || 'xs'),
            }}
          >
            <Media
              fill
              imgClassName="object-contain"
              pictureClassName="absolute inset-0"
              resource={item.image}
            />
          </div>
        ) : null}

        <h3
          className={cn(
            'uppercase tracking-[0.16em] text-[color:var(--torn-title-color)]',
            typographyFontWeightClasses[titleTypography?.weight || 'semibold'],
          )}
          style={{
            ...getVerticalScaleStyle(titleTypography?.verticalScale),
            fontFamily: typographyFontFamilyStyles[titleTypography?.family || 'cinzel'],
            fontSize: `${titleTypography?.size || 14}px`,
          }}
        >
          {item.title}
        </h3>
        {item.description ? (
          <p
            className={cn(
              'leading-relaxed text-[color:var(--torn-text-color)]',
              typographyFontWeightClasses[descriptionTypography?.weight || 'regular'],
            )}
            style={{
              ...getVerticalScaleStyle(descriptionTypography?.verticalScale),
              fontFamily: typographyFontFamilyStyles[descriptionTypography?.family || 'geistSans'],
              fontSize: `${descriptionTypography?.size || 12}px`,
              marginTop: getSpacingValue(item.titleDescriptionGap || 'xs'),
            }}
          >
            {renderLineBreaks(item.description, item.descBreaks)}
          </p>
        ) : null}
      </div>
    </article>
  )
}

export const TornCardsBlock: React.FC<TornCardsBlockProps> = ({
  containerWidth = 'wide',
  fillDirection = 'row',
  heading,
  headingBannerImage,
  headingPaddingX = 34,
  headingPaddingY = 8,
  headingStyle,
  items,
  responsive,
  textColor = '#d9d0c2',
  textColorMode = 'custom',
  textThemeColor = 'primary',
  titleColor = '#e8d5a0',
  titleColorMode = 'custom',
  titleThemeColor = 'secondary',
}) => {
  const cards = items || []

  if (!cards.length) return null

  const mobileColumns = getSetting(responsive, 'mobile', 'columns', 1)
  const tabletColumns = getSetting(responsive, 'tablet', 'columns', Math.min(2, cards.length))
  const laptopColumns = getSetting(responsive, 'laptop', 'columns', Math.min(3, cards.length))
  const desktopColumns = getSetting(responsive, 'desktop', 'columns', Math.min(4, cards.length))
  const mobileRows = getSetting(
    responsive,
    'mobile',
    'rows',
    Math.ceil(cards.length / mobileColumns),
  )
  const tabletRows = getSetting(
    responsive,
    'tablet',
    'rows',
    Math.ceil(cards.length / tabletColumns),
  )
  const laptopRows = getSetting(
    responsive,
    'laptop',
    'rows',
    Math.ceil(cards.length / laptopColumns),
  )
  const desktopRows = getSetting(
    responsive,
    'desktop',
    'rows',
    Math.ceil(cards.length / desktopColumns),
  )
  const headingImage = getMedia(headingBannerImage)
  const resolvedTextColor = resolveThemeColor(textColorMode, textThemeColor, textColor, '#d9d0c2')
  const resolvedTitleColor = resolveThemeColor(
    titleColorMode,
    titleThemeColor,
    titleColor,
    '#e8d5a0',
  )

  return (
    <div className={cn('relative', containerWidthClasses[containerWidth || 'wide'])}>
      {heading ? (
        <div className="absolute left-1/2 top-0 z-30 flex w-fit -translate-x-1/2 -translate-y-1/2 justify-center overflow-hidden">
          {headingImage ? (
            <Media
              fill
              imgClassName="object-cover object-center"
              pictureClassName="absolute inset-0 -z-10"
              resource={headingImage}
            />
          ) : null}
          <StyledText
            as="h2"
            className="relative"
            fallback={{
              color: '#1b1b1b',
              fontFamily: 'cinzel',
              fontSizeDesktop: 22,
              fontSizeMobile: 16,
              fontStyle: 'normal',
              fontWeight: 'black',
              letterSpacing: 'wide',
              lineHeight: 1,
              maxWidth: 720,
              textTransform: 'uppercase',
              verticalScale: 'normal',
            }}
            styleConfig={headingStyle}
            style={
              {
                paddingBlock: headingPaddingY,
                paddingInline: headingPaddingX,
              } as React.CSSProperties
            }
          >
            {heading}
          </StyledText>
        </div>
      ) : null}

      <section
        className={cn(
          'torn-grid torn-grid--generated grid',
          fillDirection === 'column' && 'torn-grid--flow-column',
        )}
        style={
          {
            '--torn-cols-desktop': desktopColumns,
            '--torn-cols-laptop': laptopColumns,
            '--torn-cols-mobile': mobileColumns,
            '--torn-cols-tablet': tabletColumns,
            '--torn-rows-desktop': desktopRows,
            '--torn-rows-laptop': laptopRows,
            '--torn-rows-mobile': mobileRows,
            '--torn-rows-tablet': tabletRows,
            '--torn-text-color': resolvedTextColor,
            '--torn-title-color': resolvedTitleColor,
          } as React.CSSProperties
        }
      >
        {cards.map((item, index) => (
          <TornCard item={item} key={item.id || index} />
        ))}
      </section>
    </div>
  )
}
