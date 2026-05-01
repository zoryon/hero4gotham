import React from 'react'

import type { Page, TextBackdropBlock as TextBackdropBlockProps } from '@/payload-types'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import type { BlockLayoutSettings } from '@/fields/blockLayout'
import { cn } from '@/utilities/ui'

type TextBackdropChild = Page['layout'][0] & { layout?: BlockLayoutSettings | null }

const alignClasses = {
  center: 'mx-auto',
  left: 'mr-auto',
  right: 'ml-auto',
}

const widthClasses = {
  container: 'container',
  content: 'w-full max-w-3xl',
  extraWide: 'w-full max-w-6xl',
  full: 'w-full',
  narrow: 'w-full max-w-2xl',
  wide: 'w-full max-w-5xl',
}

const paddingClasses = {
  loose: 'px-8 py-7 md:px-12 md:py-9',
  medium: 'px-6 py-5 md:px-10 md:py-7',
  tight: 'px-4 py-3 md:px-7 md:py-5',
}

const opacityByIntensity = {
  heavy: 0.86,
  light: 0.48,
  medium: 0.64,
  strong: 0.76,
}

const presetBackgrounds = {
  centerFog:
    'radial-gradient(ellipse at center, rgba(0,0,0,var(--backdrop-opacity)) 0%, rgba(0,0,0,calc(var(--backdrop-opacity) * 0.78)) 34%, rgba(0,0,0,calc(var(--backdrop-opacity) * 0.34)) 62%, rgba(0,0,0,0) 82%)',
  leftFog:
    'radial-gradient(ellipse at 32% 50%, rgba(0,0,0,var(--backdrop-opacity)) 0%, rgba(0,0,0,calc(var(--backdrop-opacity) * 0.82)) 36%, rgba(0,0,0,calc(var(--backdrop-opacity) * 0.36)) 64%, rgba(0,0,0,0) 86%)',
  rightFog:
    'radial-gradient(ellipse at 68% 50%, rgba(0,0,0,var(--backdrop-opacity)) 0%, rgba(0,0,0,calc(var(--backdrop-opacity) * 0.82)) 36%, rgba(0,0,0,calc(var(--backdrop-opacity) * 0.36)) 64%, rgba(0,0,0,0) 86%)',
  wideWash:
    'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,calc(var(--backdrop-opacity) * 0.72)) 16%, rgba(0,0,0,var(--backdrop-opacity)) 50%, rgba(0,0,0,calc(var(--backdrop-opacity) * 0.72)) 84%, rgba(0,0,0,0) 100%)',
}

export const TextBackdropBlock: React.FC<TextBackdropBlockProps> = ({
  align = 'left',
  blocks,
  customMaxWidth,
  intensity = 'strong',
  manualMargin,
  offsetX = 0,
  offsetY = 0,
  padding = 'medium',
  preset = 'leftFog',
  width = 'content',
}) => {
  if (!blocks?.length) return null

  const resolvedCustomMaxWidth =
    typeof customMaxWidth === 'number' && customMaxWidth > 0 ? customMaxWidth : undefined
  const resolvedMarginLeft =
    typeof manualMargin?.left === 'number' && manualMargin.left !== 0
      ? manualMargin.left
      : undefined
  const resolvedMarginRight =
    typeof manualMargin?.right === 'number' && manualMargin.right !== 0
      ? manualMargin.right
      : undefined

  return (
    <section className={cn(width === 'container' ? undefined : 'container')}>
      <div
        className={cn(
          'relative isolate overflow-visible',
          widthClasses[width ?? 'content'],
          alignClasses[align ?? 'left'],
          paddingClasses[padding ?? 'medium'],
        )}
        style={
          {
            '--backdrop-offset-x': `${offsetX ?? 0}px`,
            '--backdrop-offset-y': `${offsetY ?? 0}px`,
            '--backdrop-opacity': opacityByIntensity[intensity ?? 'strong'],
            marginBottom: manualMargin?.bottom ?? 0,
            marginLeft: resolvedMarginLeft,
            marginRight: resolvedMarginRight,
            marginTop: manualMargin?.top ?? 0,
            maxWidth: resolvedCustomMaxWidth,
          } as React.CSSProperties
        }
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-x-12 -inset-y-8 -z-10 blur-2xl md:-inset-x-20 md:-inset-y-12"
          style={{
            background: presetBackgrounds[preset ?? 'leftFog'],
            transform: 'translate(var(--backdrop-offset-x), var(--backdrop-offset-y))',
          }}
        />

        <RenderBlocks
          blocks={blocks as TextBackdropChild[]}
          wrapperClassName="my-2 first:mt-0 last:mb-0"
        />
      </div>
    </section>
  )
}
