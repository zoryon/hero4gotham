import React from 'react'

import type {
  TypographyDistress,
  TypographyFontFamily,
  TypographyFontWeight,
  TypographyLetterSpacing,
  TypographySubtitleFontSize,
  TypographyVerticalScale,
} from '@/fields/typography'

import {
  typographyDistressStyles,
  typographyFontFamilyStyles,
  typographyFontWeightClasses,
  typographyLetterSpacingClasses,
  typographySubtitleFontSizeClasses,
  typographyVerticalScaleValues,
} from '@/fields/typography'
import { cn } from '@/utilities/ui'

export type SubtitleProps = {
  className?: string
  text?: string
  align?: 'left' | 'center'
  fontSize?: TypographySubtitleFontSize | null
  fontWeight?: TypographyFontWeight | null
  fontFamily?: TypographyFontFamily | null
  verticalScale?: TypographyVerticalScale | null
  distress?: TypographyDistress | null
  textTransform?: 'normal' | 'uppercase' | null
  letterSpacing?: TypographyLetterSpacing | null
  lineBreaks?: {
    word?: string
    occurrences?: number | null
    breaks?: number | null
    id?: string | null
  }[] | null
}

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

const renderSubtitle = (text: string, lineBreaks?: SubtitleProps['lineBreaks']) => {
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

export const SubtitleBlock: React.FC<SubtitleProps> = ({
  className,
  text = 'Nel nostro caos',
  align = 'center',
  fontSize = 'base',
  fontWeight = 'regular',
  fontFamily = 'geistSans',
  verticalScale = 'normal',
  distress = 'none',
  textTransform = 'uppercase',
  letterSpacing = 'wide',
  lineBreaks,
}) => {
  const isCentered = align === 'center'
  const resolvedVerticalScale = verticalScale ?? 'normal'
  const resolvedDistress = distress ?? 'none'

  return (
    <section className={cn('container', isCentered ? 'text-center' : 'text-left', className)}>
      <p
        className={cn(
          'leading-snug origin-center',
          (textTransform ?? 'uppercase') === 'uppercase' ? 'uppercase' : undefined,
          typographySubtitleFontSizeClasses[fontSize ?? 'base'],
          typographyFontWeightClasses[fontWeight ?? 'regular'],
          typographyLetterSpacingClasses[letterSpacing ?? 'wide'],
          resolvedVerticalScale === 'normal' ? undefined : 'inline-block',
        )}
        style={{
          color: 'var(--theme-text-secondary)',
          fontFamily: typographyFontFamilyStyles[fontFamily ?? 'geistSans'],
          transform: `scaleY(${typographyVerticalScaleValues[resolvedVerticalScale]})`,
          ...typographyDistressStyles[resolvedDistress],
        }}
      >
        {renderSubtitle(text, lineBreaks)}
      </p>
    </section>
  )
}
