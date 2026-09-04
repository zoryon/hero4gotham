import { siteCopyDefaults } from '@/SiteCopy/defaults'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const { find, getSiteCopy } = vi.hoisted(() => ({
  find: vi.fn(),
  getSiteCopy: vi.fn(),
}))

vi.mock('payload', () => ({
  getPayload: vi.fn(async () => ({ find })),
}))

vi.mock('@payload-config', () => ({
  default: {},
}))

vi.mock('@/utilities/siteCopy', () => ({ getSiteCopy }))

import { generateMetadata } from '@/app/(frontend)/eventi/[slug]/page'

const event = {
  createdAt: '2026-09-04T10:00:00.000Z',
  description: 'Descrizione breve automatica',
  gallery: [{ image: 1 }],
  id: 42,
  slug: 'evento-seo',
  startsAt: '2026-10-10T18:00:00.000Z',
  title: 'Evento SEO',
  updatedAt: '2026-09-04T10:00:00.000Z',
}

describe('event SEO metadata', () => {
  beforeEach(() => {
    find.mockReset()
    getSiteCopy.mockReset()
    getSiteCopy.mockResolvedValue(siteCopyDefaults)
  })

  it('uses the SEO title and description configured on the event', async () => {
    find.mockResolvedValue({
      docs: [
        {
          ...event,
          meta: {
            description: 'Descrizione personalizzata per Google',
            title: 'Titolo personalizzato per Google',
          },
        },
      ],
    })

    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: 'evento-seo-personalizzato' }),
    })

    expect(metadata).toMatchObject({
      description: 'Descrizione personalizzata per Google',
      openGraph: {
        description: 'Descrizione personalizzata per Google',
        title: 'Titolo personalizzato per Google',
      },
      title: 'Titolo personalizzato per Google',
    })
  })

  it('falls back to the event title and short description when SEO fields are blank', async () => {
    find.mockResolvedValue({
      docs: [
        {
          ...event,
          meta: { description: '   ', title: '' },
        },
      ],
    })

    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: 'evento-seo-fallback' }),
    })

    expect(metadata).toMatchObject({
      description: 'Descrizione breve automatica',
      openGraph: {
        description: 'Descrizione breve automatica',
        title: 'Evento SEO | Hero 4 Gotham',
      },
      title: 'Evento SEO | Hero 4 Gotham',
    })
  })
})
