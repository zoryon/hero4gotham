import React from 'react'

import type { TornCardsBlock as TornCardsBlockProps } from '@/payload-types'

import { Media } from '@/components/Media'
import { typographyFontFamilyStyles, typographyFontWeightClasses } from '@/fields/typography'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { cn } from '@/utilities/ui'

type TornCardItem = NonNullable<TornCardsBlockProps['items']>[number]
type ResponsiveLayout = NonNullable<TornCardsBlockProps['responsive']>

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

const renderLineBreaks = (
  text: string,
  lineBreaks?: TornCardItem['descBreaks'] | null,
) => {
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

const getBackgroundImage = (
  image: TornCardsBlockProps['backgroundMobile'] | null | undefined,
  fallback: string,
) => {
  if (!image || typeof image !== 'object') return `url("${fallback}")`

  if (image.filename?.startsWith('grid-1x4')) {
    return 'url("/grid/grid-1x4.png")'
  }

  if (image.filename?.startsWith('grid-2x2')) {
    return 'url("/grid/grid-2x2.png")'
  }

  if (image.filename?.startsWith('grid-4x1')) {
    return 'url("/grid/grid-4x1.png")'
  }

  const url = getMediaUrl(image.url, image.updatedAt)
  if (!url) return `url("${fallback}")`

  return `url("${url.replace(/"/g, '\\"')}")`
}

const TornCard: React.FC<{
  item: TornCardItem
}> = ({ item }) => {
  const hasImage = Boolean(item.image && typeof item.image === 'object')
  const titleTypography = item.titleType
  const descriptionTypography = item.descType

  return (
    <article
      className="torn-card relative isolate flex flex-col items-center justify-center text-center"
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
              fontFamily:
                typographyFontFamilyStyles[descriptionTypography?.family || 'geistSans'],
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
  backgroundDesktop,
  backgroundMobile,
  backgroundTablet,
  fillDirection = 'row',
  items,
  responsive,
  textColor = '#d9d0c2',
  titleColor = '#e8d5a0',
}) => {
  const cards = items || []

  if (!cards.length) return null

  const mobileColumns = getSetting(responsive, 'mobile', 'columns', 1)
  const tabletColumns = getSetting(responsive, 'tablet', 'columns', Math.min(2, cards.length))
  const desktopColumns = getSetting(responsive, 'desktop', 'columns', Math.min(4, cards.length))
  const mobileBackground = backgroundMobile || backgroundTablet || backgroundDesktop
  const tabletBackground = backgroundTablet || backgroundDesktop || backgroundMobile
  const desktopBackground = backgroundDesktop || backgroundTablet || backgroundMobile

  return (
    <section
      className={cn(
        'torn-grid grid w-full',
        fillDirection === 'column' && 'torn-grid--flow-column',
      )}
      style={
        {
          '--torn-bg-desktop': getBackgroundImage(desktopBackground, '/grid/grid-4x1.png'),
          '--torn-bg-mobile': getBackgroundImage(mobileBackground, '/grid/grid-1x4.png'),
          '--torn-bg-tablet': getBackgroundImage(tabletBackground, '/grid/grid-2x2.png'),
          '--torn-cols-desktop': desktopColumns,
          '--torn-cols-mobile': mobileColumns,
          '--torn-cols-tablet': tabletColumns,
          '--torn-rows-desktop': getSetting(
            responsive,
            'desktop',
            'rows',
            Math.ceil(cards.length / desktopColumns),
          ),
          '--torn-rows-mobile': getSetting(
            responsive,
            'mobile',
            'rows',
            Math.ceil(cards.length / mobileColumns),
          ),
          '--torn-rows-tablet': getSetting(
            responsive,
            'tablet',
            'rows',
            Math.ceil(cards.length / tabletColumns),
          ),
          '--torn-text-color': textColor || '#d9d0c2',
          '--torn-title-color': titleColor || '#e8d5a0',
        } as React.CSSProperties
      }
    >
      {cards.map((item, index) => (
        <TornCard item={item} key={item.id || index} />
      ))}
    </section>
  )
}
