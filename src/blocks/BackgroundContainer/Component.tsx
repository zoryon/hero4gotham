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

type BackgroundImageResource =
  | BackgroundContainerBlockProps['backgroundImage']
  | BackgroundContainerBlockProps['bgMob']
  | BackgroundContainerBlockProps['bgTab']

const getImageResource = (image?: BackgroundImageResource | null) =>
  image && typeof image === 'object' ? image : null

export const BackgroundContainerBlock: React.FC<BackgroundContainerProps> = ({
  backgroundImage,
  bgMob,
  bgTab,
  blocks,
  imagePositionDesktop = 'center',
  imagePositionMobile = 'center',
  imagePositionTablet = 'center',
  imageQuality = 95,
  isFirstPageBlock = false,
  overlay = 'medium',
  padding = 'medium',
}) => {
  const desktopImage = getImageResource(backgroundImage)
  const tabletImage = getImageResource(bgTab) || desktopImage
  const mobileImage = getImageResource(bgMob) || tabletImage || desktopImage

  return (
    <section className="w-full">
      <div
        className={cn(
          'background-container relative isolate min-h-[100svh] overflow-hidden text-white',
          isFirstPageBlock && 'background-container--under-header',
          paddingClasses[padding || 'medium'],
        )}
        style={
          {
            backgroundColor: 'var(--theme-background-container-overflow, #050505)',
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
        {mobileImage ? (
          <Media
            fill
            imgClassName="background-container__image background-container__image--mobile object-cover"
            pictureClassName="absolute left-1/2 top-0 -z-20 block h-[100svh] w-screen -translate-x-1/2 md:hidden"
            priority={isFirstPageBlock}
            quality={imageQuality || 95}
            resource={mobileImage}
            size="100vw"
          />
        ) : null}

        {tabletImage ? (
          <Media
            fill
            imgClassName="background-container__image background-container__image--tablet object-cover"
            pictureClassName="absolute left-1/2 top-0 -z-20 hidden h-[100svh] w-screen -translate-x-1/2 md:block lg:hidden"
            priority={isFirstPageBlock}
            quality={imageQuality || 95}
            resource={tabletImage}
            size="100vw"
          />
        ) : null}

        {desktopImage ? (
          <Media
            fill
            imgClassName="background-container__image background-container__image--desktop object-cover"
            pictureClassName="absolute left-1/2 top-0 -z-20 hidden h-[100svh] w-screen -translate-x-1/2 lg:block"
            priority={isFirstPageBlock}
            quality={imageQuality || 95}
            resource={desktopImage}
            size="100vw"
          />
        ) : null}

        <div
          aria-hidden
          className={cn(
            'pointer-events-none absolute left-1/2 top-0 -z-10 h-[100svh] w-screen -translate-x-1/2',
            overlayClasses[overlay || 'medium'],
          )}
        />

        <RenderBlocks blocks={blocks || []} wrapperClassName="my-8 first:mt-0 last:mb-0" />
      </div>
    </section>
  )
}
