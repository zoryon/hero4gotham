import React from 'react'

import type {
  Event as EventDocument,
  Media as MediaDocument,
  UpcomingEventsBlock as UpcomingEventsBlockProps,
} from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import {
  typographyFontFamilyStyles,
  typographyFontSizeClasses,
  typographyFontWeightClasses,
  typographyLetterSpacingClasses,
  typographySubtitleFontSizeClasses,
  typographyVerticalScaleValues,
} from '@/fields/typography'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { cn } from '@/utilities/ui'
import configPromise from '@payload-config'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'

const extendedSubtitleFontSizeClasses = {
  tiny: 'text-[0.62rem] md:text-xs',
  xs: 'text-[0.68rem] md:text-[0.8rem]',
  ...typographySubtitleFontSizeClasses,
}

const eventDateFormatter = new Intl.DateTimeFormat('it-IT', {
  day: '2-digit',
  month: 'short',
})

const eventSelect = {
  description: true,
  link: true,
  startsAt: true,
  title: true,
} as const

type UpcomingEventData = Pick<EventDocument, 'description' | 'id' | 'link' | 'startsAt' | 'title'>

const resolveBackgroundImage = (image: MediaDocument | number | null | undefined) => {
  if (!image || typeof image !== 'object') return undefined

  const url = getMediaUrl(image.url, image.updatedAt)
  return url ? `url("${url.replace(/"/g, '\\"')}")` : undefined
}

const getRecordValue = <T extends Record<string, string>>(
  record: T,
  value: null | string | undefined,
  fallback: keyof T,
) => record[(value || fallback) as keyof T] || record[fallback]

const getFontSizeClass = (value: null | string | undefined, sizeKind: 'display' | 'subtitle') => {
  if (sizeKind === 'display') {
    return getRecordValue(typographyFontSizeClasses, value, 'compact')
  }

  return getRecordValue(extendedSubtitleFontSizeClasses, value, 'small')
}

const getReducedCtaTitleSize = (value: null | string | undefined) => {
  if (value && value in typographySubtitleFontSizeClasses) return value
  if (value === 'compact') return 'large'

  return 'lead'
}

const getReadableHeadingColor = (value: null | string | undefined) => {
  if (!value || value.toLowerCase() === '#211713') return '#fef3c7'

  return value
}

const getTextClassName = ({
  base,
  fontSize,
  fontWeight,
  letterSpacing,
  sizeKind = 'subtitle',
}: {
  base?: string
  fontSize?: null | string
  fontWeight?: null | string
  letterSpacing?: null | string
  sizeKind?: 'display' | 'subtitle'
}) =>
  cn(
    base,
    getFontSizeClass(fontSize, sizeKind),
    getRecordValue(typographyFontWeightClasses, fontWeight, 'black'),
    getRecordValue(typographyLetterSpacingClasses, letterSpacing, 'tight'),
  )

const getTextStyle = ({
  color,
  fontFamily,
  fontStyle,
  verticalScale,
}: {
  color?: null | string
  fontFamily?: null | string
  fontStyle?: null | string
  verticalScale?: null | string
}): React.CSSProperties => ({
  color: color || undefined,
  display: 'inline-block',
  fontFamily: getRecordValue(typographyFontFamilyStyles, fontFamily, 'cinzel'),
  fontStyle: fontStyle === 'italic' ? 'italic' : 'normal',
  transform: `scaleY(${getRecordValue(typographyVerticalScaleValues, verticalScale, 'normal')})`,
  transformOrigin: 'top left',
})

const formatEventDate = (value: string) => {
  const parts = eventDateFormatter.formatToParts(new Date(value))
  const day = parts.find((part) => part.type === 'day')?.value || ''
  const month = parts.find((part) => part.type === 'month')?.value || ''

  return {
    day,
    month: month.replace('.', '').toUpperCase(),
  }
}

const truncateAtNextWord = (value: null | string | undefined, maxCharacters?: null | number) => {
  const text = value?.trim().replace(/\s+/g, ' ') || ''
  const limit = Math.floor(maxCharacters || 0)

  if (!text || limit <= 0 || text.length <= limit) return text

  const nextSpaceIndex = text.slice(limit).search(/\s/)

  if (nextSpaceIndex === -1) return `${text}...`

  return `${text.slice(0, limit + nextSpaceIndex).trimEnd()}...`
}

const isEventDocument = (
  event: EventDocument | number | null | undefined,
): event is EventDocument => Boolean(event && typeof event === 'object')

const getManualEvents = async (
  manualEvents: UpcomingEventsBlockProps['manualEvents'],
): Promise<UpcomingEventData[]> => {
  const selected = (manualEvents || []).filter(Boolean)
  const populated = selected.filter(isEventDocument)

  if (populated.length === selected.length) return populated.slice(0, 2)

  const ids = selected
    .map((event) => (typeof event === 'object' ? event.id : event))
    .filter((id): id is number => typeof id === 'number')

  if (!ids.length) return populated.slice(0, 2)

  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'events',
    depth: 1,
    limit: 2,
    pagination: false,
    select: eventSelect,
    sort: 'startsAt',
    where: {
      id: {
        in: ids,
      },
    },
  })

  return result.docs as UpcomingEventData[]
}

const getAutomaticEvents = unstable_cache(
  async (): Promise<UpcomingEventData[]> => {
    const payload = await getPayload({ config: configPromise })
    const now = new Date()
    now.setHours(0, 0, 0, 0)

    const upcoming = await payload.find({
      collection: 'events',
      depth: 1,
      limit: 2,
      pagination: false,
      select: eventSelect,
      sort: 'startsAt',
      where: {
        startsAt: {
          greater_than_equal: now.toISOString(),
        },
      },
    })

    if (upcoming.docs.length) return upcoming.docs as UpcomingEventData[]

    const latest = await payload.find({
      collection: 'events',
      depth: 1,
      limit: 2,
      pagination: false,
      select: eventSelect,
      sort: '-startsAt',
    })

    return latest.docs as UpcomingEventData[]
  },
  ['upcoming-events-automatic'],
  {
    revalidate: 300,
    tags: ['events'],
  },
)

export const UpcomingEventsBlock = async ({
  ctaButtonBackgroundColor = '#84cc16',
  ctaButtonFontFamily,
  ctaButtonFontSize,
  ctaButtonFontStyle,
  ctaButtonFontWeight,
  ctaButtonLetterSpacing,
  ctaButtonVerticalScale,
  ctaButtonTextColor = '#251414',
  ctaGlyph,
  ctaLink,
  ctaLinkBackgroundImage,
  ctaLinkFallbackLabel = 'Unisciti a noi',
  ctaText,
  ctaTextColor = '#ffffff',
  ctaTextFontFamily,
  ctaTextFontSize,
  ctaTextFontStyle,
  ctaTextFontWeight,
  ctaTextLetterSpacing,
  ctaTextVerticalScale,
  ctaTitle,
  ctaTitleFontFamily,
  ctaTitleFontSize,
  ctaTitleFontStyle,
  ctaTitleFontWeight,
  ctaTitleLetterSpacing,
  ctaTitleVerticalScale,
  dateDayFontFamily,
  dateDayFontSize,
  dateDayFontStyle,
  dateDayFontWeight,
  dateDayLetterSpacing,
  dateDayVerticalScale,
  dateMonthFontFamily,
  dateMonthFontSize,
  dateMonthFontStyle,
  dateMonthFontWeight,
  dateMonthLetterSpacing,
  dateMonthVerticalScale,
  dateColor = '#e879f9',
  emptyEventsText,
  emptyEventsTitle,
  eventLinkFontFamily,
  eventLinkFontSize,
  eventLinkFontStyle,
  eventLinkFontWeight,
  eventLinkLetterSpacing,
  eventLinkVerticalScale,
  eventLinkColor = '#a3e635',
  eventLinkLabel = 'Scopri di piu',
  eventDescriptionMaxCharacters = 140,
  eventSource = 'automatic',
  eventTextFontFamily,
  eventTextFontSize = 'xs',
  eventTextFontStyle,
  eventTextFontWeight,
  eventTextLetterSpacing,
  eventTextVerticalScale,
  eventTextColor = '#f4f4f5',
  eventTitleFontFamily,
  eventTitleFontSize,
  eventTitleFontStyle,
  eventTitleFontWeight,
  eventTitleLetterSpacing,
  eventTitleVerticalScale,
  eventTitleColor = '#fef3c7',
  featureImage,
  heading,
  headingBackgroundImage,
  headingFontFamily,
  headingFontSize,
  headingFontStyle,
  headingFontWeight,
  headingLetterSpacing,
  headingVerticalScale,
  headingColor = '#211713',
  leftPanelScribbleBorder = false,
  manualEvents,
  rightBackground,
}: UpcomingEventsBlockProps) => {
  const eventItems =
    eventSource === 'manual' ? await getManualEvents(manualEvents) : await getAutomaticEvents()

  return (
    <section className="grid items-start gap-4 xl:grid-cols-[minmax(0,0.95fr)_minmax(21rem,0.6fr)] xl:items-center">
      <div
        className={cn(
          'vintage-surface relative isolate',
          leftPanelScribbleBorder && 'scribble-border upcoming-events-left-border',
        )}
      >
        <div
          className={cn(
            'absolute -left-2 -top-3 z-40 inline-flex -rotate-2 items-center justify-center text-center md:left-0 md:-top-4',
            headingBackgroundImage && 'min-w-52 px-8 py-3 md:min-w-60 md:px-10 md:py-3.5',
          )}
          style={{
            zIndex: 40,
            ...(headingBackgroundImage
              ? {
                  backgroundImage: resolveBackgroundImage(headingBackgroundImage),
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '100% 100%',
                }
              : {}),
          }}
        >
          <h2
            className={getTextClassName({
              base: 'uppercase opacity-95 drop-shadow-[0_1px_0_rgba(0,0,0,0.65)]',
              fontSize: headingFontSize,
              fontWeight: headingFontWeight,
              letterSpacing: headingLetterSpacing,
            })}
            style={getTextStyle({
              color: getReadableHeadingColor(headingColor),
              fontFamily: headingFontFamily,
              fontStyle: headingFontStyle,
              verticalScale: headingVerticalScale,
            })}
          >
            {heading}
          </h2>
        </div>

        <div
          className="relative isolate overflow-hidden px-7 pb-3 pt-2 lg:pb-3 lg:pl-5 lg:pr-5 lg:pt-2 xl:pb-6 xl:pl-6 xl:pr-6 xl:pt-3"
          style={{
            clipPath: 'polygon(1% 2.5%, 99% 0.5%, 98% 97.5%, 1.5% 99%)',
          }}
        >
          <div className="grid gap-4 pt-6 md:grid-cols-[minmax(0,1fr)_minmax(12rem,34%)] md:items-center md:pt-5 xl:grid-cols-[minmax(0,1fr)_minmax(14rem,38%)]">
            <div className="grid content-start">
              <div className="max-w-[31rem] divide-y divide-[#7b5a2f]/35 md:max-w-[28rem] xl:max-w-[31rem]">
                {eventItems.length ? (
                  eventItems.map((event) => {
                    const formattedDate = formatEventDate(event.startsAt)

                    return (
                      <article
                        className="grid grid-cols-[3.55rem_minmax(0,1fr)] items-start gap-2 py-2 xl:grid-cols-[3.85rem_minmax(0,1fr)] xl:gap-2.5 xl:py-2.5"
                        key={event.id}
                      >
                        <div className="justify-self-start text-left uppercase leading-none">
                          <div
                            className={getTextClassName({
                              base: '-mb-1',
                              fontSize: dateDayFontSize,
                              fontWeight: dateDayFontWeight,
                              letterSpacing: dateDayLetterSpacing,
                              sizeKind: 'display',
                            })}
                            style={getTextStyle({
                              color: dateColor || '#e879f9',
                              fontFamily: dateDayFontFamily,
                              fontStyle: dateDayFontStyle,
                              verticalScale: dateDayVerticalScale,
                            })}
                          >
                            {formattedDate.day}
                          </div>
                          <div
                            className={getTextClassName({
                              base: 'mt-0',
                              fontSize: dateMonthFontSize,
                              fontWeight: dateMonthFontWeight,
                              letterSpacing: dateMonthLetterSpacing,
                            })}
                            style={getTextStyle({
                              color: eventTextColor || '#f4f4f5',
                              fontFamily: dateMonthFontFamily,
                              fontStyle: dateMonthFontStyle,
                              verticalScale: dateMonthVerticalScale,
                            })}
                          >
                            {formattedDate.month}
                          </div>
                        </div>

                        <div className="grid min-w-0 gap-2 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-start xl:gap-3">
                          <div className="min-w-0">
                            <h3
                              className={getTextClassName({
                                base: 'uppercase',
                                fontSize: eventTitleFontSize,
                                fontWeight: eventTitleFontWeight,
                                letterSpacing: eventTitleLetterSpacing,
                              })}
                              style={{
                                ...getTextStyle({
                                  color: eventTitleColor || '#fef3c7',
                                  fontFamily: eventTitleFontFamily,
                                  fontStyle: eventTitleFontStyle,
                                  verticalScale: eventTitleVerticalScale,
                                }),
                                display: 'block',
                              }}
                            >
                              {event.title}
                            </h3>
                            <p
                              className={getTextClassName({
                                base: 'mt-1 max-w-[15rem] xl:max-w-[17rem]',
                                fontSize: eventTextFontSize,
                                fontWeight: eventTextFontWeight,
                                letterSpacing: eventTextLetterSpacing,
                              })}
                              style={{
                                ...getTextStyle({
                                  color: eventTextColor || '#d7d0d3',
                                  fontFamily: eventTextFontFamily,
                                  fontStyle: eventTextFontStyle,
                                  verticalScale: eventTextVerticalScale,
                                }),
                                display: 'block',
                              }}
                            >
                              {truncateAtNextWord(event.description, eventDescriptionMaxCharacters)}
                            </p>
                          </div>

                          <span className="inline-flex w-fit flex-col items-start justify-self-start xl:items-end xl:self-end xl:justify-self-end">
                            <CMSLink
                              {...event.link}
                              className={cn(
                                getTextClassName({
                                  base: 'whitespace-nowrap uppercase',
                                  fontSize: eventLinkFontSize,
                                  fontWeight: eventLinkFontWeight,
                                  letterSpacing: eventLinkLetterSpacing,
                                }),
                                'text-[0.58rem] md:text-[0.62rem]',
                              )}
                              label={event.link?.label || eventLinkLabel || 'Scopri di piu'}
                              style={getTextStyle({
                                color: eventLinkColor || '#a3e635',
                                fontFamily: eventLinkFontFamily,
                                fontStyle: eventLinkFontStyle,
                                verticalScale: eventLinkVerticalScale,
                              })}
                            />
                            <span
                              aria-hidden
                              className="mt-1 h-0.5 w-10"
                              style={{ backgroundColor: eventLinkColor || '#a3e635' }}
                            />
                          </span>
                        </div>
                      </article>
                    )
                  })
                ) : (
                  <div className="py-8">
                    <h3
                      className={getTextClassName({
                        base: 'uppercase',
                        fontSize: eventTitleFontSize,
                        fontWeight: eventTitleFontWeight,
                        letterSpacing: eventTitleLetterSpacing,
                      })}
                      style={{
                        ...getTextStyle({
                          color: eventTitleColor || '#fef3c7',
                          fontFamily: eventTitleFontFamily,
                          fontStyle: eventTitleFontStyle,
                          verticalScale: eventTitleVerticalScale,
                        }),
                        display: 'block',
                      }}
                    >
                      {emptyEventsTitle}
                    </h3>
                    {emptyEventsText ? (
                      <p
                        className={getTextClassName({
                          base: 'mt-2 max-w-md',
                          fontSize: eventTextFontSize,
                          fontWeight: eventTextFontWeight,
                          letterSpacing: eventTextLetterSpacing,
                        })}
                        style={{
                          ...getTextStyle({
                            color: eventTextColor || '#f4f4f5',
                            fontFamily: eventTextFontFamily,
                            fontStyle: eventTextFontStyle,
                            verticalScale: eventTextVerticalScale,
                          }),
                          display: 'block',
                        }}
                      >
                        {emptyEventsText}
                      </p>
                    ) : null}
                  </div>
                )}
              </div>
            </div>

            <div className="relative aspect-[16/9] min-h-44 overflow-hidden md:min-h-0 md:self-center">
              {featureImage && typeof featureImage === 'object' ? (
                <Media
                  fill
                  imgClassName="object-cover object-center saturate-[0.95] contrast-[1.04]"
                  pictureClassName="absolute inset-0"
                  resource={featureImage}
                  size="(max-width: 767px) 100vw, (max-width: 1279px) 42vw, 46vw"
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <aside
        className="relative isolate min-h-[13.5rem] w-full max-w-[42rem] justify-self-center overflow-visible md:h-[clamp(18rem,33vw,22rem)] md:min-h-0 md:max-w-[54rem] lg:h-[clamp(18.5rem,31vw,23rem)] lg:max-w-[58rem] xl:h-[clamp(14rem,17vw,17rem)] xl:max-w-[42rem]"
        style={{
          backgroundImage: resolveBackgroundImage(rightBackground),
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '100% 100%',
        }}
      >
        <div className="upcoming-events-cta-copy-backdrop absolute bottom-[18%] left-[9%] top-[21%] z-10 flex w-[min(58%,22rem)] min-w-0 flex-col justify-center md:bottom-[18%] md:left-[10%] md:top-[23%] md:w-[min(68%,34rem)] lg:w-[min(70%,37rem)] xl:left-[11%] xl:top-[24%] xl:w-[min(72%,27rem)] 2xl:w-[min(58%,28rem)]">
          <h2
            className={getTextClassName({
              base: 'max-w-full uppercase [overflow-wrap:anywhere]',
              fontSize: getReducedCtaTitleSize(ctaTitleFontSize),
              fontWeight: ctaTitleFontWeight,
              letterSpacing: ctaTitleLetterSpacing,
            })}
            style={getTextStyle({
              color: ctaTextColor || '#ffffff',
              fontFamily: ctaTitleFontFamily,
              fontStyle: ctaTitleFontStyle,
              verticalScale: ctaTitleVerticalScale,
            })}
          >
            {ctaTitle}
          </h2>
          {ctaText ? (
            <p
              className={getTextClassName({
                base: 'mt-3 max-w-[21rem] [overflow-wrap:anywhere] md:mt-4 md:max-w-[32rem] lg:max-w-[35rem] xl:max-w-[24rem]',
                fontSize: ctaTextFontSize,
                fontWeight: ctaTextFontWeight,
                letterSpacing: ctaTextLetterSpacing,
              })}
              style={getTextStyle({
                color: ctaTextColor || '#ffffff',
                fontFamily: ctaTextFontFamily,
                fontStyle: ctaTextFontStyle,
                verticalScale: ctaTextVerticalScale,
              })}
            >
              {ctaText}
            </p>
          ) : null}
          <CMSLink
            {...ctaLink}
            className={getTextClassName({
              base: 'mt-5 inline-flex w-fit max-w-full justify-center px-7 py-3 text-center uppercase shadow-[0_5px_0_rgb(0_0_0_/_0.18)] [overflow-wrap:anywhere] md:mt-5 md:px-7 md:py-3 xl:mt-6 xl:px-8 xl:py-3.5',
              fontSize: ctaButtonFontSize,
              fontWeight: ctaButtonFontWeight,
              letterSpacing: ctaButtonLetterSpacing,
            })}
            label={ctaLink?.label || ctaLinkFallbackLabel || 'Unisciti a noi'}
            style={{
              backgroundColor: ctaLinkBackgroundImage
                ? 'transparent'
                : ctaButtonBackgroundColor || '#84cc16',
              backgroundImage: resolveBackgroundImage(ctaLinkBackgroundImage),
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '100% 100%',
              color: ctaButtonTextColor || '#251414',
              clipPath: 'polygon(2% 0, 100% 0, 98% 93%, 0 100%)',
              fontFamily: getRecordValue(typographyFontFamilyStyles, ctaButtonFontFamily, 'cinzel'),
              fontStyle: ctaButtonFontStyle === 'italic' ? 'italic' : 'normal',
              transform: `scaleY(${getRecordValue(
                typographyVerticalScaleValues,
                ctaButtonVerticalScale,
                'normal',
              )})`,
              transformOrigin: 'center',
            }}
          />
        </div>

        {ctaGlyph && typeof ctaGlyph === 'object' ? (
          <div className="pointer-events-none absolute right-[8%] top-[53%] hidden h-40 w-40 -translate-y-1/2 opacity-95 2xl:block">
            <Media
              fill
              imgClassName="object-contain"
              pictureClassName="absolute inset-0"
              resource={ctaGlyph}
              size="(max-width: 767px) 9rem, (max-width: 1279px) 10.5rem, 16rem"
            />
          </div>
        ) : null}
      </aside>
    </section>
  )
}
