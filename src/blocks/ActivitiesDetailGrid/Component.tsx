import React from 'react'

import type {
  Activity as ActivityDocument,
  ActivitiesDetailGridBlock as ActivitiesDetailGridBlockProps,
  Media as MediaDocument,
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
import configPromise from '@payload-config'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'

type ManualActivity = NonNullable<ActivitiesDetailGridBlockProps['activities']>[number]
type ResponsiveLayout = NonNullable<ActivitiesDetailGridBlockProps['responsive']>
type TextStyle =
  | ActivitiesDetailGridBlockProps['headingStyle']
  | ActivitiesDetailGridBlockProps['titleStyle']
  | ActivitiesDetailGridBlockProps['descriptionStyle']
  | ActivitiesDetailGridBlockProps['detailStyle']
  | ActivitiesDetailGridBlockProps['ctaStyle']
  | ManualActivity['titleStyle']
  | ManualActivity['descriptionStyle']
  | ManualActivity['detailStyle']
  | ManualActivity['ctaStyle']

type ActivityCardData = Pick<
  ActivityDocument,
  'cta' | 'ctaImage' | 'description' | 'details' | 'image' | 'title'
> & {
  border?: boolean | null
  ctaStyle?: TextStyle | null
  descriptionStyle?: TextStyle | null
  detailStyle?: TextStyle | null
  imagePosition?: ManualActivity['imagePosition'] | null
  imageSize?: number | null
  id?: number | string | null
  titleStyle?: TextStyle | null
}

const activitySelect = {
  cta: true,
  ctaImage: true,
  description: true,
  details: true,
  image: true,
  order: true,
  title: true,
} as const

const containerWidthClasses = {
  contained: 'container',
  full: 'w-full',
  wide: 'mx-auto w-full max-w-[92rem] px-4 md:px-8',
}

const getMedia = (media: MediaDocument | number | null | undefined) =>
  media && typeof media === 'object' ? media : null

const getSetting = (
  responsive: ResponsiveLayout | null | undefined,
  breakpoint: keyof ResponsiveLayout,
  key: 'columns' | 'rows',
  fallback: number,
) => {
  const value = responsive?.[breakpoint]?.[key]
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

const getResponsiveFontSize = (mobile: number, desktop: number) => {
  if (mobile === desktop) return `${mobile}px`

  const min = Math.min(mobile, desktop)
  const max = Math.max(mobile, desktop)

  return `clamp(${min}px, calc(${mobile}px + ${desktop - mobile} * ((100vw - 360px) / 920)), ${max}px)`
}

const getTextStyle = (
  style: TextStyle | null | undefined,
  fallback: {
    color: string
    fontFamily: keyof typeof typographyFontFamilyStyles
    fontSizeDesktop: number
    fontSizeMobile: number
    fontStyle: 'italic' | 'normal'
    lineHeight: number
    maxWidth: number
    verticalScale: keyof typeof typographyVerticalScaleValues
  },
  prefix: string,
): React.CSSProperties => {
  const fontSizeMobile = style?.fontSizeMobile ?? fallback.fontSizeMobile
  const fontSizeDesktop = style?.fontSizeDesktop ?? fallback.fontSizeDesktop

  return {
    color: style?.color || fallback.color,
    fontFamily:
      typographyFontFamilyStyles[
        (style?.fontFamily || fallback.fontFamily) as keyof typeof typographyFontFamilyStyles
      ],
    fontSize: getResponsiveFontSize(fontSizeMobile, fontSizeDesktop),
    fontStyle: style?.fontStyle === 'italic' ? 'italic' : fallback.fontStyle,
    lineHeight: style?.lineHeight ?? fallback.lineHeight,
    maxWidth: style?.maxWidth ?? fallback.maxWidth,
    minWidth: 0,
    overflowWrap: 'anywhere',
    transform: `scaleY(${
      typographyVerticalScaleValues[
        (style?.verticalScale ||
          fallback.verticalScale) as keyof typeof typographyVerticalScaleValues
      ]
    })`,
    transformOrigin: 'left center',
  }
}

const getImageMask = (
  imagePosition: ActivityCardData['imagePosition'] | null | undefined,
  fadeSize: number,
) => {
  if (!fadeSize) return undefined

  const safeFade = `${fadeSize}px`

  if (imagePosition === 'right') {
    return `linear-gradient(to left, #000 calc(100% - ${safeFade}), transparent 100%)`
  }

  if (imagePosition === 'top') {
    return `linear-gradient(to bottom, #000 calc(100% - ${safeFade}), transparent 100%)`
  }

  if (imagePosition === 'bottom') {
    return `linear-gradient(to top, #000 calc(100% - ${safeFade}), transparent 100%)`
  }

  return `linear-gradient(to right, #000 calc(100% - ${safeFade}), transparent 100%)`
}

const getActivityGridStyle = (
  activity: ActivityCardData,
  hasImage: boolean,
): React.CSSProperties => {
  if (!hasImage) {
    return {
      gridTemplateColumns: '1fr',
      gridTemplateRows: '1fr',
    }
  }

  const imageSize = Math.min(Math.max(activity.imageSize ?? 46, 20), 80)
  const contentSize = 100 - imageSize
  const imagePosition = activity.imagePosition || 'left'

  if (imagePosition === 'top' || imagePosition === 'bottom') {
    return {
      gridTemplateRows:
        imagePosition === 'top' ? `${imageSize}% ${contentSize}%` : `${contentSize}% ${imageSize}%`,
    }
  }

  return {
    gridTemplateColumns:
      imagePosition === 'left' ? `${imageSize}% ${contentSize}%` : `${contentSize}% ${imageSize}%`,
  }
}

const getColumnAwareImagePosition = (
  index: number,
  columns: number,
  fallback: ActivityCardData['imagePosition'] | null | undefined,
) => {
  const safeColumns = Math.max(columns, 1)

  if (safeColumns < 2) return fallback || 'left'

  return index % safeColumns === 0 ? 'left' : 'right'
}

const getRowsForCardCount = (cardCount: number, columns: number) =>
  Math.max(1, Math.ceil(cardCount / Math.max(columns, 1)))

const StyledText: React.FC<{
  as?: 'h2' | 'h3' | 'p' | 'span'
  children: React.ReactNode
  className?: string
  fallback: {
    color: string
    fontFamily: keyof typeof typographyFontFamilyStyles
    fontSizeDesktop: number
    fontSizeMobile: number
    fontStyle: 'italic' | 'normal'
    fontWeight: keyof typeof typographyFontWeightClasses
    letterSpacing: keyof typeof typographyLetterSpacingClasses
    lineHeight: number
    maxWidth: number
    textTransform: string
    verticalScale: keyof typeof typographyVerticalScaleValues
  }
  prefix: string
  style?: React.CSSProperties
  styleConfig: TextStyle | null | undefined
}> = ({ as: Tag = 'span', children, className, fallback, prefix, style, styleConfig }) => {
  const textTransform = styleConfig?.textTransform || fallback.textTransform
  const formattedChildren =
    typeof children === 'string' ? formatTextTransform(children, textTransform) : children

  return (
    <Tag
      className={cn(
        textTransformClass(textTransform),
        typographyFontWeightClasses[
          (styleConfig?.fontWeight ||
            fallback.fontWeight) as keyof typeof typographyFontWeightClasses
        ],
        typographyLetterSpacingClasses[
          (styleConfig?.letterSpacing ||
            fallback.letterSpacing) as keyof typeof typographyLetterSpacingClasses
        ],
        className,
      )}
      style={{
        ...getTextStyle(
          styleConfig,
          {
            color: fallback.color,
            fontFamily: fallback.fontFamily,
            fontSizeDesktop: fallback.fontSizeDesktop,
            fontSizeMobile: fallback.fontSizeMobile,
            fontStyle: fallback.fontStyle,
            lineHeight: fallback.lineHeight,
            maxWidth: fallback.maxWidth,
            verticalScale: fallback.verticalScale,
          },
          prefix,
        ),
        ...style,
      }}
    >
      {formattedChildren}
    </Tag>
  )
}

const ActivityCard: React.FC<{
  activity: ActivityCardData
  dividerColor?: string | null
  fadeSize: number
  index: number
  panelBackgroundColor?: string | null
  contentPadding: number
  sharedCtaStyle?: TextStyle | null
  sharedDescriptionStyle?: TextStyle | null
  sharedDetailStyle?: TextStyle | null
  sharedTitleStyle?: TextStyle | null
}> = ({
  activity,
  contentPadding,
  dividerColor,
  fadeSize,
  index,
  panelBackgroundColor,
  sharedCtaStyle,
  sharedDescriptionStyle,
  sharedDetailStyle,
  sharedTitleStyle,
}) => {
  const image = getMedia(activity.image)
  const hasImage = Boolean(image)
  const imagePosition = activity.imagePosition || 'left'
  const imageFirst = imagePosition === 'left' || imagePosition === 'top'
  const ctaBannerImage = getMedia(activity.ctaImage)
  const textPadding = `${contentPadding}px`
  const surfaceFadeSize = Math.max(24, Math.min(fadeSize || 44, 72))

  const imageNode = hasImage ? (
    <div
      className={cn(
        'activity-detail-card__media relative min-h-0 overflow-hidden',
        `activity-detail-card__media--${imagePosition}`,
        !imageFirst && (imagePosition === 'right' ? 'md:order-2' : 'order-2'),
      )}
      style={{
        borderColor: dividerColor || undefined,
        borderStyle: dividerColor ? 'solid' : undefined,
        borderWidth:
          dividerColor && imagePosition === 'left'
            ? '0 1px 0 0'
            : dividerColor && imagePosition === 'right'
              ? '0 0 0 1px'
              : dividerColor && imagePosition === 'top'
                ? '0 0 1px 0'
                : dividerColor
                  ? '1px 0 0 0'
                  : undefined,
      } as React.CSSProperties}
    >
      <Media
        fill
        imgClassName="object-cover object-center"
        pictureClassName="absolute inset-0 block h-full w-full"
        resource={image}
        size="(max-width: 768px) 100vw, 46vw"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          WebkitMaskImage: getImageMask(imagePosition, fadeSize),
          background: 'currentColor',
          color: 'transparent',
          maskImage: getImageMask(imagePosition, fadeSize),
        }}
      />
    </div>
  ) : null

  const contentNode = (
    <div
      className={cn(
        'activity-detail-card__content vintage-surface relative isolate flex min-h-0 flex-col justify-center',
        hasImage
          ? `activity-detail-card__surface--${imagePosition}`
          : 'activity-detail-card__content--full',
        !imageFirst && 'order-1',
      )}
      style={{
        '--activity-detail-surface-fade-size': `${surfaceFadeSize}px`,
        backgroundColor: panelBackgroundColor || 'transparent',
        padding: textPadding,
      } as React.CSSProperties}
    >
      <StyledText
        as="h3"
        className="mb-2"
        fallback={{
          color: '#90a434',
          fontFamily: 'cinzel',
          fontSizeDesktop: 18,
          fontSizeMobile: 16,
          fontStyle: 'normal',
          fontWeight: 'black',
          letterSpacing: 'normal',
          lineHeight: 1,
          maxWidth: 520,
          textTransform: 'uppercase',
          verticalScale: 'normal',
        }}
        prefix={`activity-detail-${index}-title`}
        styleConfig={activity.titleStyle || sharedTitleStyle}
      >
        {activity.title}
      </StyledText>

      {activity.description ? (
        <StyledText
          as="p"
          className="whitespace-pre-line"
          fallback={{
            color: '#f7f0df',
            fontFamily: 'geistSans',
            fontSizeDesktop: 12,
            fontSizeMobile: 12,
            fontStyle: 'normal',
            fontWeight: 'regular',
            letterSpacing: 'tight',
            lineHeight: 1.35,
            maxWidth: 520,
            textTransform: 'normal',
            verticalScale: 'normal',
          }}
          prefix={`activity-detail-${index}-description`}
          styleConfig={activity.descriptionStyle || sharedDescriptionStyle}
        >
          {activity.description}
        </StyledText>
      ) : null}

      {activity.details?.length ? (
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
          {activity.details.map((detail, detailIndex) => {
            const icon = getMedia(detail.icon)

            return (
              <div className="flex items-center gap-1.5" key={detail.id || detailIndex}>
                {icon ? (
                  <span className="relative inline-flex size-4 shrink-0">
                    <Media
                      fill
                      imgClassName="object-contain"
                      pictureClassName="absolute inset-0"
                      resource={icon}
                      size="16px"
                    />
                  </span>
                ) : null}
                <StyledText
                  fallback={{
                    color: '#d9d0c2',
                    fontFamily: 'geistSans',
                    fontSizeDesktop: 9,
                    fontSizeMobile: 9,
                    fontStyle: 'normal',
                    fontWeight: 'bold',
                    letterSpacing: 'tight',
                    lineHeight: 1.1,
                    maxWidth: 260,
                    textTransform: 'uppercase',
                    verticalScale: 'normal',
                  }}
                  prefix={`activity-detail-${index}-label-${detailIndex}`}
                  styleConfig={activity.detailStyle || sharedDetailStyle}
                >
                  {detail.text}
                </StyledText>
              </div>
            )
          })}
        </div>
      ) : null}

      {activity.cta ? (
        <div className="relative mt-3 lg:mt-12 inline-flex w-fit overflow-hidden px-6 py-3">
          {ctaBannerImage ? (
            <Media
              fill
              imgClassName="object-cover object-center"
              pictureClassName="absolute inset-0 -z-10"
              resource={ctaBannerImage}
              size="12rem"
            />
          ) : null}
          <StyledText
            fallback={{
              color: '#f7f0df',
              fontFamily: 'cinzel',
              fontSizeDesktop: 10,
              fontSizeMobile: 10,
              fontStyle: 'normal',
              fontWeight: 'black',
              letterSpacing: 'tight',
              lineHeight: 1,
              maxWidth: 320,
              textTransform: 'uppercase',
              verticalScale: 'normal',
            }}
            prefix={`activity-detail-${index}-cta`}
            styleConfig={activity.ctaStyle || sharedCtaStyle}
          >
            {activity.cta}
          </StyledText>
        </div>
      ) : null}
    </div>
  )

  return (
    <article
      className={cn(
        'activity-detail-card-frame relative isolate',
        activity.border && 'activity-detail-card-frame--bordered',
      )}
    >
      <div
        className="activity-detail-card grid"
        style={
          {
            ...getActivityGridStyle(activity, hasImage),
            '--activity-detail-divider-color': dividerColor || 'transparent',
          } as React.CSSProperties
        }
      >
        {!imageNode ? (
          contentNode
        ) : imageFirst ? (
          <>
            {imageNode}
            {contentNode}
          </>
        ) : (
          <>
            {contentNode}
            {imageNode}
          </>
        )}
      </div>
    </article>
  )
}

const getAutomaticActivities = unstable_cache(
  async (limit: number): Promise<ActivityDocument[]> => {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'activities',
      depth: 1,
      limit,
      pagination: false,
      select: activitySelect,
      sort: 'order',
    })

    return result.docs as ActivityDocument[]
  },
  ['activities-detail-grid-automatic'],
  {
    revalidate: 300,
    tags: ['activities'],
  },
)

export const ActivitiesDetailGridBlock = async ({
  activities,
  automaticBorder = false,
  automaticImagePosition = 'left',
  automaticImageSize = 46,
  automaticLimit = 8,
  cellMinHeight = 240,
  containerWidth = 'wide',
  contentPadding = 22,
  ctaStyle,
  descriptionStyle,
  detailStyle,
  dividerColor,
  gridGap = 0,
  heading,
  headingBannerImage,
  headingPaddingX = 34,
  headingPaddingY = 8,
  headingStyle,
  imageFadeSize = 44,
  panelBg,
  responsive,
  source = 'automatic',
  titleStyle,
}: ActivitiesDetailGridBlockProps) => {
  const mobileColumns = getSetting(responsive, 'mobile', 'columns', 1)
  const tabletColumns = getSetting(responsive, 'tablet', 'columns', 1)
  const laptopColumns = getSetting(responsive, 'laptop', 'columns', 2)
  const desktopColumns = getSetting(responsive, 'desktop', 'columns', 2)
  const mobileRows = getSetting(responsive, 'mobile', 'rows', Math.ceil(8 / mobileColumns))
  const tabletRows = getSetting(responsive, 'tablet', 'rows', Math.ceil(8 / tabletColumns))
  const laptopRows = getSetting(responsive, 'laptop', 'rows', Math.ceil(8 / laptopColumns))
  const desktopRows = getSetting(responsive, 'desktop', 'rows', Math.ceil(8 / desktopColumns))
  const responsiveCapacity = Math.max(
    mobileColumns * mobileRows,
    tabletColumns * tabletRows,
    laptopColumns * laptopRows,
    desktopColumns * desktopRows,
  )
  const fetchLimit = Math.min(Math.max(automaticLimit ?? 8, 1), 8, responsiveCapacity)
  const resolvedCellMinHeight = Math.max(cellMinHeight ?? 190, 150)
  const compactCellMinHeight = Math.min(resolvedCellMinHeight, 170)
  const responsiveCellHeight = `clamp(${compactCellMinHeight}px, 13vw, ${resolvedCellMinHeight}px)`
  const resolvedGridGap = Math.max(gridGap ?? 0, 0)
  const automaticActivities = source === 'automatic' ? await getAutomaticActivities(fetchLimit) : []
  const cards: ActivityCardData[] =
    source === 'automatic'
      ? automaticActivities.map((activity, index) => ({
          ...activity,
          border: automaticBorder,
          imagePosition: getColumnAwareImagePosition(index, desktopColumns, automaticImagePosition),
          imageSize: automaticImageSize,
        }))
      : ((activities || []) as ActivityCardData[]).map((activity, index) => ({
          ...activity,
          imagePosition: getColumnAwareImagePosition(index, desktopColumns, activity.imagePosition),
        }))

  if (!cards.length) return null
  const headingImage = getMedia(headingBannerImage)
  const hasFeaturedRow = cards.length > 1 && desktopColumns >= 2
  const featuredCards = hasFeaturedRow ? cards.slice(0, 2) : []
  const gridCards = hasFeaturedRow ? cards.slice(2) : cards
  const renderedMobileRows = hasFeaturedRow
    ? getRowsForCardCount(gridCards.length, mobileColumns)
    : mobileRows
  const renderedTabletRows = hasFeaturedRow
    ? getRowsForCardCount(gridCards.length, tabletColumns)
    : tabletRows
  const renderedLaptopRows = hasFeaturedRow
    ? getRowsForCardCount(gridCards.length, laptopColumns)
    : laptopRows
  const renderedDesktopRows = hasFeaturedRow
    ? getRowsForCardCount(gridCards.length, desktopColumns)
    : desktopRows
  const renderCard = (activity: ActivityCardData, index: number) => (
    <ActivityCard
      activity={activity}
      contentPadding={contentPadding ?? 22}
      dividerColor={dividerColor}
      fadeSize={imageFadeSize ?? 44}
      index={index}
      key={activity.id || index}
      panelBackgroundColor={panelBg}
      sharedCtaStyle={ctaStyle}
      sharedDescriptionStyle={descriptionStyle}
      sharedDetailStyle={detailStyle}
      sharedTitleStyle={titleStyle}
    />
  )

  return (
    <section className={containerWidthClasses[containerWidth || 'wide']}>
      {heading ? (
        <div className="relative z-10 mx-auto mb-[-0.8rem] flex w-fit justify-center overflow-hidden">
          {headingImage ? (
            <Media
              fill
              imgClassName="object-cover object-center"
              pictureClassName="absolute inset-0 -z-10"
              resource={headingImage}
              size="(max-width: 767px) 80vw, 32rem"
            />
          ) : null}
          <StyledText
            as="h2"
            className="relative"
            fallback={{
              color: '#1b1b1b',
              fontFamily: 'cinzel',
              fontSizeDesktop: 22,
              fontSizeMobile: 16,
              fontStyle: 'normal',
              fontWeight: 'black',
              letterSpacing: 'wide',
              lineHeight: 1,
              maxWidth: 720,
              textTransform: 'uppercase',
              verticalScale: 'normal',
            }}
            prefix="activity-detail-heading"
            styleConfig={headingStyle}
            style={
              {
                paddingBlock: headingPaddingY,
                paddingInline: headingPaddingX,
              } as React.CSSProperties
            }
          >
            {heading}
          </StyledText>
        </div>
      ) : null}

      <div
        className="activity-detail-stack"
        style={
          {
            '--activity-detail-cell-min-height': `${resolvedCellMinHeight}px`,
            '--activity-detail-card-min-height': responsiveCellHeight,
            '--activity-detail-cols-desktop': desktopColumns,
            '--activity-detail-cols-laptop': laptopColumns,
            '--activity-detail-cols-mobile': mobileColumns,
            '--activity-detail-cols-tablet': tabletColumns,
            '--activity-detail-rows-desktop': renderedDesktopRows,
            '--activity-detail-rows-laptop': renderedLaptopRows,
            '--activity-detail-rows-mobile': renderedMobileRows,
            '--activity-detail-rows-tablet': renderedTabletRows,
            '--activity-detail-grid-gap': `${resolvedGridGap}px`,
          } as React.CSSProperties
        }
      >
        {featuredCards.length ? (
          <div className="activity-detail-feature-row">
            {featuredCards.map((activity, index) => renderCard(activity, index))}
          </div>
        ) : null}

        {gridCards.length ? (
          <div className="activity-detail-grid grid">
            {gridCards.map((activity, index) =>
              renderCard(activity, index + featuredCards.length),
            )}
          </div>
        ) : null}
      </div>
    </section>
  )
}
