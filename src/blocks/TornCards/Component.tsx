import React from 'react'

import type { TornCardsBlock as TornCardsBlockProps } from '@/payload-types'

import { Media } from '@/components/Media'
import { typographyFontFamilyStyles, typographyFontWeightClasses } from '@/fields/typography'
import { cn } from '@/utilities/ui'

type TornCardItem = NonNullable<TornCardsBlockProps['items']>[number]
type ResponsiveLayout = NonNullable<TornCardsBlockProps['responsive']>

const EDGE_WIDTH = 1000
const EDGE_HEIGHT = 72

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

function seededRand(seed: number) {
  let s = seed

  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

function buildTornPath(width: number, seed: number, facingUp: boolean): string {
  const rand = seededRand(seed)
  const segments = 36
  const points: [number, number][] = []

  points.push([0, 0])
  for (let i = 1; i < segments; i++) {
    const x = (width / segments) * i + (rand() - 0.5) * 16
    const base = (rand() - 0.5) * 20
    const spike = rand() > 0.82 ? (rand() - 0.5) * 28 : 0
    points.push([x, base + spike])
  }
  points.push([width, 0])

  let d = `M ${points[0][0]} ${points[0][1]}`
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1]
    const curr = points[i]
    const mx = (prev[0] + curr[0]) / 2
    const my = (prev[1] + curr[1]) / 2
    d += ` Q ${prev[0]} ${prev[1]} ${mx} ${my}`
  }

  const closeY = facingUp ? -EDGE_HEIGHT : EDGE_HEIGHT
  d += ` L ${points[points.length - 1][0]} ${points[points.length - 1][1]}`
  d += ` L ${width} ${closeY} L 0 ${closeY} Z`

  return d
}

function buildVerticalTornPath(height: number, seed: number, facingLeft: boolean): string {
  const rand = seededRand(seed)
  const segments = 32
  const points: [number, number][] = []

  points.push([0, 0])
  for (let i = 1; i < segments; i++) {
    const y = (height / segments) * i + (rand() - 0.5) * 16
    const base = (rand() - 0.5) * 20
    const spike = rand() > 0.82 ? (rand() - 0.5) * 28 : 0
    points.push([base + spike, y])
  }
  points.push([0, height])

  let d = `M ${points[0][0]} ${points[0][1]}`
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1]
    const curr = points[i]
    const mx = (prev[0] + curr[0]) / 2
    const my = (prev[1] + curr[1]) / 2
    d += ` Q ${prev[0]} ${prev[1]} ${mx} ${my}`
  }

  const closeX = facingLeft ? -EDGE_HEIGHT : EDGE_HEIGHT
  d += ` L ${points[points.length - 1][0]} ${points[points.length - 1][1]}`
  d += ` L ${closeX} ${height} L ${closeX} 0 Z`

  return d
}

const TornEdge: React.FC<{
  className?: string
  direction: 'bottom' | 'left' | 'right' | 'top'
  seed: number
}> = ({ className, direction, seed }) => {
  const isVertical = direction === 'left' || direction === 'right'
  const mainPath = isVertical
    ? buildVerticalTornPath(EDGE_WIDTH, seed, direction === 'right')
    : buildTornPath(EDGE_WIDTH, seed, direction === 'bottom')
  const shadowPath = isVertical
    ? buildVerticalTornPath(EDGE_WIDTH, seed + 1, direction === 'right')
    : buildTornPath(EDGE_WIDTH, seed + 1, direction === 'bottom')

  return (
    <svg
      aria-hidden
      className={cn('pointer-events-none absolute z-20 overflow-visible', className)}
      preserveAspectRatio="none"
      viewBox={isVertical ? `0 0 ${EDGE_HEIGHT} ${EDGE_WIDTH}` : `0 0 ${EDGE_WIDTH} ${EDGE_HEIGHT}`}
    >
      <path d={shadowPath} fill="var(--torn-shadow-color)" opacity={0.42} />
      <path d={mainPath} fill="var(--torn-card-bg)" />
    </svg>
  )
}

const getSetting = (
  responsive: ResponsiveLayout | null | undefined,
  breakpoint: keyof ResponsiveLayout,
  key: 'columns' | 'minHeight' | 'rows',
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

const TornCard: React.FC<{
  item: TornCardItem
  index: number
}> = ({ item, index }) => {
  const hasImage = Boolean(item.image && typeof item.image === 'object')
  const titleTypography = item.titleType
  const descriptionTypography = item.descType

  return (
    <article
      className="torn-card relative isolate flex flex-col items-center justify-center overflow-hidden border-2 border-[color:var(--torn-border-color)] text-center"
      style={getCardSpacingStyle(item)}
    >
      <TornEdge className="-top-px left-0 h-8 w-full" direction="top" seed={index * 53 + 71} />
      <TornEdge
        className="-bottom-px left-0 h-8 w-full"
        direction="bottom"
        seed={index * 97 + 13}
      />
      <TornEdge className="bottom-0 -left-px h-full w-8" direction="left" seed={index * 31 + 19} />
      <TornEdge
        className="bottom-0 -right-px h-full w-8"
        direction="right"
        seed={index * 41 + 29}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-30 border border-[color:var(--torn-border-color)]"
      />

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
  accentColor = '#8d2c8c',
  borderColor = '#6b4635',
  cardBg = '#221429',
  fillDirection = 'row',
  items,
  responsive,
  shadowColor = '#0a0704',
  textColor = '#d9d0c2',
  titleColor = '#e8d5a0',
}) => {
  const cards = items || []

  if (!cards.length) return null

  const mobileColumns = getSetting(responsive, 'mobile', 'columns', 1)
  const tabletColumns = getSetting(responsive, 'tablet', 'columns', Math.min(2, cards.length))
  const desktopColumns = getSetting(responsive, 'desktop', 'columns', Math.min(4, cards.length))

  return (
    <section
      className={cn(
        'torn-grid grid w-full',
        fillDirection === 'column' && 'torn-grid--flow-column',
      )}
      style={
        {
          '--torn-accent-color': accentColor || '#8d2c8c',
          '--torn-border-color': borderColor || '#6b4635',
          '--torn-card-bg': cardBg || '#1f1428',
          '--torn-cols-desktop': desktopColumns,
          '--torn-cols-mobile': mobileColumns,
          '--torn-cols-tablet': tabletColumns,
          '--torn-min-h-desktop': `${getSetting(responsive, 'desktop', 'minHeight', 210)}px`,
          '--torn-min-h-mobile': `${getSetting(responsive, 'mobile', 'minHeight', 210)}px`,
          '--torn-min-h-tablet': `${getSetting(responsive, 'tablet', 'minHeight', 220)}px`,
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
          '--torn-shadow-color': shadowColor || '#0a0704',
          '--torn-text-color': textColor || '#d9d0c2',
          '--torn-title-color': titleColor || '#e8d5a0',
        } as React.CSSProperties
      }
    >
      {cards.map((item, index) => (
        <TornCard index={index} item={item} key={item.id || index} />
      ))}
    </section>
  )
}
