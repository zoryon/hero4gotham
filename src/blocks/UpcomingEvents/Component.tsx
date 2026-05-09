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
    <section className="grid gap-4 xl:grid-cols-[minmax(0,0.95fr)_minmax(21rem,0.6fr)] xl:items-stretch">
      <div
        className={cn(
          'vintage-surface relative isolate min-h-72',
          leftPanelScribbleBorder && 'scribble-border upcoming-events-left-border',
        )}
      >
        <div
          className="relative isolate min-h-72 overflow-hidden px-7 pb-5 pt-4 lg:pb-5 lg:pl-5 lg:pr-5 lg:pt-4 xl:pb-6 xl:pl-6 xl:pr-6 xl:pt-5"
          style={{
            clipPath: 'polygon(1% 2.5%, 99% 0.5%, 98% 97.5%, 1.5% 99%)',
          }}
        >
          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(14rem,42%)] md:items-stretch xl:grid-cols-[minmax(0,1fr)_minmax(16rem,46%)]">
            <div className="grid content-start">
              <div
                className={cn(
                  'mb-4 inline-flex -rotate-2 items-center justify-center justify-self-start text-center',
                  headingBackgroundImage && 'min-w-56 px-8 py-3 md:min-w-64 md:px-10 md:py-4',
                )}
                style={
                  headingBackgroundImage
                    ? {
                        backgroundImage: resolveBackgroundImage(headingBackgroundImage),
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '100% 100%',
                      }
                    : undefined
                }
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

              <div className="max-w-[31rem] divide-y divide-[#7b5a2f]/35 md:max-w-[28rem] xl:max-w-[31rem]">
                {eventItems.length ? (
                  eventItems.map((event) => {
                    const formattedDate = formatEventDate(event.startsAt)

                    return (
                      <article
                        className="grid grid-cols-[3.55rem_minmax(0,1fr)] gap-2 py-2.5 xl:grid-cols-[3.85rem_minmax(0,1fr)] xl:gap-2.5 xl:py-3"
                        key={event.id}
                      >
                        <div className="text-center uppercase leading-none">
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

                        <div className="grid gap-2">
                          <div>
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
                              {event.description}
                            </p>
                          </div>

                          <CMSLink
                            {...event.link}
                            className={cn(
                              getTextClassName({
                                base: 'justify-self-start whitespace-nowrap uppercase',
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

            <div className="relative min-h-56 overflow-hidden md:min-h-full">
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
        className="relative isolate grid min-h-64 overflow-hidden px-7 py-7 md:min-h-56 md:grid-cols-[minmax(0,1fr)_minmax(7rem,24%)] md:items-center md:py-6 md:pl-[65px] md:pr-8 xl:min-h-full xl:grid-cols-[minmax(0,1fr)_minmax(8rem,30%)] xl:py-7 xl:pl-14 xl:pr-9"
        style={{
          backgroundImage: resolveBackgroundImage(rightBackground),
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      >
        <div className="upcoming-events-cta-copy-backdrop relative z-10 flex w-full max-w-[30rem] flex-col justify-center md:max-w-[32rem]">
          <h2
            className={getTextClassName({
              base: 'uppercase',
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
                base: 'mt-4 max-w-[min(100%,30rem)] md:max-w-[min(100%,34rem)] xl:max-w-[24rem]',
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
              base: 'mt-6 inline-flex w-fit px-7 py-3 uppercase shadow-[0_5px_0_rgb(0_0_0_/_0.18)] md:mt-5 md:px-7 md:py-3 xl:mt-7 xl:px-8 xl:py-4',
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
          <div className="pointer-events-none absolute bottom-2 right-2 h-36 w-36 opacity-95 md:static md:justify-self-end md:self-center md:h-[clamp(7rem,18vw,10.5rem)] md:w-[clamp(7rem,18vw,10.5rem)] xl:h-64 xl:w-64">
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
