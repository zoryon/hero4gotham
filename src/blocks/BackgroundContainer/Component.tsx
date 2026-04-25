import React from 'react'

import type { BackgroundContainerBlock as BackgroundContainerBlockProps } from '@/payload-types'

import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'
import { RenderBlocks } from '@/blocks/RenderBlocks'

const overlayClasses = {
  light: 'bg-zinc-950/30',
  medium: 'bg-zinc-950/50',
  none: 'bg-transparent',
  strong: 'bg-zinc-950/70',
}

const paddingClasses = {
  large: 'py-20 md:py-28',
  medium: 'py-12 md:py-20',
  small: 'py-8 md:py-12',
}

export const BackgroundContainerBlock: React.FC<BackgroundContainerBlockProps> = ({
  backgroundImage,
  blocks,
  overlay = 'medium',
  padding = 'medium',
  width = 'full',
}) => {
  return (
    <section className={cn(width === 'contained' && 'container')}>
      <div
        className={cn(
          'relative isolate overflow-hidden text-white',
          width === 'contained' && 'rounded border border-border',
          paddingClasses[padding || 'medium'],
        )}
      >
        {backgroundImage && typeof backgroundImage === 'object' ? (
          <Media
            fill
            imgClassName="object-cover"
            pictureClassName="absolute inset-0 -z-20"
            resource={backgroundImage}
          />
        ) : null}

        <div
          aria-hidden
          className={cn('pointer-events-none absolute inset-0 -z-10', overlayClasses[overlay || 'medium'])}
        />

        <RenderBlocks blocks={blocks || []} wrapperClassName="my-8 first:mt-0 last:mb-0" />
      </div>
    </section>
  )
}
