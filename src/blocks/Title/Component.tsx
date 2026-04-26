import React from 'react'

import {
  typographyDistressStyles,
  typographyFontFamilyStyles,
  typographyFontSizeClasses,
  typographyVerticalScaleValues,
  typographyFontWeightClasses,
  type TypographyDistress,
  type TypographyFontFamily,
  type TypographyFontSize,
  type TypographyVerticalScale,
  type TypographyFontWeight,
} from '@/fields/typography'
import { cn } from '@/utilities/ui'

export type TitleProps = {
  className?: string
  title?: string
  align?: 'left' | 'center'
  fontSize?: TypographyFontSize | null
  fontWeight?: TypographyFontWeight | null
  fontFamily?: TypographyFontFamily | null
  verticalScale?: TypographyVerticalScale | null
  distress?: TypographyDistress | null
  margin?: {
    top?: number | null
    right?: number | null
    bottom?: number | null
    left?: number | null
  } | null
  lineBreaks?:
    | {
        word?: string
        occurrences?: number | null
        breaks?: number | null
        id?: string | null
      }[]
    | null
}

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

const renderTitle = (title: string, lineBreaks?: TitleProps['lineBreaks']) => {
  const insertions = new Map<number, number>()

  lineBreaks?.forEach(({ word, occurrences, breaks }) => {
    const needle = word?.trim()

    if (!needle) return

    const matchLimit = occurrences == null ? 1 : clamp(occurrences, 0, 20)
    const breakCount = clamp(breaks ?? 1, 1, 5)
    const matcher = new RegExp(escapeRegExp(needle), 'gi')
    let applied = 0

    for (const match of title.matchAll(matcher)) {
      if (match.index == null) continue
      if (matchLimit > 0 && applied >= matchLimit) break

      const insertAt = match.index + match[0].length
      insertions.set(insertAt, Math.max(insertions.get(insertAt) ?? 0, breakCount))
      applied += 1
    }
  })

  if (!insertions.size) {
    return <span className="whitespace-pre-line">{title}</span>
  }

  const nodes: React.ReactNode[] = []
  let chunkStart = 0

  Array.from(insertions.entries())
    .sort(([left], [right]) => left - right)
    .forEach(([insertAt, breakCount], ruleIndex) => {
      nodes.push(title.slice(chunkStart, insertAt))

      for (let index = 0; index < breakCount; index += 1) {
        nodes.push(<br key={`${ruleIndex}-${index}`} />)
      }

      chunkStart = insertAt
    })

  nodes.push(title.slice(chunkStart))

  return <span className="whitespace-pre-line">{nodes}</span>
}

export const TitleBlock: React.FC<TitleProps> = ({
  className,
  title = 'Benvenuti nel nostro caos',
  align = 'center',
  fontSize = 'hero',
  fontWeight = 'regular',
  fontFamily = 'cinzel',
  verticalScale = 'normal',
  distress = 'none',
  margin,
  lineBreaks,
}) => {
  const isCentered = align === 'center'
  const resolvedVerticalScale = verticalScale ?? 'normal'
  const resolvedDistress = distress ?? 'none'

  return (
    <section className={cn('container', className)}>
      <div className="relative isolate overflow-visible">
        <div className={cn('relative z-10', isCentered ? 'text-center' : 'text-left')}>
          <h2
            className={cn(
              'uppercase leading-[0.95] tracking-[0.04em] origin-center',
              typographyFontSizeClasses[fontSize ?? 'hero'],
              typographyFontWeightClasses[fontWeight ?? 'regular'],
              resolvedVerticalScale === 'normal' ? undefined : 'inline-block',
            )}
            style={{
              color: 'color-mix(in srgb, var(--theme-text-primary) 78%, #a1a1aa)',
              fontFamily: typographyFontFamilyStyles[fontFamily ?? 'cinzel'],
              marginBottom: margin?.bottom ?? 0,
              marginLeft: margin?.left ?? 0,
              marginRight: margin?.right ?? 0,
              marginTop: margin?.top ?? 0,
              transform: `scaleY(${typographyVerticalScaleValues[resolvedVerticalScale]})`,
              textShadow: '0 2px 0 rgba(0,0,0,0.35), 0 10px 24px rgba(0,0,0,0.45)',
              ...typographyDistressStyles[resolvedDistress],
            }}
          >
            {renderTitle(title, lineBreaks)}
          </h2>
        </div>
      </div>
    </section>
  )
}
