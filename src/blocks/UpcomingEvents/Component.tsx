import React from 'react'

import type {
  Event as EventDocument,
  Media as MediaDocument,
  UpcomingEventsBlock as UpcomingEventsBlockProps,
} from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { getEventPrimaryLink, getEventTypeLabel } from '@/blocks/EventSuite/shared'
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
import { Clock, MapPin, Tag, Ticket } from 'lucide-react'
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

const eventTimeFormatter = new Intl.DateTimeFormat('it-IT', {
  hour: '2-digit',
  minute: '2-digit',
})

const eventSelect = {
  activity: true,
  audience: true,
  description: true,
  startsAt: true,
  slug: true,
  timeLabel: true,
  title: true,
  venue: true,
  venueAddress: true,
} as const

type UpcomingEventData = Pick<
  EventDocument,
  | 'activity'
  | 'audience'
  | 'description'
  | 'id'
  | 'slug'
  | 'startsAt'
  | 'timeLabel'
  | 'title'
  | 'venue'
  | 'venueAddress'
>

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

const formatEventTime = (event: Pick<UpcomingEventData, 'startsAt' | 'timeLabel'>) =>
  event.timeLabel || `ore ${eventTimeFormatter.format(new Date(event.startsAt))}`

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
  ctaAccentLabel = 'Fai la differenza',
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
  eventLinkBackgroundImage,
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
  const ctaButtonLabel = ctaLink?.label || ctaLinkFallbackLabel || 'Unisciti a noi'
  const ctaButtonClassName = getTextClassName({
    base: 'inline-flex w-fit max-w-full justify-center px-7 py-3 text-center uppercase shadow-[0_5px_0_rgb(0_0_0_/_0.18)] [overflow-wrap:anywhere] md:px-8 md:py-3.5',
    fontSize: ctaButtonFontSize,
    fontWeight: ctaButtonFontWeight,
    letterSpacing: ctaButtonLetterSpacing,
  })
  const ctaButtonStyle: React.CSSProperties = {
    backgroundColor: ctaLinkBackgroundImage ? 'transparent' : ctaButtonBackgroundColor || '#84cc16',
    backgroundImage: resolveBackgroundImage(ctaLinkBackgroundImage),
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '100% 100%',
    clipPath: 'polygon(2% 0, 100% 0, 98% 93%, 0 100%)',
    color: ctaButtonTextColor || '#251414',
    fontFamily: getRecordValue(typographyFontFamilyStyles, ctaButtonFontFamily, 'cinzel'),
    fontStyle: ctaButtonFontStyle === 'italic' ? 'italic' : 'normal',
    transform: `scaleY(${getRecordValue(
      typographyVerticalScaleValues,
      ctaButtonVerticalScale,
      'normal',
    )})`,
    transformOrigin: 'center',
  }
  const ctaLinkHasHref = Boolean(
    ctaLink?.url ||
    (ctaLink?.type === 'reference' &&
      ctaLink.reference?.value &&
      typeof ctaLink.reference.value === 'object' &&
      ctaLink.reference.value.slug),
  )

  return (
    <section className="grid items-start gap-0">
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
          className="relative isolate overflow-hidden px-5 pb-5 pt-8 md:px-7 md:pb-6 md:pt-9 lg:px-9 lg:pb-6 lg:pt-8 xl:px-12 xl:pb-5 xl:pt-5"
          style={{
            clipPath: 'polygon(1% 2.5%, 99% 0.5%, 98% 97.5%, 1.5% 99%)',
          }}
        >
          <div className="grid gap-5 pt-4 md:pt-3 lg:grid-cols-[minmax(18rem,0.43fr)_minmax(0,0.57fr)] lg:items-stretch lg:gap-7 xl:gap-10 xl:pt-2">
            <div className="grid content-center">
              <div className="upcoming-events-event-card-border scribble-border vintage-surface relative max-w-[34rem] divide-y divide-[#7b5a2f]/35 px-5 py-4 shadow-[0_18px_40px_rgb(0_0_0_/_0.28)] md:px-6 md:py-5 lg:max-w-none xl:px-7 xl:py-5">
                {eventItems.length ? (
                  eventItems.map((event) => {
                    const formattedDate = formatEventDate(event.startsAt)
                    const eventPrimaryLink = getEventPrimaryLink(event)
                    const eventTypeLabel = getEventTypeLabel(event.activity)
                    const eventMetaItems = [
                      {
                        Icon: MapPin,
                        color: eventLinkColor || '#a3e635',
                        label: event.venue,
                      },
                      {
                        Icon: Tag,
                        color: eventLinkColor || '#a3e635',
                        label: eventTypeLabel,
                      },
                      {
                        Icon: Ticket,
                        color: dateColor || '#e879f9',
                        label: event.audience,
                      },
                    ].filter((item): item is typeof item & { label: string } => Boolean(item.label))

                    return (
                      <article
                        className="grid grid-cols-[4rem_minmax(0,1fr)] items-start gap-3 py-3 first:pt-0 last:pb-0 md:grid-cols-[4.45rem_minmax(0,1fr)] xl:gap-4"
                        key={event.id}
                      >
                        <div className="grid justify-self-start text-left uppercase leading-none">
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
                          <div
                            className="mt-3 inline-flex items-center gap-1 text-[0.62rem] font-semibold normal-case leading-none tracking-[0.02em]"
                            style={{
                              color: eventTextColor || '#d7d0d3',
                              fontFamily: getRecordValue(
                                typographyFontFamilyStyles,
                                eventTextFontFamily,
                                'geistSans',
                              ),
                            }}
                          >
                            <Clock
                              aria-hidden
                              className="h-3 w-3 shrink-0"
                              style={{ color: eventLinkColor || '#a3e635' }}
                              strokeWidth={2.5}
                            />
                            <span>{formatEventTime(event)}</span>
                          </div>
                        </div>

                        <div className="grid min-w-0 gap-2">
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
                                base: 'mt-1 max-w-[24rem]',
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

                          {eventMetaItems.length ? (
                            <div className="grid gap-1">
                              {eventMetaItems.map(({ Icon, color, label }) => (
                                <div
                                  className="flex min-w-0 items-center gap-1.5 text-[0.62rem] font-semibold leading-tight"
                                  key={label}
                                  style={{
                                    color: eventTextColor || '#d7d0d3',
                                    fontFamily: getRecordValue(
                                      typographyFontFamilyStyles,
                                      eventTextFontFamily,
                                      'geistSans',
                                    ),
                                  }}
                                >
                                  <Icon
                                    aria-hidden
                                    className="h-3 w-3 shrink-0"
                                    style={{ color }}
                                    strokeWidth={3}
                                  />
                                  <span className="min-w-0 truncate">{label}</span>
                                </div>
                              ))}
                            </div>
                          ) : null}

                          <span className="inline-flex w-fit items-start justify-self-start">
                            <CMSLink
                              {...eventPrimaryLink}
                              className={cn(
                                getTextClassName({
                                  base: 'whitespace-nowrap px-5 py-2 text-center uppercase shadow-[0_3px_0_rgb(0_0_0_/_0.22)]',
                                  fontSize: eventLinkFontSize,
                                  fontWeight: eventLinkFontWeight,
                                  letterSpacing: eventLinkLetterSpacing,
                                }),
                                'text-[0.58rem] md:text-[0.62rem]',
                              )}
                              label={eventLinkLabel || 'Scopri di piu'}
                              style={{
                                backgroundColor: eventLinkBackgroundImage
                                  ? 'transparent'
                                  : eventLinkColor || '#a3e635',
                                backgroundImage: resolveBackgroundImage(eventLinkBackgroundImage),
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                                backgroundSize: '100% 100%',
                                clipPath: 'polygon(3% 0, 100% 0, 97% 92%, 0 100%)',
                                color: '#211713',
                                fontFamily: getRecordValue(
                                  typographyFontFamilyStyles,
                                  eventLinkFontFamily,
                                  'cinzel',
                                ),
                                fontStyle: eventLinkFontStyle === 'italic' ? 'italic' : 'normal',
                                transform: `scaleY(${getRecordValue(
                                  typographyVerticalScaleValues,
                                  eventLinkVerticalScale,
                                  'normal',
                                )})`,
                                transformOrigin: 'center',
                              }}
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

            <div className="upcoming-events-feature-frame relative min-h-56 overflow-hidden md:min-h-72 lg:min-h-[17rem] lg:self-stretch xl:min-h-[17.8rem]">
              {featureImage && typeof featureImage === 'object' ? (
                <Media
                  fill
                  imgClassName="object-cover object-center saturate-[0.95] contrast-[1.04]"
                  pictureClassName="absolute inset-[3.5%] z-10"
                  resource={featureImage}
                  size="(max-width: 767px) 100vw, (max-width: 1279px) 92vw, 52vw"
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <aside
        className="upcoming-events-cta-strip relative isolate -mt-1 min-h-[13.5rem] w-full overflow-hidden md:min-h-[12rem] lg:min-h-[10.75rem] xl:min-h-[11.25rem]"
        style={{
          backgroundImage: resolveBackgroundImage(rightBackground),
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      >
        <div className="pointer-events-none absolute inset-0 bg-black/10" />

        {ctaGlyph && typeof ctaGlyph === 'object' ? (
          <div className="pointer-events-none absolute bottom-[-18%] left-[2%] z-0 h-36 w-36 opacity-95 md:bottom-[-24%] md:left-[5%] md:h-44 md:w-44 xl:h-52 xl:w-52">
            <Media
              fill
              imgClassName="object-contain"
              pictureClassName="absolute inset-0"
              resource={ctaGlyph}
              size="(max-width: 767px) 9rem, (max-width: 1279px) 11rem, 13rem"
            />
          </div>
        ) : null}

        <div className="relative z-10 grid min-h-[13.5rem] items-center gap-6 px-6 py-7 md:min-h-[12rem] md:grid-cols-[minmax(0,1fr)_auto] md:px-10 lg:min-h-[10.75rem] lg:px-16 lg:py-6 xl:min-h-[11.25rem] xl:grid-cols-[minmax(0,1fr)_minmax(13rem,0.34fr)] xl:px-24">
          <div className="upcoming-events-cta-copy-backdrop relative z-10 min-w-0 max-w-[50rem] justify-self-center text-center md:justify-self-start md:pl-[20%] md:text-left lg:pl-[18%] xl:pl-[16%]">
            <h2
              className={getTextClassName({
                base: 'max-w-full uppercase [overflow-wrap:anywhere]',
                fontSize: ctaTitleFontSize,
                fontWeight: ctaTitleFontWeight,
                letterSpacing: ctaTitleLetterSpacing,
                sizeKind: 'display',
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
                  base: 'mt-3 max-w-[38rem] [overflow-wrap:anywhere]',
                  fontSize: ctaTextFontSize,
                  fontWeight: ctaTextFontWeight,
                  letterSpacing: ctaTextLetterSpacing,
                })}
                style={{
                  ...getTextStyle({
                    color: ctaTextColor || '#ffffff',
                    fontFamily: ctaTextFontFamily,
                    fontStyle: ctaTextFontStyle,
                    verticalScale: ctaTextVerticalScale,
                  }),
                  display: 'block',
                }}
              >
                {ctaText}
              </p>
            ) : null}
          </div>

          <div className="relative z-10 grid justify-items-center gap-3 md:justify-self-end">
            {ctaLinkHasHref ? (
              <CMSLink
                {...ctaLink}
                className={ctaButtonClassName}
                label={ctaButtonLabel}
                style={ctaButtonStyle}
              />
            ) : (
              <span className={ctaButtonClassName} style={ctaButtonStyle}>
                {ctaButtonLabel}
              </span>
            )}
            {ctaAccentLabel ? (
              <div className="upcoming-events-cta-accent flex items-center gap-4">
                <span className="upcoming-events-cta-accent-arrow" aria-hidden />
                <span className="grid justify-items-start">
                  <span
                    className="whitespace-nowrap text-sm font-semibold leading-none md:text-base"
                    style={{
                      color: ctaTextColor || '#ffffff',
                      fontFamily: getRecordValue(
                        typographyFontFamilyStyles,
                        ctaTextFontFamily,
                        'geistSans',
                      ),
                      fontStyle: ctaTextFontStyle === 'italic' ? 'italic' : 'normal',
                    }}
                  >
                    {ctaAccentLabel}
                  </span>
                  <span className="upcoming-events-cta-accent-underline" aria-hidden />
                </span>
              </div>
            ) : null}
          </div>
        </div>
      </aside>
    </section>
  )
}
