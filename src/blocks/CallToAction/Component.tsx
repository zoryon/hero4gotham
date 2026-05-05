import React from 'react'

import type { CallToActionBlock as CTABlockProps } from '@/payload-types'

import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { typographyFontFamilyStyles, typographyVerticalScaleValues } from '@/fields/typography'
import { formatTextTransform, richTextTransformClass, textTransformClass } from '@/fields/uiOptions'
import { cn } from '@/utilities/ui'

export const CallToActionBlock: React.FC<CTABlockProps> = ({
  backgroundImage,
  borderStyle = 'default',
  colors,
  links,
  richText,
  spacing,
  typography,
}) => {
  const hasBackgroundImage = Boolean(backgroundImage && typeof backgroundImage === 'object')

  const gapClasses = {
    lg: 'gap-12',
    md: 'gap-8',
    none: 'gap-0',
    sm: 'gap-5',
    xl: 'gap-16',
    xs: 'gap-3',
  }

  const paddingTopClasses = {
    lg: 'pt-12',
    md: 'pt-8',
    none: 'pt-0',
    sm: 'pt-4',
    xl: 'pt-16',
    xs: 'pt-2',
  }

  const paddingRightClasses = {
    lg: 'pr-12',
    md: 'pr-8',
    none: 'pr-0',
    sm: 'pr-4',
    xl: 'pr-16',
    xs: 'pr-2',
  }

  const paddingBottomClasses = {
    lg: 'pb-12',
    md: 'pb-8',
    none: 'pb-0',
    sm: 'pb-4',
    xl: 'pb-16',
    xs: 'pb-2',
  }

  const paddingLeftClasses = {
    lg: 'pl-12',
    md: 'pl-8',
    none: 'pl-0',
    sm: 'pl-4',
    xl: 'pl-16',
    xs: 'pl-2',
  }

  const marginTopClasses = {
    lg: 'mt-12',
    md: 'mt-8',
    none: 'mt-0',
    sm: 'mt-4',
    xl: 'mt-16',
    xs: 'mt-2',
  }

  const marginRightClasses = {
    lg: 'mr-12',
    md: 'mr-8',
    none: 'mr-0',
    sm: 'mr-4',
    xl: 'mr-16',
    xs: 'mr-2',
  }

  const marginBottomClasses = {
    lg: 'mb-12',
    md: 'mb-8',
    none: 'mb-0',
    sm: 'mb-4',
    xl: 'mb-16',
    xs: 'mb-2',
  }

  const marginLeftClasses = {
    lg: 'ml-12',
    md: 'ml-8',
    none: 'ml-0',
    sm: 'ml-4',
    xl: 'ml-16',
    xs: 'ml-2',
  }

  const textSizeClasses = {
    base: '[&_p]:text-base [&_li]:text-base [&_h1]:text-4xl [&_h2]:text-3xl [&_h3]:text-2xl [&_h4]:text-xl',
    large:
      '[&_p]:text-lg [&_li]:text-lg [&_h1]:text-5xl [&_h2]:text-4xl [&_h3]:text-3xl [&_h4]:text-2xl',
    lead: '[&_p]:text-xl [&_li]:text-xl [&_h1]:text-6xl [&_h2]:text-5xl [&_h3]:text-4xl [&_h4]:text-3xl',
    small:
      '[&_p]:text-sm [&_li]:text-sm [&_h1]:text-3xl [&_h2]:text-2xl [&_h3]:text-xl [&_h4]:text-lg',
  }

  const textWeightClasses = {
    black: '[&_*]:font-black',
    bold: '[&_*]:font-bold',
    medium: '[&_*]:font-medium',
    regular: '[&_*]:font-normal',
    semibold: '[&_*]:font-semibold',
  }

  const letterSpacingClasses = {
    normal: '[&_*]:tracking-[0.1em]',
    poster: '[&_*]:tracking-[0.45em]',
    tight: '[&_*]:tracking-[0.04em]',
    wide: '[&_*]:tracking-[0.22em]',
    wider: '[&_*]:tracking-[0.32em]',
  }

  const selectedFontFamily = typographyFontFamilyStyles[typography?.fontFamily || 'geistSans']

  const colorValues = {
    accent: 'var(--theme-text-accent)',
    black: '#000',
    default: hasBackgroundImage ? '#fff' : 'var(--theme-text-primary)',
    green: 'var(--theme-text-green)',
    muted: 'var(--theme-text-muted)',
    primary: 'var(--theme-text-primary)',
    secondary: 'var(--theme-text-secondary)',
    white: '#fff',
  }
  const selectedTextColor = colorValues[colors?.textColor || 'default']
  const selectedButtonTextColor =
    colors?.buttonTextColor === 'default'
      ? undefined
      : colorValues[colors?.buttonTextColor || 'default']
  const resolvedVerticalScale = typography?.verticalScale || 'normal'
  const resolvedButtonVerticalScale = typography?.buttonVerticalScale || 'normal'

  const hasBorder = (borderStyle ?? 'default') !== 'none'

  return (
    <div className="w-full">
      <div
        className={cn(
          'relative isolate overflow-hidden flex flex-col md:flex-row md:justify-between md:items-center',
          hasBorder ? 'border border-border' : 'border-0',
          gapClasses[spacing?.gap || 'md'],
          paddingTopClasses[spacing?.paddingTop || 'sm'],
          paddingRightClasses[spacing?.paddingRight || 'sm'],
          paddingBottomClasses[spacing?.paddingBottom || 'sm'],
          paddingLeftClasses[spacing?.paddingLeft || 'sm'],
          hasBackgroundImage ? 'text-white' : undefined,
        )}
      >
        {hasBackgroundImage ? (
          <Media
            fill
            imgClassName="object-cover"
            pictureClassName="absolute inset-0 -z-20"
            resource={backgroundImage}
          />
        ) : null}

        <div
          className={cn(
            'max-w-[48rem] flex items-center',
            marginTopClasses[spacing?.marginTop || 'none'],
            marginRightClasses[spacing?.marginRight || 'none'],
            marginBottomClasses[spacing?.marginBottom || 'none'],
            marginLeftClasses[spacing?.marginLeft || 'none'],
          )}
        >
          {richText && (
            <div
              className={cn(
                'cta-rich-text-shell origin-center',
                resolvedVerticalScale === 'normal' ? undefined : 'inline-block',
              )}
              style={
                {
                  '--cta-font-family': selectedFontFamily,
                  '--cta-text-color': selectedTextColor,
                  color: selectedTextColor,
                  fontFamily: selectedFontFamily,
                  transform: `scaleY(${typographyVerticalScaleValues[resolvedVerticalScale]})`,
                } as React.CSSProperties
              }
            >
              <RichText
                className={cn(
                  'mb-0 cta-rich-text',
                  textSizeClasses[typography?.fontSize || 'base'],
                  textWeightClasses[typography?.fontWeight || 'regular'],
                  letterSpacingClasses[typography?.letterSpacing || 'normal'],
                  richTextTransformClass(typography?.textTransform),
                )}
                data={richText}
                enableGutter={false}
              />
            </div>
          )}
        </div>
        <div className={cn('cta-actions flex flex-col', gapClasses[spacing?.actionsGap || 'md'])}>
          {(links || []).map(({ link }, i) => {
            const { label, ...linkProps } = link

            return (
              <span
                className="cta-action-shell inline-flex"
                key={i}
                style={
                  {
                    '--cta-button-text-color': selectedButtonTextColor,
                    color: selectedButtonTextColor,
                    '--cta-button-text-scale':
                      typographyVerticalScaleValues[resolvedButtonVerticalScale],
                  } as React.CSSProperties
                }
              >
                <CMSLink className="cta-action-link" label={undefined} size="lg" {...linkProps}>
                  {label ? (
                    <span
                      className={cn(
                        'cta-action-label',
                        textTransformClass(typography?.textTransform),
                      )}
                    >
                      {formatTextTransform(label, typography?.textTransform)}
                    </span>
                  ) : null}
                </CMSLink>
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}
