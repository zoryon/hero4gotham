'use client'

import React from 'react'
import { Check, ChevronDown, ChevronLeft, ChevronRight, Search } from 'lucide-react'

import type { EventFiltersBlock as EventFiltersBlockProps } from '@/payload-types'

import { useEventFilters } from '@/providers/EventFilters'
import { cn } from '@/utilities/ui'
import {
  typographyFontFamilyStyles,
  typographyFontWeightClasses,
  typographyLetterSpacingClasses,
  typographyVerticalScaleValues,
} from '@/fields/typography'
import { formatTextTransform, textTransformClass } from '@/fields/uiOptions'

export type EventFilterActivity = {
  iconAlt: string
  iconUrl: null | string
  id: number
  label: string
}

type Props = EventFiltersBlockProps & {
  activities: EventFilterActivity[]
  venues: string[]
}

type TextStyle = NonNullable<EventFiltersBlockProps['controlTextStyle']>
type ActiveDropdown = 'date' | 'type' | 'venue' | null
type CalendarCell = {
  date: Date
  inCurrentMonth: boolean
}

const themeColorValues = {
  accent: 'var(--theme-text-accent)',
  black: '#000000',
  default: undefined,
  green: 'var(--theme-text-green)',
  muted: 'var(--theme-text-muted)',
  primary: 'var(--theme-text-primary)',
  purple: 'var(--theme-text-purple)',
  secondary: 'var(--theme-text-secondary)',
  white: '#ffffff',
} as const

const getTextColor = (style: TextStyle | null | undefined, fallback: string) => {
  if (style?.colorMode === 'global') {
    return (
      themeColorValues[(style.colorGlobal || 'default') as keyof typeof themeColorValues] ||
      fallback
    )
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
    textTransformClass(style?.textTransform),
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

const dateDisplayFormatter = new Intl.DateTimeFormat('it-IT', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

const monthDisplayFormatter = new Intl.DateTimeFormat('it-IT', {
  month: 'long',
  year: 'numeric',
})

const weekdayLabels = ['L', 'M', 'M', 'G', 'V', 'S', 'D']

const getDateFromValue = (value: string) => {
  const [year, month, day] = value.split('-').map(Number)

  if (!year || !month || !day) {
    return null
  }

  return new Date(year, month - 1, day)
}

const getDateValue = (value: Date) => {
  const year = value.getFullYear()
  const month = `${value.getMonth() + 1}`.padStart(2, '0')
  const day = `${value.getDate()}`.padStart(2, '0')

  return `${year}-${month}-${day}`
}

const getMonthStart = (value: Date) => new Date(value.getFullYear(), value.getMonth(), 1)

const getNextMonth = (value: Date, direction: -1 | 1) =>
  new Date(value.getFullYear(), value.getMonth() + direction, 1)

const getCalendarCells = (monthDate: Date) => {
  const year = monthDate.getFullYear()
  const month = monthDate.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const mondayFirstOffset = (new Date(year, month, 1).getDay() + 6) % 7
  const previousMonthDays = new Date(year, month, 0).getDate()
  const cells: CalendarCell[] = []

  for (let day = mondayFirstOffset; day > 0; day -= 1) {
    cells.push({
      date: new Date(year, month - 1, previousMonthDays - day + 1),
      inCurrentMonth: false,
    })
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({
      date: new Date(year, month, day),
      inCurrentMonth: true,
    })
  }

  while (cells.length % 7 !== 0) {
    const nextDay = cells.length - mondayFirstOffset - daysInMonth + 1

    cells.push({
      date: new Date(year, month + 1, nextDay),
      inCurrentMonth: false,
    })
  }

  return cells
}

export const EventFiltersClient: React.FC<Props> = ({
  accentColor = '#93b51f',
  activities,
  allVenuesLabel = 'Tutti i luoghi',
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
  typeBorder = false,
  typeLabel = 'Tipologia',
  venueBorder = false,
  venueLabel = 'Luogo',
  venues,
}) => {
  const { activityId, date, query, setActivityId, setDate, setQuery, setVenue, venue } =
    useEventFilters()
  const filtersRef = React.useRef<HTMLElement>(null)
  const [activeDropdown, setActiveDropdown] = React.useState<ActiveDropdown>(null)
  const [calendarMonth, setCalendarMonth] = React.useState(() =>
    getMonthStart(getDateFromValue(date) || new Date()),
  )
  const resolvedAccentColor = accentColor || '#93b51f'
  const resolvedMutedColor = mutedColor || 'rgba(243,238,229,0.68)'
  const resolvedTextColor = textColor || '#f3eee5'
  const visibleActivities = activities.slice(0, 8)
  const specialBorderClass = 'scribble-border event-filter-control-border'
  const resolvedTypeLabel = typeLabel || 'Tipologia'
  const resolvedVenueLabel = venueLabel || 'Luogo'
  const dropdownOptions = [
    {
      iconAlt: allEventsLabel,
      iconUrl: null,
      id: 'all' as const,
      label: allEventsLabel,
    },
    ...visibleActivities,
  ]
  const selectedActivityValue = activityId === 'all' ? 'all' : String(activityId)
  const selectedActivityLabel =
    dropdownOptions.find((option) => String(option.id) === selectedActivityValue)?.label ||
    allEventsLabel
  const uniqueVenues = Array.from(new Set(venues.filter(Boolean)))
  const selectedDate = getDateFromValue(date)
  const selectedDateLabel = selectedDate
    ? dateDisplayFormatter.format(selectedDate)
    : 'Tutte le date'
  const selectedDateValue = selectedDate ? getDateValue(selectedDate) : ''
  const todayValue = getDateValue(new Date())
  const calendarCells = getCalendarCells(calendarMonth)

  const controlTextFallback = {
    color: resolvedTextColor,
    fontFamily: 'geistSans',
    fontSizeDesktop: 14,
    fontSizeMobile: 14,
    fontStyle: 'normal',
    lineHeight: 1.15,
    verticalScale: 'normal',
  } as const
  const controlButtonClassName = getTextClassName(
    controlTextStyle,
    'grid min-h-10 w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-0 bg-transparent px-3 py-2 text-left outline-none transition hover:bg-white/[0.03] focus:bg-white/[0.03] focus:outline-none focus-visible:outline-none focus-visible:ring-0 text-[length:var(--event-filters-control-font-size-mobile)] md:text-[length:var(--event-filters-control-font-size-desktop)]',
  )
  const menuButtonClassName = getTextClassName(
    controlTextStyle,
    'grid min-h-9 w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-2 border-0 border-t border-white/10 bg-transparent px-3 py-2 text-left outline-none transition first:border-t-0 hover:bg-[#2b2b2b] focus:bg-[#2b2b2b] focus:outline-none focus-visible:outline-none focus-visible:ring-0 text-[length:var(--event-filters-control-font-size-mobile)] md:text-[length:var(--event-filters-control-font-size-desktop)]',
  )
  const calendarMonthClassName = getTextClassName(
    controlTextStyle,
    'min-w-0 truncate text-center text-[length:var(--event-filters-control-font-size-mobile)] md:text-[length:var(--event-filters-control-font-size-desktop)]',
  )
  const filterLabelTextFallback = {
    color: resolvedAccentColor,
    fontFamily: 'geistSans',
    fontSizeDesktop: 12,
    fontSizeMobile: 12,
    fontStyle: 'normal',
    lineHeight: 1,
    verticalScale: 'normal',
  } as const
  const filterLabelClassName = getTextClassName(
    filterLabelTextStyle,
    'text-[length:var(--event-filters-filter-label-font-size-mobile)] md:text-[length:var(--event-filters-filter-label-font-size-desktop)]',
  )
  const inlineFilterLabelClassName = getTextClassName(
    filterLabelTextStyle,
    'pointer-events-none text-[length:var(--event-filters-filter-label-font-size-mobile)] md:text-[length:var(--event-filters-filter-label-font-size-desktop)]',
  )
  const controlTextStyles = getTextStyle(
    controlTextStyle,
    controlTextFallback,
    'event-filters-control',
  )
  const filterLabelStyles = getTextStyle(
    filterLabelTextStyle,
    filterLabelTextFallback,
    'event-filters-filter-label',
  )
  const menuPanelStyles = {
    backgroundColor: '#1f1f1f',
    borderColor: 'rgba(255,255,255,0.22)',
    boxShadow: '0 18px 32px rgb(0 0 0 / 0.38)',
  }
  const formatControlText = (value: string | null | undefined) =>
    formatTextTransform(value, controlTextStyle?.textTransform)
  const formatFilterText = (value: string | null | undefined) =>
    formatTextTransform(value, filterLabelTextStyle?.textTransform)

  React.useEffect(() => {
    const nextDate = getDateFromValue(date)

    if (nextDate) {
      setCalendarMonth(getMonthStart(nextDate))
    }
  }, [date])

  React.useEffect(() => {
    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (!filtersRef.current?.contains(event.target as Node)) {
        setActiveDropdown(null)
      }
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveDropdown(null)
      }
    }

    document.addEventListener('pointerdown', closeOnOutsidePointer)
    document.addEventListener('keydown', closeOnEscape)

    return () => {
      document.removeEventListener('pointerdown', closeOnOutsidePointer)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [])

  return (
    <section
      ref={filtersRef}
      className="event-filters vintage-surface relative isolate px-3 py-3 md:px-5 md:py-4"
      style={
        {
          '--event-filters-accent': resolvedAccentColor,
          '--event-filters-muted': resolvedMutedColor,
          '--event-filters-text': resolvedTextColor,
        } as React.CSSProperties
      }
    >
      <div className={cn('relative grid gap-y-4', activeDropdown ? 'z-[70]' : 'z-10')}>
        <label
          className={cn(
            'relative flex min-h-11 items-center gap-3 px-4 py-1',
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
            style={controlTextStyles}
            type="search"
            value={query}
          />
          <Search aria-hidden className="h-5 w-5 shrink-0" style={{ color: resolvedMutedColor }} />
        </label>

        <div className="grid gap-y-1">
          <span className={filterLabelClassName} style={filterLabelStyles}>
            {formatFilterText(filterByLabel)}
          </span>

          <div className="grid gap-1 lg:grid-cols-3 lg:items-center lg:gap-5">
            <div
              className={cn(
                'relative block min-h-10',
                activeDropdown === 'type' && 'z-[80]',
                typeBorder && specialBorderClass,
              )}
            >
              <button
                aria-expanded={activeDropdown === 'type'}
                aria-label={resolvedTypeLabel}
                className={controlButtonClassName}
                onClick={() => setActiveDropdown((current) => (current === 'type' ? null : 'type'))}
                style={controlTextStyles}
                type="button"
              >
                <span className={inlineFilterLabelClassName} style={filterLabelStyles}>
                  {formatFilterText(resolvedTypeLabel)}
                </span>
                <span className="min-w-0 truncate">{formatControlText(selectedActivityLabel)}</span>
                <ChevronDown
                  aria-hidden
                  className={cn(
                    'h-4 w-4 shrink-0 transition',
                    activeDropdown === 'type' && 'rotate-180',
                  )}
                  style={{ color: resolvedAccentColor }}
                />
              </button>

              {activeDropdown === 'type' ? (
                <div
                  className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 grid max-h-72 overflow-y-auto border"
                  style={menuPanelStyles}
                >
                  {dropdownOptions.map((option) => {
                    const optionValue = option.id === 'all' ? 'all' : String(option.id)
                    const isSelected = optionValue === selectedActivityValue

                    return (
                      <button
                        key={option.id}
                        className={cn(menuButtonClassName, isSelected && 'bg-[#2b2b2b]')}
                        onClick={() => {
                          setActivityId(option.id === 'all' ? 'all' : option.id)
                          setActiveDropdown(null)
                        }}
                        style={controlTextStyles}
                        type="button"
                      >
                        <span className="min-w-0 truncate">{formatControlText(option.label)}</span>
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
              ) : null}
            </div>

            <div
              className={cn(
                'relative block min-h-10',
                activeDropdown === 'date' && 'z-[80]',
                dateBorder && specialBorderClass,
              )}
            >
              <button
                aria-expanded={activeDropdown === 'date'}
                aria-label={dateLabel}
                className={controlButtonClassName}
                onClick={() => setActiveDropdown((current) => (current === 'date' ? null : 'date'))}
                style={controlTextStyles}
                type="button"
              >
                <span className={inlineFilterLabelClassName} style={filterLabelStyles}>
                  {formatFilterText(dateLabel)}
                </span>
                <span className="min-w-0 truncate">{formatControlText(selectedDateLabel)}</span>
                <ChevronDown
                  aria-hidden
                  className={cn(
                    'h-4 w-4 shrink-0 transition',
                    activeDropdown === 'date' && 'rotate-180',
                  )}
                  style={{ color: resolvedAccentColor }}
                />
              </button>

              {activeDropdown === 'date' ? (
                <div
                  className="absolute left-0 top-[calc(100%+0.5rem)] z-50 w-[min(20rem,calc(100vw-2rem))] overflow-hidden border sm:w-[min(22rem,calc(100vw-2rem))]"
                  style={menuPanelStyles}
                >
                  <div className="grid grid-cols-[2rem_minmax(0,1fr)_2rem] items-center border-b border-white/10 bg-[#242424]">
                    <button
                      aria-label="Mese precedente"
                      className="grid h-9 w-8 place-items-center bg-transparent outline-none transition hover:bg-[#303030] focus:bg-[#303030] focus:outline-none focus-visible:outline-none focus-visible:ring-0"
                      onClick={() => setCalendarMonth((current) => getNextMonth(current, -1))}
                      type="button"
                    >
                      <ChevronLeft
                        aria-hidden
                        className="h-4 w-4"
                        style={{ color: resolvedAccentColor }}
                      />
                    </button>
                    <span className={calendarMonthClassName} style={controlTextStyles}>
                      {monthDisplayFormatter.format(calendarMonth)}
                    </span>
                    <button
                      aria-label="Mese successivo"
                      className="grid h-9 w-8 place-items-center bg-transparent outline-none transition hover:bg-[#303030] focus:bg-[#303030] focus:outline-none focus-visible:outline-none focus-visible:ring-0"
                      onClick={() => setCalendarMonth((current) => getNextMonth(current, 1))}
                      type="button"
                    >
                      <ChevronRight
                        aria-hidden
                        className="h-4 w-4"
                        style={{ color: resolvedAccentColor }}
                      />
                    </button>
                  </div>

                  <div className="grid grid-cols-7 bg-[#1b1b1b]">
                    {weekdayLabels.map((weekday, index) => (
                      <span
                        key={`${weekday}-${index}`}
                        className={cn(
                          filterLabelClassName,
                          'grid h-9 place-items-center border-b border-white/10 bg-[#242424]',
                        )}
                        style={filterLabelStyles}
                      >
                        {weekday.toLowerCase()}
                      </span>
                    ))}
                    {calendarCells.map((cell) => {
                      const cellValue = getDateValue(cell.date)
                      const isSelected = cellValue === selectedDateValue
                      const isToday = cellValue === todayValue

                      return (
                        <button
                          key={cellValue}
                          className={cn(
                            'grid h-9 place-items-center border-0 border-r border-t border-white/10 bg-transparent px-0 text-center outline-none transition hover:bg-[#2b2b2b] focus:bg-[#2b2b2b] focus:outline-none focus-visible:outline-none focus-visible:ring-0 [&:nth-child(7n)]:border-r-0',
                            isSelected && 'bg-[#3a3a3a]',
                            !cell.inCurrentMonth && 'text-white/45',
                            getTextClassName(
                              controlTextStyle,
                              'text-[length:var(--event-filters-control-font-size-mobile)] md:text-[length:var(--event-filters-control-font-size-desktop)]',
                            ),
                          )}
                          onClick={() => {
                            setDate(cellValue)
                            setActiveDropdown(null)
                          }}
                          style={{
                            ...controlTextStyles,
                            color: !cell.inCurrentMonth
                              ? resolvedMutedColor
                              : isSelected
                                ? resolvedTextColor
                                : controlTextStyles.color,
                          }}
                          type="button"
                        >
                          <span
                            className={cn(
                              'grid h-7 w-7 place-items-center border border-transparent',
                              isToday && !isSelected && 'border-white/20',
                            )}
                          >
                            {cell.date.getDate()}
                          </span>
                        </button>
                      )
                    })}
                  </div>

                  <button
                    className={cn(menuButtonClassName, 'border-t border-white/10 bg-[#1f1f1f]')}
                    onClick={() => {
                      setDate('')
                      setActiveDropdown(null)
                    }}
                    style={controlTextStyles}
                    type="button"
                  >
                    <span>{formatControlText('Tutte le date')}</span>
                    {!date ? (
                      <Check
                        aria-hidden
                        className="h-4 w-4 shrink-0"
                        style={{ color: resolvedAccentColor }}
                      />
                    ) : null}
                  </button>
                </div>
              ) : null}
            </div>

            <div
              className={cn(
                'relative block min-h-10',
                activeDropdown === 'venue' && 'z-[80]',
                venueBorder && specialBorderClass,
              )}
            >
              <button
                aria-expanded={activeDropdown === 'venue'}
                aria-label={resolvedVenueLabel}
                className={controlButtonClassName}
                onClick={() =>
                  setActiveDropdown((current) => (current === 'venue' ? null : 'venue'))
                }
                style={controlTextStyles}
                type="button"
              >
                <span className={inlineFilterLabelClassName} style={filterLabelStyles}>
                  {formatFilterText(resolvedVenueLabel)}
                </span>
                <span className="min-w-0 truncate">
                  {formatControlText(venue || allVenuesLabel)}
                </span>
                <ChevronDown
                  aria-hidden
                  className={cn(
                    'h-4 w-4 shrink-0 transition',
                    activeDropdown === 'venue' && 'rotate-180',
                  )}
                  style={{ color: resolvedAccentColor }}
                />
              </button>

              {activeDropdown === 'venue' ? (
                <div
                  className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 grid max-h-72 overflow-y-auto border"
                  style={menuPanelStyles}
                >
                  {['', ...uniqueVenues].map((venueOption) => {
                    const optionLabel = venueOption || allVenuesLabel
                    const isSelected = venueOption === venue

                    return (
                      <button
                        key={optionLabel}
                        className={cn(menuButtonClassName, isSelected && 'bg-[#2b2b2b]')}
                        onClick={() => {
                          setVenue(venueOption)
                          setActiveDropdown(null)
                        }}
                        style={controlTextStyles}
                        type="button"
                      >
                        <span className="min-w-0 truncate">{formatControlText(optionLabel)}</span>
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
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
