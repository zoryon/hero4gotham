'use client'

import React from 'react'
import { CalendarDays, Check, ChevronDown, Search, Sparkles } from 'lucide-react'

import type { EventFiltersBlock as EventFiltersBlockProps } from '@/payload-types'

import { useEventFilters } from '@/providers/EventFilters'
import { cn } from '@/utilities/ui'
import {
  typographyFontFamilyStyles,
  typographyFontWeightClasses,
  typographyLetterSpacingClasses,
  typographyVerticalScaleValues,
} from '@/fields/typography'

export type EventFilterActivity = {
  iconAlt: string
  iconUrl: null | string
  id: number
  label: string
}

type Props = EventFiltersBlockProps & {
  activities: EventFilterActivity[]
}

type TextStyle = NonNullable<EventFiltersBlockProps['activityTextStyle']>

const themeColorValues = {
  accent: 'var(--theme-text-accent)',
  black: '#000000',
  default: undefined,
  green: 'var(--theme-text-green)',
  muted: 'var(--theme-text-muted)',
  primary: 'var(--theme-text-primary)',
  secondary: 'var(--theme-text-secondary)',
  white: '#ffffff',
} as const

const controlBase =
  'min-h-11 w-full appearance-none border-0 bg-transparent px-4 outline-none transition focus:outline-none focus-visible:outline-none focus-visible:ring-0'

const getTextColor = (style: TextStyle | null | undefined, fallback: string) => {
  if (style?.colorMode === 'global') {
    return themeColorValues[(style.colorGlobal || 'default') as keyof typeof themeColorValues] || fallback
  }

  return style?.colorCustom || fallback
}

const getTextClassName = (style: TextStyle | null | undefined, base?: string) =>
  cn(
    base,
    typographyFontWeightClasses[
      (style?.fontWeight || 'black') as keyof typeof typographyFontWeightClasses
    ],
    typographyLetterSpacingClasses[
      (style?.letterSpacing || 'tight') as keyof typeof typographyLetterSpacingClasses
    ],
    style?.textTransform === 'uppercase' && 'uppercase',
  )

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
    color: getTextColor(style, fallback.color),
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

export const EventFiltersClient: React.FC<Props> = ({
  accentColor = '#93b51f',
  activeActivityTextStyle,
  activities,
  activityTextStyle,
  activityItemBorder = false,
  allEventsLabel = 'Tutti gli eventi',
  controlTextStyle,
  dateBorder = false,
  dateLabel = 'Data',
  filterByLabel = 'Filtra per:',
  filterLabelTextStyle,
  mutedColor = 'rgba(243,238,229,0.68)',
  searchBorder = false,
  searchPlaceholder = 'Cerca un evento...',
  textColor = '#f3eee5',
  typeLabel = 'Tipo',
}) => {
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = React.useState(false)
  const typeDropdownRef = React.useRef<HTMLDivElement>(null)
  const { activityId, date, query, setActivityId, setDate, setQuery } = useEventFilters()
  const resolvedAccentColor = accentColor || '#93b51f'
  const resolvedMutedColor = mutedColor || 'rgba(243,238,229,0.68)'
  const resolvedTextColor = textColor || '#f3eee5'
  const visibleActivities = activities.slice(0, 8)
  const specialBorderClass = 'scribble-border event-filter-control-border'
  const selectedActivity =
    activityId === 'all'
      ? null
      : visibleActivities.find((activity) => activity.id === activityId) || null
  const resolvedTypeLabel = typeLabel?.toLowerCase() === 'tipologia' ? 'Tipo' : typeLabel || 'Tipo'
  const selectedTypeLabel = selectedActivity?.label || allEventsLabel
  const dropdownOptions = [
    {
      iconAlt: allEventsLabel,
      iconUrl: null,
      id: 'all' as const,
      label: allEventsLabel,
    },
    ...visibleActivities,
  ]

  const activityTextFallback = {
    color: resolvedTextColor,
    fontFamily: 'geistSans',
    fontSizeDesktop: 12,
    fontSizeMobile: 12,
    fontStyle: 'normal',
    lineHeight: 1,
    verticalScale: 'normal',
  } as const
  const activeActivityTextFallback = {
    ...activityTextFallback,
    color: resolvedAccentColor,
  } as const
  const controlTextFallback = {
    color: resolvedTextColor,
    fontFamily: 'geistSans',
    fontSizeDesktop: 14,
    fontSizeMobile: 14,
    fontStyle: 'normal',
    lineHeight: 1.15,
    verticalScale: 'normal',
  } as const
  const filterLabelTextFallback = {
    color: resolvedAccentColor,
    fontFamily: 'geistSans',
    fontSizeDesktop: 12,
    fontSizeMobile: 12,
    fontStyle: 'normal',
    lineHeight: 1,
    verticalScale: 'normal',
  } as const

  React.useEffect(() => {
    if (!isTypeDropdownOpen) return

    const handlePointerDown = (event: PointerEvent) => {
      if (!typeDropdownRef.current?.contains(event.target as Node)) {
        setIsTypeDropdownOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsTypeDropdownOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isTypeDropdownOpen])

  return (
    <section
      className="event-filters w-full"
      style={
        {
          '--event-filters-accent': resolvedAccentColor,
          '--event-filters-muted': resolvedMutedColor,
          '--event-filters-text': resolvedTextColor,
        } as React.CSSProperties
      }
    >
      <div className="relative z-30" ref={typeDropdownRef}>
        <button
          aria-expanded={isTypeDropdownOpen}
          aria-haspopup="listbox"
          className={cn(
            'relative flex min-h-12 w-full items-center gap-3 border-0 px-4 py-2 text-left outline-none transition focus:outline-none focus-visible:outline-none focus-visible:ring-0 lg:min-h-11 lg:max-w-[20rem] lg:px-3',
            activityItemBorder && specialBorderClass,
          )}
          onClick={() => setIsTypeDropdownOpen((current) => !current)}
          type="button"
        >
          {selectedActivity?.iconUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt={selectedActivity.iconAlt}
              className="h-7 w-7 shrink-0 object-contain lg:h-6 lg:w-6"
              src={selectedActivity.iconUrl}
            />
          ) : (
            <Sparkles
              aria-hidden
              className="h-7 w-7 shrink-0 lg:h-6 lg:w-6"
              style={{ color: resolvedAccentColor }}
            />
          )}
          <span className="grid min-w-0 flex-1 gap-1">
            <span
              className={getTextClassName(
                filterLabelTextStyle,
                'inline-flex items-center gap-1 text-[length:var(--event-filters-filter-label-font-size-mobile)] md:text-[length:var(--event-filters-filter-label-font-size-desktop)]',
              )}
              style={getTextStyle(
                filterLabelTextStyle,
                filterLabelTextFallback,
                'event-filters-filter-label',
              )}
            >
              {resolvedTypeLabel}
              <ChevronDown
                aria-hidden
                className={cn(
                  'h-3.5 w-3.5 transition-transform',
                  isTypeDropdownOpen && 'rotate-180',
                )}
              />
            </span>
            <span
              className={getTextClassName(
                activityId === 'all' ? activeActivityTextStyle : activityTextStyle,
                'truncate text-[length:var(--event-filters-activity-font-size-mobile)] md:text-[length:var(--event-filters-activity-font-size-desktop)]',
              )}
              style={getTextStyle(
                activityId === 'all' ? activeActivityTextStyle : activityTextStyle,
                activityId === 'all' ? activeActivityTextFallback : activityTextFallback,
                'event-filters-activity',
              )}
            >
              {selectedTypeLabel}
            </span>
          </span>
        </button>

        {isTypeDropdownOpen ? (
          <div
            className={cn(
              'event-filter-type-menu absolute left-0 right-0 top-[calc(100%+0.55rem)] z-50 overflow-hidden px-2 py-2 lg:right-auto lg:w-[20rem] lg:px-1.5 lg:py-1.5',
              activityItemBorder && specialBorderClass,
            )}
            role="listbox"
          >
            <div className="grid h-[12rem] gap-1 overflow-y-auto overscroll-contain pr-1 [-webkit-overflow-scrolling:touch] lg:h-[10.5rem]">
              {dropdownOptions.map((option) => {
                const isSelected = activityId === option.id

                return (
                  <button
                    aria-selected={isSelected}
                    className="flex min-h-11 w-full items-center gap-3 border-0 px-3 py-2 text-left outline-none transition hover:bg-white/10 focus:outline-none focus-visible:outline-none focus-visible:ring-0 lg:min-h-10"
                    key={option.id}
                    onClick={() => {
                      setActivityId(option.id)
                      setIsTypeDropdownOpen(false)
                    }}
                    role="option"
                    type="button"
                  >
                    {option.iconUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        alt={option.iconAlt}
                        className="h-7 w-7 shrink-0 object-contain lg:h-6 lg:w-6"
                        src={option.iconUrl}
                      />
                    ) : (
                      <Sparkles
                        aria-hidden
                        className="h-6 w-6 shrink-0 lg:h-5 lg:w-5"
                        style={{ color: isSelected ? resolvedAccentColor : resolvedMutedColor }}
                      />
                    )}
                    <span
                      className={getTextClassName(
                        isSelected ? activeActivityTextStyle : activityTextStyle,
                        'min-w-0 flex-1 truncate text-[length:var(--event-filters-activity-font-size-mobile)] md:text-[length:var(--event-filters-activity-font-size-desktop)]',
                      )}
                      style={getTextStyle(
                        isSelected ? activeActivityTextStyle : activityTextStyle,
                        isSelected ? activeActivityTextFallback : activityTextFallback,
                        'event-filters-activity',
                      )}
                    >
                      {option.label}
                    </span>
                    {isSelected ? (
                      <Check
                        aria-hidden
                        className="h-4 w-4 shrink-0"
                        style={{ color: resolvedAccentColor }}
                      />
                    ) : null}
                  </button>
                )
              })}
            </div>
          </div>
        ) : null}
      </div>

      <div className="event-filters__activity-grid hidden grid-cols-1 gap-0 overflow-visible pb-0">
        <button
          className={cn(
            'group relative flex min-h-14 w-full min-w-0 items-center gap-3 border-0 px-4 py-2 text-left outline-none transition focus:outline-none focus-visible:outline-none focus-visible:ring-0',
            activityItemBorder && specialBorderClass,
          )}
          onClick={() => setActivityId('all')}
          type="button"
        >
          <Sparkles aria-hidden className="h-7 w-7 shrink-0" style={{ color: resolvedAccentColor }} />
          <span
            className={getTextClassName(
              activityId === 'all' ? activeActivityTextStyle : activityTextStyle,
              'text-[length:var(--event-filters-activity-font-size-mobile)] md:text-[length:var(--event-filters-activity-font-size-desktop)]',
            )}
            style={getTextStyle(
              activityId === 'all' ? activeActivityTextStyle : activityTextStyle,
              activityId === 'all' ? activeActivityTextFallback : activityTextFallback,
              'event-filters-activity',
            )}
          >
            {allEventsLabel}
          </span>
        </button>

        {visibleActivities.map((activity) => {
          const isActive = activityId === activity.id

          return (
            <button
              className={cn(
                'group relative flex min-h-14 w-full min-w-0 items-center gap-3 border-0 px-4 py-2 text-left outline-none transition focus:outline-none focus-visible:outline-none focus-visible:ring-0',
                activityItemBorder && specialBorderClass,
              )}
              key={activity.id}
              onClick={() => setActivityId(activity.id)}
              type="button"
            >
              {activity.iconUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  alt={activity.iconAlt}
                  className="h-8 w-8 shrink-0 object-contain"
                  src={activity.iconUrl}
                />
              ) : (
                <Sparkles
                  aria-hidden
                  className="h-7 w-7 shrink-0"
                  style={{ color: isActive ? resolvedAccentColor : resolvedMutedColor }}
                />
              )}
              <span
                className={getTextClassName(
                  isActive ? activeActivityTextStyle : activityTextStyle,
                  'text-[length:var(--event-filters-activity-font-size-mobile)] md:text-[length:var(--event-filters-activity-font-size-desktop)]',
                )}
                style={getTextStyle(
                  isActive ? activeActivityTextStyle : activityTextStyle,
                  isActive ? activeActivityTextFallback : activityTextFallback,
                  'event-filters-activity',
                )}
              >
                {activity.label}
              </span>
            </button>
          )
        })}
      </div>

      <div className="mt-3 grid gap-0 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
        <label
          className={cn(
            'relative flex min-h-11 items-center gap-3 px-4',
            searchBorder && specialBorderClass,
          )}
        >
          <input
            className={cn(
              'min-w-0 flex-1 border-0 bg-transparent outline-none placeholder:text-[color:var(--event-filters-muted)] focus:outline-none focus-visible:outline-none focus-visible:ring-0',
              getTextClassName(
                controlTextStyle,
                'text-[length:var(--event-filters-control-font-size-mobile)] md:text-[length:var(--event-filters-control-font-size-desktop)]',
              ),
            )}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={searchPlaceholder}
            style={getTextStyle(controlTextStyle, controlTextFallback, 'event-filters-control')}
            type="search"
            value={query}
          />
          <Search aria-hidden className="h-5 w-5 shrink-0" style={{ color: resolvedMutedColor }} />
        </label>

        <div className="grid gap-0 sm:grid-cols-[auto_minmax(9rem,12rem)] sm:items-center">
          <span
            className={getTextClassName(
              filterLabelTextStyle,
              'hidden text-[length:var(--event-filters-filter-label-font-size-mobile)] md:text-[length:var(--event-filters-filter-label-font-size-desktop)] sm:inline',
            )}
            style={getTextStyle(filterLabelTextStyle, filterLabelTextFallback, 'event-filters-filter-label')}
          >
            {filterByLabel}
          </span>

          <label
            className={cn('relative block', dateBorder && specialBorderClass)}
          >
            <CalendarDays
              aria-hidden
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
              style={{ color: resolvedMutedColor }}
            />
            <input
              aria-label={dateLabel}
              className={cn(
                controlBase,
                getTextClassName(
                  controlTextStyle,
                  'pl-10 pr-3 text-[length:var(--event-filters-control-font-size-mobile)] md:text-[length:var(--event-filters-control-font-size-desktop)]',
                ),
              )}
              onChange={(event) => setDate(event.target.value)}
              style={getTextStyle(controlTextStyle, controlTextFallback, 'event-filters-control')}
              type="date"
              value={date}
            />
          </label>

        </div>
      </div>
    </section>
  )
}
