import { getServerSideSitemap } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'

const getEventsSitemap = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const SITE_URL =
      process.env.NEXT_PUBLIC_SERVER_URL ||
      process.env.VERCEL_PROJECT_PRODUCTION_URL ||
      'https://example.com'

    const results = await payload.find({
      collection: 'events',
      depth: 0,
      limit: 1000,
      overrideAccess: false,
      pagination: false,
      select: {
        slug: true,
        updatedAt: true,
      },
    })

    const dateFallback = new Date().toISOString()

    return results.docs
      ? results.docs
          .filter((event) => Boolean(event?.slug))
          .map((event) => ({
            lastmod: event.updatedAt || dateFallback,
            loc: `${SITE_URL}/eventi/${event.slug}`,
          }))
      : []
  },
  ['events-sitemap'],
  {
    tags: ['events-sitemap'],
  },
)

export async function GET() {
  const sitemap = await getEventsSitemap()

  return getServerSideSitemap(sitemap)
}
