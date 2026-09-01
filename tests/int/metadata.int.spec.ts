import { generateMeta } from '@/utilities/generateMeta'
import { homeStatic } from '@/endpoints/seed/home-static'
import { DEFAULT_META_DESCRIPTION } from '@/utilities/siteMetadata'
import { describe, expect, it } from 'vitest'

describe('site metadata', () => {
  it('preserves the configured page title without template branding', async () => {
    const metadata = await generateMeta({
      doc: {
        meta: {
          description: 'Descrizione configurata',
          title: 'Titolo configurato | Hero 4 Gotham',
        },
        slug: 'pagina',
      },
    })

    expect(metadata.title).toBe('Titolo configurato | Hero 4 Gotham')
    expect(metadata.openGraph).toMatchObject({
      description: 'Descrizione configurata',
      siteName: 'Hero 4 Gotham',
      title: 'Titolo configurato | Hero 4 Gotham',
    })
  })

  it('uses the site name when a page has no configured SEO title', async () => {
    const metadata = await generateMeta({ doc: {} })

    expect(metadata.description).toBe(
      'Hero 4 Gotham, associazione culturale dedicata ad arte, creatività, eventi e partecipazione.',
    )
    expect(metadata.title).toBe('Hero 4 Gotham')
    expect(metadata.openGraph).toMatchObject({
      description:
        'Hero 4 Gotham, associazione culturale dedicata ad arte, creatività, eventi e partecipazione.',
      siteName: 'Hero 4 Gotham',
      title: 'Hero 4 Gotham',
    })
    expect(metadata.openGraph).not.toHaveProperty('images')
  })

  it('removes legacy template branding already stored in an SEO title', async () => {
    const metadata = await generateMeta({
      doc: {
        meta: {
          title: 'Titolo configurato | Payload Website Template',
        },
      },
    })

    expect(metadata.title).toBe('Titolo configurato')
    expect(metadata.openGraph).toMatchObject({ title: 'Titolo configurato' })
  })

  it('replaces a standalone legacy template title with the site name', async () => {
    const metadata = await generateMeta({
      doc: {
        meta: {
          title: 'Payload Website Template',
        },
      },
    })

    expect(metadata.title).toBe('Hero 4 Gotham')
    expect(metadata.openGraph).toMatchObject({ title: 'Hero 4 Gotham' })
  })

  it('keeps the static seed metadata free of template branding', () => {
    expect(homeStatic.meta?.title).toBe('Hero 4 Gotham')
    expect(homeStatic.meta?.description).toBe(DEFAULT_META_DESCRIPTION)
  })
})
