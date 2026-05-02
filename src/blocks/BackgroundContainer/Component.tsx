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

const objectPositionValues = {
  bottom: 'center bottom',
  bottomLeft: 'left bottom',
  bottomRight: 'right bottom',
  center: 'center center',
  left: 'left center',
  right: 'right center',
  top: 'center top',
  topLeft: 'left top',
  topRight: 'right top',
} as const

type BackgroundContainerProps = BackgroundContainerBlockProps & {
  isFirstPageBlock?: boolean
}

export const BackgroundContainerBlock: React.FC<BackgroundContainerProps> = ({
  backgroundImage,
  blocks,
  imagePositionDesktop = 'center',
  imagePositionMobile = 'center',
  imagePositionTablet = 'center',
  imageQuality = 95,
  isFirstPageBlock = false,
  overlay = 'medium',
  padding = 'medium',
  width = 'full',
}) => {
  return (
    <section className={cn(width === 'contained' && 'container')}>
      <div
        className={cn(
          'background-container relative isolate overflow-hidden text-white',
          isFirstPageBlock && 'background-container--under-header',
          width === 'contained' && 'rounded border border-border',
          paddingClasses[padding || 'medium'],
        )}
        style={
          {
            '--background-container-image-position-desktop':
              objectPositionValues[
                (imagePositionDesktop || 'center') as keyof typeof objectPositionValues
              ],
            '--background-container-image-position-mobile':
              objectPositionValues[
                (imagePositionMobile || 'center') as keyof typeof objectPositionValues
              ],
            '--background-container-image-position-tablet':
              objectPositionValues[
                (imagePositionTablet || 'center') as keyof typeof objectPositionValues
              ],
          } as React.CSSProperties
        }
      >
        {backgroundImage && typeof backgroundImage === 'object' ? (
          <Media
            fill
            imgClassName="background-container__image object-cover"
            pictureClassName="absolute inset-0 -z-20"
            priority={isFirstPageBlock}
            quality={imageQuality || 95}
            resource={backgroundImage}
            size={
              width === 'contained'
                ? '(max-width: 767px) 100vw, (max-width: 1439px) 100vw, 1280px'
                : '100vw'
            }
          />
        ) : null}

        <div
          aria-hidden
          className={cn(
            'pointer-events-none absolute inset-0 -z-10',
            overlayClasses[overlay || 'medium'],
          )}
        />

        <RenderBlocks blocks={blocks || []} wrapperClassName="my-8 first:mt-0 last:mb-0" />
      </div>
    </section>
  )
}
