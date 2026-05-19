import type { Metadata } from 'next'

import { Media } from '@/components/Media'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { SiteBackgroundFrame } from '@/SiteBackground/Component'
import type { Event as EventDocument, Media as MediaDocument } from '@/payload-types'
import {
  formatEventDateParts,
  getEventDisplayImage,
  getEventTypeLabel,
} from '@/blocks/EventSuite/shared'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { getServerSideURL } from '@/utilities/getURL'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { cn } from '@/utilities/ui'
import configPromise from '@payload-config'
import { ArrowLeft, ArrowRight, CalendarDays, Clock, Info, MapPin, UsersRound } from 'lucide-react'
import Link from 'next/link'
import { cache, type ReactNode } from 'react'
import { getPayload } from 'payload'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const events = await payload.find({
    collection: 'events',
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  return events.docs.flatMap(({ slug }) => (slug ? [{ slug }] : []))
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function EventPage({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const url = `/eventi/${decodedSlug}`
  const event = await queryEventBySlug({ slug: decodedSlug })

  if (!event) return <PayloadRedirects url={url} />

  const [siteBackground, relatedEvents] = await Promise.all([
    getCachedGlobal('siteBackground', 1)().catch(() => null),
    queryRelatedEvents({ eventId: event.id }),
  ])
  const dateParts = formatEventDateParts(event.startsAt)
  const fullMonth = new Intl.DateTimeFormat('it-IT', { month: 'long' })
    .format(new Date(event.startsAt))
    .toUpperCase()
  const eventTypeLabel = getEventTypeLabel(event.activity)
  const longDescription = event.longDescription?.trim()
  const timelineItems = (event.timeline || []).filter((item) => item.time && item.title)
  const artistsAndGuests = (event.artistsAndGuests || []).filter(
    (item) => item.firstName || item.lastName,
  )
  const usefulInfoItems = (event.usefulInfo || []).filter((item) => item.title || item.description)
  const galleryImages = event.gallery.flatMap((item) =>
    typeof item.image === 'object'
      ? [
          {
            caption: item.caption,
            image: item.image,
          },
        ]
      : [],
  )
  const galleryPreviewImages = galleryImages.slice(1)
  const fallbackBannerImage = galleryImages[0]?.image
  const visibleRelatedEvents = relatedEvents.filter((relatedEvent) => relatedEvent.slug)

  return (
    <article>
      <PayloadRedirects disableNotFound url={url} />

      <SiteBackgroundFrame isFirstPageBlock settings={siteBackground}>
        <header className="event-detail-hero">
          <div className="container relative z-10 mt-8 lg:mt-18 flex min-h-[inherit] items-center pb-6 md:pb-10">
            <div className="event-detail-hero__copy max-w-4xl pb-3 md:pb-6">
              <Link
                className="mb-7 inline-flex items-center gap-2 font-cinzel text-xs font-black uppercase leading-none text-[var(--theme-text-green)] underline decoration-[var(--theme-text-green)]/55 underline-offset-4 transition hover:text-[var(--theme-text-accent)]"
                href="/eventi"
              >
                <ArrowLeft aria-hidden className="h-4 w-4" />
                Eventi
              </Link>

              {eventTypeLabel ? (
                <p className="font-rye-western text-xs uppercase leading-none text-[#d777c6] md:text-sm">
                  {eventTypeLabel}
                </p>
              ) : null}
              <h1 className="font-rye-western mt-4 max-w-4xl text-5xl uppercase leading-[0.88] text-[var(--theme-text-secondary)] md:text-7xl lg:text-8xl">
                {event.title}
              </h1>
              {event.description ? (
                <p className="mt-5 max-w-3xl text-sm font-semibold leading-6 text-white md:text-base md:leading-7">
                  {event.description}
                </p>
              ) : null}
            </div>
          </div>
        </header>

        <div className="container pb-16 pt-4 md:pt-6">
          <section className="event-detail-banner scribble-border mb-5 md:mb-6">
            <div className="relative aspect-[16/7] min-h-[10rem] md:aspect-[21/6] md:min-h-0">
              {event.banner && typeof event.banner === 'object' ? (
                <Media
                  fill
                  imgClassName="object-cover object-center"
                  pictureClassName="absolute inset-0"
                  priority
                  resource={event.banner}
                  size="(max-width: 1536px) calc(100vw - 2rem), 1312px"
                />
              ) : fallbackBannerImage ? (
                <>
                  <Media
                    fill
                    imgClassName="object-cover object-center"
                    pictureClassName="absolute inset-0"
                    resource={fallbackBannerImage}
                    size="(max-width: 1536px) calc(100vw - 2rem), 1312px"
                  />
                  <div
                    aria-hidden
                    className="event-detail-banner__fallback-shade absolute inset-0"
                  />
                </>
              ) : (
                <div className="event-detail-banner__placeholder absolute inset-0" />
              )}
            </div>
          </section>

          <aside className="event-detail-info-bar scribble-border vintage-surface grid gap-0 p-5 md:grid-cols-2 xl:grid-cols-4">
            <EventInfoItem
              icon={<CalendarDays aria-hidden className="h-7 w-7" />}
              label="Data"
              primary={`${dateParts.day} ${fullMonth} ${dateParts.year}`}
              secondary={dateParts.weekday}
            />
            <EventInfoItem
              icon={<Clock aria-hidden className="h-7 w-7" />}
              label="Orario"
              primary={event.timeLabel || dateParts.time}
            />
            <EventInfoItem
              icon={<MapPin aria-hidden className="h-7 w-7" />}
              label="Luogo"
              primary={event.venue}
              secondary={event.venueAddress}
            />
            <EventInfoItem
              icon={<UsersRound aria-hidden className="h-7 w-7" />}
              label="Pubblico"
              primary={event.audience || 'Da definire'}
            />
          </aside>

          {longDescription ? (
            <section className="event-detail-section mt-12 max-w-4xl">
              <SectionHeading
                title="Descrizione"
                titleClassName="font-rye-western text-[var(--theme-text-green)]"
              />
              <p className="mt-5 whitespace-pre-line text-base font-medium leading-8 text-[var(--theme-text-primary)] md:text-lg md:leading-9">
                {longDescription}
              </p>
            </section>
          ) : null}

          {timelineItems.length > 0 ? (
            <section className="event-detail-section mt-14">
              <SectionHeading
                eyebrow="Programma"
                title="La scaletta"
                titleClassName="font-rye-western text-[var(--theme-text-green)]"
              />
              <ol className="event-detail-timeline mt-6 max-w-4xl">
                {timelineItems.map((item, index) => (
                  <li
                    className="event-detail-timeline__item"
                    key={item.id || `${item.time}-${index}`}
                  >
                    <time className="event-detail-timeline__time">{item.time}</time>
                    <span aria-hidden className="event-detail-timeline__rail">
                      <span className="event-detail-timeline__dot" />
                    </span>
                    <div className="min-w-0 pb-7">
                      <h3 className="font-rye-western text-sm uppercase leading-tight text-[var(--theme-text-green)] md:text-base">
                        {item.title}
                      </h3>
                      {item.description ? (
                        <p className="mt-1.5 whitespace-pre-line text-sm font-medium leading-6 text-[var(--theme-text-primary)]">
                          {item.description}
                        </p>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          ) : null}

          {artistsAndGuests.length > 0 ? (
            <section className="event-detail-section mt-14">
              <SectionHeading eyebrow="Sul palco" title="Artisti ed ospiti" />
              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {artistsAndGuests.map((person, index) => (
                  <article
                    className="event-detail-person-card scribble-border vintage-surface grid min-w-0 gap-4 overflow-hidden p-4 sm:grid-cols-[5.8rem_minmax(0,1fr)]"
                    key={person.id || `${person.firstName}-${person.lastName}-${index}`}
                  >
                    <PersonPhoto person={person} />
                    <div className="min-w-0 self-center">
                      <h3 className="font-cinzel text-lg font-black uppercase leading-none text-[var(--theme-text-secondary)]">
                        {[person.firstName, person.lastName].filter(Boolean).join(' ')}
                      </h3>
                      {person.description ? (
                        <p className="mt-3 whitespace-pre-line text-sm font-medium leading-6 text-[var(--theme-text-primary)]">
                          {person.description}
                        </p>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          {usefulInfoItems.length > 0 ? (
            <section className="event-detail-section mt-14">
              <SectionHeading eyebrow="Prima di venire" title="Informazioni utili" />
              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {usefulInfoItems.map((item, index) => (
                  <article
                    className="event-detail-useful-card scribble-border vintage-surface flex min-w-0 gap-4 p-5"
                    key={item.id || `${item.title}-${index}`}
                  >
                    <UsefulInfoIcon icon={item.icon} />
                    <div className="min-w-0">
                      {item.title ? (
                        <h3 className="font-cinzel text-sm font-black uppercase leading-tight text-[var(--theme-text-secondary)]">
                          {item.title}
                        </h3>
                      ) : null}
                      {item.description ? (
                        <p className="mt-2 whitespace-pre-line text-sm font-medium leading-6 text-[var(--theme-text-primary)]">
                          {item.description}
                        </p>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          {galleryPreviewImages.length > 0 ? (
            <section className="mt-12">
              <h2 className="font-rye-western text-2xl uppercase text-[var(--theme-text-green)]">
                Galleria
              </h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {galleryPreviewImages.map(({ caption, image }, index) => (
                  <figure
                    className="event-detail-gallery-card scribble-border vintage-surface"
                    key={`${image.id}-${index}`}
                  >
                    <div className="event-detail-gallery-card__image relative aspect-[4/3]">
                      <Media
                        fill
                        imgClassName="object-cover object-center"
                        pictureClassName="absolute inset-0"
                        resource={image}
                        size="(max-width: 1023px) 50vw, 33vw"
                      />
                    </div>
                    {caption ? (
                      <figcaption className="px-4 py-3 text-sm text-[var(--theme-text-primary)]">
                        {caption}
                      </figcaption>
                    ) : null}
                  </figure>
                ))}
              </div>
            </section>
          ) : null}

          {visibleRelatedEvents.length > 0 ? (
            <section className="event-detail-section mt-16">
              <SectionHeading
                eyebrow="Continua a curiosare"
                title="Altri eventi"
                titleClassName="font-rye-western text-[var(--theme-text-green)]"
              />
              <div className="mt-6 grid max-w-5xl gap-4 md:grid-cols-2 xl:grid-cols-3">
                {visibleRelatedEvents.map((relatedEvent) => (
                  <RelatedEventCard event={relatedEvent} key={relatedEvent.id} />
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </SiteBackgroundFrame>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const event = await queryEventBySlug({ slug: decodedSlug })

  if (!event) {
    return {
      title: 'Evento | Hero 4 Gotham',
    }
  }

  const image = event.gallery.find((item) => typeof item.image === 'object')?.image
  const imageUrl =
    image && typeof image === 'object' ? getAbsoluteMediaUrl(image as MediaDocument) : undefined
  const title = `${event.title} | Hero 4 Gotham`

  return {
    description: event.description,
    openGraph: {
      description: event.description,
      images: imageUrl ? [{ url: imageUrl }] : undefined,
      title,
      url: `/eventi/${event.slug}`,
    },
    title,
  }
}

const queryEventBySlug = cache(async ({ slug }: { slug: string }) => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'events',
    depth: 1,
    limit: 1,
    overrideAccess: false,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})

const queryRelatedEvents = cache(async ({ eventId }: { eventId: number }) => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'events',
    depth: 1,
    limit: 3,
    overrideAccess: false,
    pagination: false,
    sort: '-startsAt',
    where: {
      id: {
        not_equals: eventId,
      },
    },
  })

  return (result.docs as EventDocument[]) || []
})

const getAbsoluteMediaUrl = (image: MediaDocument) => {
  const url = getMediaUrl(image.url, image.updatedAt)

  if (!url) return undefined
  if (url.startsWith('http')) return url

  return `${getServerSideURL()}${url}`
}

type EventArtistOrGuest = NonNullable<EventDocument['artistsAndGuests']>[number]
type EventUsefulInfoItem = NonNullable<EventDocument['usefulInfo']>[number]

const SectionHeading = ({
  eyebrow,
  title,
  titleClassName,
}: {
  eyebrow?: string
  title: string
  titleClassName?: string
}) => (
  <div className="event-detail-section-heading">
    {eyebrow ? (
      <p className="font-rye-western text-xs uppercase leading-none text-[var(--theme-text-purple)]">
        {eyebrow}
      </p>
    ) : null}
    <h2
      className={cn(
        'mt-2 text-2xl uppercase leading-none md:text-3xl',
        titleClassName || 'font-cinzel font-black text-[var(--theme-text-secondary)]',
      )}
    >
      {title}
    </h2>
  </div>
)

const PersonPhoto = ({ person }: { person: EventArtistOrGuest }) => {
  const initials =
    `${person.firstName?.charAt(0) || ''}${person.lastName?.charAt(0) || ''}`.toUpperCase() || 'H4'

  return (
    <div className="event-detail-person-card__photo relative aspect-square min-h-24 overflow-hidden">
      {person.photo && typeof person.photo === 'object' ? (
        <Media
          fill
          imgClassName="object-cover object-center"
          pictureClassName="absolute inset-0"
          resource={person.photo}
          size="8rem"
        />
      ) : (
        <span className="grid h-full w-full place-items-center font-cinzel text-2xl font-black uppercase text-[var(--theme-text-green)]">
          {initials}
        </span>
      )}
    </div>
  )
}

const UsefulInfoIcon = ({ icon }: { icon?: EventUsefulInfoItem['icon'] }) => (
  <span className="event-detail-useful-card__icon relative grid size-11 shrink-0 place-items-center overflow-hidden text-[var(--theme-text-green)]">
    {icon && typeof icon === 'object' ? (
      <Media
        fill
        imgClassName="object-contain object-center"
        pictureClassName="absolute inset-0"
        resource={icon}
        size="3rem"
      />
    ) : (
      <Info aria-hidden className="h-6 w-6" />
    )}
  </span>
)

const RelatedEventCard = ({ event }: { event: EventDocument }) => {
  const dateParts = formatEventDateParts(event.startsAt)
  const displayImage = getEventDisplayImage(event)
  const eventTypeLabel = getEventTypeLabel(event.activity)
  const href = event.slug ? `/eventi/${encodeURIComponent(event.slug)}` : '/eventi'

  return (
    <article className="event-detail-related-card scribble-border vintage-surface min-w-0">
      <Link
        aria-label={`Apri evento ${event.title}`}
        className="event-detail-related-card__media relative block aspect-[16/9] overflow-hidden"
        href={href}
      >
        {displayImage && typeof displayImage === 'object' ? (
          <Media
            fill
            imgClassName="object-cover object-center transition duration-300 hover:scale-[1.03]"
            pictureClassName="event-detail-related-card__picture absolute inset-0"
            resource={displayImage}
            size="(max-width: 767px) 100vw, 22rem"
          />
        ) : null}
      </Link>
      <div className="grid gap-2.5 px-4 py-4">
        <div className="font-rye-western flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.6rem] uppercase leading-none">
          <span className="text-[var(--theme-text-green)]">
            {dateParts.day} {dateParts.month} {event.timeLabel || dateParts.time}
          </span>
          {eventTypeLabel ? (
            <span className="text-[var(--theme-text-purple)]">{eventTypeLabel}</span>
          ) : null}
        </div>
        <h3 className="font-rye-western text-lg uppercase leading-[0.95] text-[var(--theme-text-secondary)]">
          {event.title}
        </h3>
        {event.description ? (
          <p className="line-clamp-2 text-xs font-medium leading-5 text-[var(--theme-text-primary)]">
            {event.description}
          </p>
        ) : null}
        <Link
          className={cn(
            'mt-1 inline-flex w-fit items-center gap-2 font-cinzel text-xs font-black uppercase leading-none text-[var(--theme-text-green)]',
            'underline decoration-[var(--theme-text-green)]/55 underline-offset-4 transition hover:text-[var(--theme-text-accent)]',
          )}
          href={href}
        >
          Scopri evento
          <ArrowRight aria-hidden className="h-4 w-4" />
        </Link>
      </div>
    </article>
  )
}

const EventInfoItem = ({
  icon,
  label,
  primary,
  secondary,
}: {
  icon: ReactNode
  label: string
  primary?: null | string
  secondary?: null | string
}) => (
  <div className="event-detail-info-item flex min-w-0 items-center gap-4 px-3 py-4 md:px-5">
    <span className="shrink-0 text-[var(--theme-text-green)]">{icon}</span>
    <span className="min-w-0">
      <span className="font-rye-western block text-[0.68rem] uppercase leading-none text-[var(--theme-text-purple)]">
        {label}
      </span>
      <span className="mt-1.5 block truncate font-cinzel text-sm font-black uppercase leading-none text-[var(--theme-text-secondary)]">
        {primary || 'Da definire'}
      </span>
      {secondary ? (
        <span className="mt-1.5 block truncate font-cinzel text-[0.58rem] font-black uppercase leading-none text-[var(--theme-text-primary)]">
          {secondary}
        </span>
      ) : null}
    </span>
  </div>
)
