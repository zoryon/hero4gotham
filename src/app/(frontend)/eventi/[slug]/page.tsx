import type { Metadata } from 'next'

import { Media } from '@/components/Media'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { SiteBackgroundFrame } from '@/SiteBackground/Component'
import type { Media as MediaDocument } from '@/payload-types'
import { formatEventDateParts, getEventTypeLabel } from '@/blocks/EventSuite/shared'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { getServerSideURL } from '@/utilities/getURL'
import { getCachedGlobal } from '@/utilities/getGlobals'
import configPromise from '@payload-config'
import { CalendarDays, Clock, MapPin } from 'lucide-react'
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

  const siteBackground = await getCachedGlobal('siteBackground', 1)().catch(() => null)
  const dateParts = formatEventDateParts(event.startsAt)
  const eventTypeLabel = getEventTypeLabel(event.activity)
  const hasPassed = new Date(event.startsAt).getTime() < Date.now()
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

  return (
    <article>
      <PayloadRedirects disableNotFound url={url} />

      <SiteBackgroundFrame isFirstPageBlock settings={siteBackground}>
        <header className="event-detail-hero">
          <div className="container relative z-10 flex min-h-[inherit] items-center pb-12 md:pb-16">
            <div className="event-detail-hero__copy max-w-4xl pb-3 md:pb-6">
              <Link
                className="mb-7 inline-flex font-cinzel text-xs font-black uppercase leading-none text-[var(--theme-text-green)] underline decoration-[var(--theme-text-green)]/55 underline-offset-4 transition hover:text-[var(--theme-text-accent)]"
                href="/eventi"
              >
                Eventi
              </Link>

              {eventTypeLabel ? (
                <p className="font-cinzel text-xs font-black uppercase leading-none text-[#d777c6] md:text-sm">
                  {eventTypeLabel}
                </p>
              ) : null}
              <h1 className="mt-4 max-w-4xl font-cinzel text-5xl font-black uppercase leading-[0.88] text-[var(--theme-text-secondary)] md:text-7xl lg:text-8xl">
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

        <div className="container pb-16 pt-10 md:pt-12">
          <aside className="scribble-border vintage-surface grid max-w-3xl gap-4 p-5 md:grid-cols-3">
            {hasPassed ? (
              <span className="w-fit bg-black px-2 py-1 font-cinzel text-xs font-black uppercase text-[#ff2d2d] md:col-span-3">
                Evento passato
              </span>
            ) : null}
            <EventDetailRow icon={<CalendarDays aria-hidden className="h-5 w-5" />}>
              {dateParts.weekday} {dateParts.day} {dateParts.month} {dateParts.year}
            </EventDetailRow>
            <EventDetailRow icon={<Clock aria-hidden className="h-5 w-5" />}>
              {event.timeLabel || dateParts.time}
            </EventDetailRow>
            {event.venue ? (
              <EventDetailRow icon={<MapPin aria-hidden className="h-5 w-5" />}>
                {event.venue}
              </EventDetailRow>
            ) : null}
          </aside>

          {galleryPreviewImages.length > 0 ? (
            <section className="mt-12">
              <h2 className="font-cinzel text-2xl font-black uppercase text-[var(--theme-text-secondary)]">
                Gallery
              </h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {galleryPreviewImages.map(({ caption, image }, index) => (
                  <figure
                    className="scribble-border vintage-surface overflow-hidden"
                    key={`${image.id}-${index}`}
                  >
                    <div className="relative aspect-[4/3]">
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

const getAbsoluteMediaUrl = (image: MediaDocument) => {
  const url = getMediaUrl(image.url, image.updatedAt)

  if (!url) return undefined
  if (url.startsWith('http')) return url

  return `${getServerSideURL()}${url}`
}

const EventDetailRow = ({
  children,
  icon,
}: {
  children: ReactNode
  icon: ReactNode
}) => (
  <div className="flex items-start gap-3 text-[var(--theme-text-primary)]">
    <span className="mt-0.5 text-[var(--theme-text-green)]">{icon}</span>
    <span className="font-cinzel text-sm font-black uppercase leading-5">{children}</span>
  </div>
)
