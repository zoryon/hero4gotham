import React from 'react'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

type ArrowProps = {
  className?: string
  variant?: 'chevron' | 'arrow' | 'doubleChevron' | null
  direction?: 'down' | 'up' | 'left' | 'right' | null
  align?: 'left' | 'center' | 'right' | null
  animation?: 'none' | 'bounce' | 'pulse' | null
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'custom' | null
  customWidth?: number | null
  customHeight?: number | null
  strokeWidth?: number | null
  roundedEnds?: boolean | null
  colorMode?: 'theme' | 'custom' | null
  themeColor?: 'primary' | 'secondary' | 'accent' | 'muted' | 'white' | 'black' | 'success' | null
  customColor?: string | null
  backgroundStyle?: 'none' | 'soft' | 'solid' | null
  backgroundColor?: string | null
  showGlow?: boolean | null
  glowColor?: string | null
  image?: unknown
  label?: string | null
  description?: string | null
  ariaLabel?: string | null
  enableLink?: boolean | null
  link?: {
    newTab?: boolean | null
    reference?: {
      relationTo: 'pages' | 'posts'
      value: unknown
    } | null
    type?: 'custom' | 'reference' | null
    url?: string | null
  } | null
}

const sizeMap = {
  lg: {
    height: 110,
    width: 110,
  },
  md: {
    height: 88,
    width: 88,
  },
  sm: {
    height: 64,
    width: 64,
  },
  xl: {
    height: 136,
    width: 136,
  },
} as const

const rotationMap = {
  down: 0,
  left: 90,
  right: -90,
  up: 180,
} as const

const alignClasses = {
  center: 'items-center text-center',
  left: 'items-start text-left',
  right: 'items-end text-right',
} as const

const animationClasses = {
  bounce: 'motion-safe:animate-bounce',
  none: '',
  pulse: 'motion-safe:animate-pulse',
} as const

const themeColors = {
  accent: 'var(--theme-text-accent)',
  black: '#111111',
  muted: 'var(--theme-text-muted)',
  primary: 'var(--theme-text-primary)',
  secondary: 'var(--theme-text-secondary)',
  success: '#7dff2a',
  white: '#ffffff',
} as const

const renderArrowPaths = (variant: NonNullable<ArrowProps['variant']>) => {
  if (variant === 'arrow') {
    return (
      <>
        <line x1="50" x2="50" y1="13" y2="75" />
        <polyline points="28,57 50,73 72,57" />
      </>
    )
  }

  if (variant === 'doubleChevron') {
    return (
      <>
        <polyline points="18,31 50,51 82,31" />
        <polyline points="18,49 50,69 82,49" />
      </>
    )
  }

  return <polyline points="16,33 50,57 84,33" />
}

export const ArrowBlock: React.FC<ArrowProps> = ({
  className,
  variant = 'chevron',
  direction = 'down',
  align = 'center',
  animation = 'none',
  size = 'md',
  customWidth,
  customHeight,
  strokeWidth = 8,
  roundedEnds = true,
  colorMode = 'theme',
  themeColor = 'accent',
  customColor,
  backgroundStyle = 'none',
  backgroundColor,
  showGlow = true,
  glowColor,
  image,
  label,
  description,
  ariaLabel,
  enableLink,
  link,
}) => {
  const dimensions =
    size === 'custom'
      ? {
          height: Math.max(8, customHeight ?? 88),
          width: Math.max(8, customWidth ?? 88),
        }
      : sizeMap[size || 'md']

  const arrowColor =
    colorMode === 'custom' ? customColor || '#7dff2a' : themeColors[themeColor || 'accent']

  const arrowContainer = (
    <div
      className={cn(
        'inline-flex flex-col items-center justify-center gap-2',
        animationClasses[animation || 'none'],
      )}
      style={
        {
          '--arrow-bg': backgroundColor || 'rgba(125, 255, 42, 0.1)',
          '--arrow-color': arrowColor,
          '--arrow-glow': glowColor || 'rgba(125, 255, 42, 0.7)',
        } as React.CSSProperties
      }
    >
      <div
        className={cn(
          'inline-flex items-center justify-center',
          backgroundStyle === 'soft' &&
            'rounded-2xl bg-[var(--arrow-bg)] ring-1 ring-[color:var(--arrow-color)]/20',
          backgroundStyle === 'solid' && 'rounded-2xl bg-[var(--arrow-bg)]',
        )}
        style={{
          height: dimensions.height,
          padding:
            backgroundStyle === 'none' ? 0 : Math.max(8, Math.round(dimensions.width * 0.12)),
          width: dimensions.width,
        }}
      >
        {image && typeof image === 'object' ? (
          <Media
            className="h-full w-full"
            imgClassName="object-contain"
            resource={image as never}
          />
        ) : (
          <svg
            aria-label={ariaLabel || undefined}
            fill="none"
            role="img"
            style={{
              filter: showGlow
                ? 'drop-shadow(0 0 10px var(--arrow-glow)) drop-shadow(0 0 18px var(--arrow-glow))'
                : undefined,
              transform: `rotate(${rotationMap[direction || 'down']}deg)`,
            }}
            viewBox="0 0 100 100"
          >
            <g
              stroke="var(--arrow-color)"
              strokeLinejoin={roundedEnds ? 'round' : 'miter'}
              strokeLinecap={roundedEnds ? 'round' : 'butt'}
              strokeWidth={Math.max(1, strokeWidth ?? 8)}
            >
              {renderArrowPaths(variant || 'chevron')}
            </g>
          </svg>
        )}
      </div>

      {label ? (
        <span className="text-sm font-medium text-[color:var(--arrow-color)]">{label}</span>
      ) : null}
      {description ? (
        <p className="max-w-prose text-xs text-[color:var(--theme-text-secondary)]">
          {description}
        </p>
      ) : null}
    </div>
  )

  return (
    <section className={cn('container', className)}>
      <div className={cn('flex w-full', alignClasses[align || 'center'])}>
        {enableLink && link?.type ? (
          <CMSLink
            className="inline-flex"
            newTab={link.newTab}
            reference={link.reference as any}
            type={link.type}
            url={link.url}
          >
            {arrowContainer}
          </CMSLink>
        ) : (
          arrowContainer
        )}
      </div>
    </section>
  )
}
