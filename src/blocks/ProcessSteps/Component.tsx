import React from 'react'

import type {
  Media as MediaDocument,
  ProcessStepsBlock as ProcessStepsBlockProps,
} from '@/payload-types'

import { Media } from '@/components/Media'
import {
  typographyFontFamilyStyles,
  typographyFontWeightClasses,
  typographyLetterSpacingClasses,
  typographyVerticalScaleValues,
} from '@/fields/typography'
import { formatTextTransform, textTransformClass } from '@/fields/uiOptions'
import { cn } from '@/utilities/ui'

type TextStyle = NonNullable<ProcessStepsBlockProps['headingStyle']>

const getImage = (image: MediaDocument | number | null | undefined) =>
  image && typeof image === 'object' ? image : null

const getTextStyle = (
  style: TextStyle | null | undefined,
  fallback: {
    color: string
    fontFamily: keyof typeof typographyFontFamilyStyles
    fontSizeDesktop: number
    fontSizeMobile: number
    fontStyle: 'italic' | 'normal'
    lineHeight: number
    verticalScale: keyof typeof typographyVerticalScaleValues
  },
  prefix: string,
): React.CSSProperties =>
  ({
    [`--${prefix}-font-size-mobile`]: `${style?.fontSizeMobile ?? fallback.fontSizeMobile}px`,
    [`--${prefix}-font-size-desktop`]: `${style?.fontSizeDesktop ?? fallback.fontSizeDesktop}px`,
    color: style?.color || fallback.color,
    fontFamily:
      typographyFontFamilyStyles[
        (style?.fontFamily || fallback.fontFamily) as keyof typeof typographyFontFamilyStyles
      ],
    fontStyle: style?.fontStyle === 'italic' ? 'italic' : fallback.fontStyle,
    lineHeight: style?.lineHeight ?? fallback.lineHeight,
    transform: `scaleY(${
      typographyVerticalScaleValues[
        (style?.verticalScale ||
          fallback.verticalScale) as keyof typeof typographyVerticalScaleValues
      ]
    })`,
    transformOrigin: 'center',
  }) as React.CSSProperties

const StepArrow: React.FC<{ className?: string; index: number }> = ({ className, index }) => {
  const flip = index % 2 === 1

  return (
    <svg
      aria-hidden
      className={cn('process-steps-arrow pointer-events-none', className)}
      fill="none"
      preserveAspectRatio="none"
      viewBox="0 0 168 54"
    >
      <path
        className={cn(flip && '-scale-y-100 origin-center')}
        d="M4 31 C 26 9, 44 52, 70 30 S 111 10, 151 27"
        stroke="var(--process-steps-arrow-color)"
        strokeDasharray="8 10"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
      />
      <path
        className={cn(flip && '-scale-y-100 origin-center')}
        d="M146 18 L160 28 L144 35"
        stroke="var(--process-steps-arrow-color)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.4"
      />
    </svg>
  )
}

export const ProcessStepsBlock: React.FC<ProcessStepsBlockProps> = ({
  arrowColor = '#93b51f',
  circleBorderColor = '#8f2b83',
  circleSize = 112,
  heading,
  headingStyle,
  iconSize = 50,
  maxWidth = 1200,
  numberStyle,
  stepDescriptionStyle,
  steps,
  stepTitleStyle,
}) => {
  const visibleSteps = steps?.filter((step) => step?.title || step?.description || step?.icon) || []

  if (!visibleSteps.length && !heading) return null

  return (
    <section
      className="process-steps mx-auto w-full px-4"
      style={
        {
          '--process-steps-arrow-color': arrowColor || '#93b51f',
          '--process-steps-circle-border': circleBorderColor || '#8f2b83',
          '--process-steps-circle-size': `${circleSize || 112}px`,
          '--process-steps-icon-size': `${iconSize || 50}px`,
          maxWidth: maxWidth || 1200,
        } as React.CSSProperties
      }
    >
      {heading ? (
        <div className="mb-6 flex items-center justify-center gap-3 text-center md:mb-7">
          <StepArrow className="hidden h-6 w-20 rotate-180 opacity-80 xl:block" index={1} />
          <h2
            className={cn(
              'text-[length:var(--process-steps-heading-font-size-mobile)] md:text-[length:var(--process-steps-heading-font-size-desktop)]',
              textTransformClass(headingStyle?.textTransform),
              typographyFontWeightClasses[headingStyle?.fontWeight || 'regular'],
              typographyLetterSpacingClasses[headingStyle?.letterSpacing || 'normal'],
            )}
            style={getTextStyle(
              headingStyle,
              {
                color: '#93b51f',
                fontFamily: 'rye',
                fontSizeDesktop: 22,
                fontSizeMobile: 18,
                fontStyle: 'normal',
                lineHeight: 1,
                verticalScale: 'tall',
              },
              'process-steps-heading',
            )}
          >
            {formatTextTransform(heading, headingStyle?.textTransform)}
          </h2>
          <StepArrow className="hidden h-6 w-20 opacity-80 xl:block" index={0} />
        </div>
      ) : null}

      <div className="grid gap-x-5 gap-y-12 md:grid-cols-2 xl:grid-cols-4 xl:gap-x-8">
        {visibleSteps.map((step, index) => {
          const icon = getImage(step.icon)

          return (
            <article
              className="relative grid min-w-0 justify-items-center text-center"
              key={step.id || index}
            >
              {index < visibleSteps.length - 1 ? (
                <>
                  <StepArrow
                    className="absolute left-1/2 top-[calc(100%+0.15rem)] h-10 w-16 -translate-x-1/2 rotate-90 md:hidden"
                    index={index}
                  />
                  <StepArrow
                    className={cn(
                      'absolute xl:hidden',
                      index % 2 === 0
                        ? 'left-[calc(50%+3.5rem)] top-7 hidden h-12 w-[calc(100%-3rem)] md:block'
                        : 'left-1/2 top-[calc(100%+0.15rem)] hidden h-10 w-16 -translate-x-1/2 rotate-90 md:block',
                    )}
                    index={index}
                  />
                  <StepArrow
                    className="absolute left-[calc(50%+3.5rem)] top-7 hidden h-12 w-[calc(100%-3rem)] xl:block"
                    index={index}
                  />
                </>
              ) : null}

              <div className="process-steps-circle vintage-surface relative isolate grid place-items-center rounded-full">
                {icon ? (
                  <Media
                    imgClassName="h-full w-full object-contain"
                    pictureClassName="block h-[var(--process-steps-icon-size)] w-[var(--process-steps-icon-size)]"
                    resource={icon}
                    size="96px"
                  />
                ) : null}
                <span
                  className={cn(
                    'process-steps-number absolute left-1/2 top-full grid place-items-center rounded-full text-[length:var(--process-steps-number-font-size-mobile)] md:text-[length:var(--process-steps-number-font-size-desktop)]',
                    textTransformClass(numberStyle?.textTransform),
                    typographyFontWeightClasses[numberStyle?.fontWeight || 'black'],
                    typographyLetterSpacingClasses[numberStyle?.letterSpacing || 'tight'],
                  )}
                  style={getTextStyle(
                    numberStyle,
                    {
                      color: '#171717',
                      fontFamily: 'geistSans',
                      fontSizeDesktop: 12,
                      fontSizeMobile: 11,
                      fontStyle: 'normal',
                      lineHeight: 1,
                      verticalScale: 'normal',
                    },
                    'process-steps-number',
                  )}
                >
                  {formatTextTransform(
                    step.numberLabel || String(index + 1),
                    numberStyle?.textTransform,
                  )}
                </span>
              </div>

              {step.title ? (
                <h3
                  className={cn(
                    'mt-7 text-[length:var(--process-steps-title-font-size-mobile)] md:text-[length:var(--process-steps-title-font-size-desktop)]',
                    textTransformClass(stepTitleStyle?.textTransform),
                    typographyFontWeightClasses[stepTitleStyle?.fontWeight || 'regular'],
                    typographyLetterSpacingClasses[stepTitleStyle?.letterSpacing || 'tight'],
                  )}
                  style={getTextStyle(
                    stepTitleStyle,
                    {
                      color: '#93b51f',
                      fontFamily: 'rye',
                      fontSizeDesktop: 16,
                      fontSizeMobile: 14,
                      fontStyle: 'normal',
                      lineHeight: 1,
                      verticalScale: 'tall',
                    },
                    'process-steps-title',
                  )}
                >
                  {formatTextTransform(step.title, stepTitleStyle?.textTransform)}
                </h3>
              ) : null}

              {step.description ? (
                <p
                  className={cn(
                    'mt-4 max-w-[14rem] text-[length:var(--process-steps-description-font-size-mobile)] md:text-[length:var(--process-steps-description-font-size-desktop)]',
                    textTransformClass(stepDescriptionStyle?.textTransform),
                    typographyFontWeightClasses[stepDescriptionStyle?.fontWeight || 'bold'],
                    typographyLetterSpacingClasses[stepDescriptionStyle?.letterSpacing || 'tight'],
                  )}
                  style={getTextStyle(
                    stepDescriptionStyle,
                    {
                      color: 'rgba(244,240,220,0.82)',
                      fontFamily: 'geistSans',
                      fontSizeDesktop: 13,
                      fontSizeMobile: 12,
                      fontStyle: 'normal',
                      lineHeight: 1.45,
                      verticalScale: 'normal',
                    },
                    'process-steps-description',
                  )}
                >
                  {formatTextTransform(step.description, stepDescriptionStyle?.textTransform)}
                </p>
              ) : null}
            </article>
          )
        })}
      </div>
    </section>
  )
}
