import configPromise from '@/payload.config'
import { extractSiteTextControls } from '@/siteText/traverse'
import { describe, expect, it } from 'vitest'

const richText = (text: string) => ({
  root: {
    children: [
      {
        children: [{ text, type: 'text' }],
        type: 'paragraph',
      },
    ],
    type: 'root',
  },
})

describe('site text catalog', () => {
  it('includes page copy and excludes style, media, URLs, and structure', async () => {
    const config = await configPromise
    const pages = config.collections.find(({ slug }) => slug === 'pages')!
    const controls = extractSiteTextControls(pages.fields, {
      backgroundImage: 3,
      hero: {
        links: [{ link: { label: 'Partecipa', type: 'custom', url: '/partecipa' } }],
        richText: richText('Benvenuti'),
        type: 'highImpact',
      },
      layout: [
        {
          blockType: 'upcomingEvents',
          eventLinkLabel: 'Scopri',
          heading: 'Prossimi eventi',
          headingColor: '#fff000',
          id: 'events-block',
        },
      ],
      meta: {
        description: 'Descrizione SEO',
        title: 'Titolo SEO',
      },
      title: 'Home',
    })
    const values = controls.map(({ value }) => value)

    expect(values).toEqual(
      expect.arrayContaining([
        'Home',
        'Benvenuti',
        'Partecipa',
        'Prossimi eventi',
        'Scopri',
        'Titolo SEO',
        'Descrizione SEO',
      ]),
    )
    expect(values).not.toContain('#fff000')
    expect(values).not.toContain('/partecipa')
    expect(JSON.stringify(controls)).not.toContain('backgroundImage')
  })

  it('exposes header labels but never link destinations or colors', async () => {
    const config = await configPromise
    const header = config.globals.find(({ slug }) => slug === 'header')!
    const controls = extractSiteTextControls(header.fields, {
      navItems: [
        {
          id: 'nav-about',
          link: {
            label: 'Chi siamo',
            type: 'custom',
            url: '/chi-siamo',
          },
        },
      ],
      socialItems: [
        {
          id: 'social-one',
          label: 'Seguici su Instagram',
          platform: 'instagram',
          url: 'https://instagram.com/hero4gotham',
        },
      ],
      textColor: '#ffffff',
    })
    const values = controls.map(({ value }) => value)

    expect(values).toEqual(expect.arrayContaining(['Chi siamo', 'Seguici su Instagram']))
    expect(values).not.toEqual(
      expect.arrayContaining(['/chi-siamo', 'https://instagram.com/hero4gotham', '#ffffff']),
    )
  })

  it('includes accessible media copy without exposing file data', async () => {
    const config = await configPromise
    const media = config.collections.find(({ slug }) => slug === 'media')!
    const controls = extractSiteTextControls(media.fields, {
      alt: 'Persone durante un laboratorio',
      caption: richText('Laboratorio 2026'),
      filename: 'private.jpg',
      focalX: 12,
      focalY: 45,
      url: '/api/media/file/private.jpg',
    })

    expect(controls.map(({ value }) => value)).toEqual([
      'Persone durante un laboratorio',
      'Laboratorio 2026',
    ])
  })

  it('does not expose event dates, relationships, slugs, or gallery media', async () => {
    const config = await configPromise
    const events = config.collections.find(({ slug }) => slug === 'events')!
    const controls = extractSiteTextControls(events.fields, {
      activity: 5,
      description: 'Descrizione breve',
      gallery: [{ caption: 'Foto di gruppo', id: 'photo-one', image: 99 }],
      slug: 'evento-riservato',
      startsAt: '2026-09-10T20:00:00.000Z',
      title: 'Evento pubblico',
    })
    const values = controls.map(({ value }) => value)

    expect(values).toEqual(
      expect.arrayContaining(['Evento pubblico', 'Descrizione breve', 'Foto di gruppo']),
    )
    expect(values).not.toEqual(
      expect.arrayContaining(['evento-riservato', '2026-09-10T20:00:00.000Z']),
    )
    expect(JSON.stringify(controls)).not.toContain('99')
  })

  it('registers editable static frontend copy without exposing a generic update screen', async () => {
    const config = await configPromise
    const siteCopy = config.globals.find(({ slug }) => String(slug) === 'siteCopy')

    expect(siteCopy).toBeDefined()
    expect(siteCopy?.admin?.hidden).toBeTypeOf('function')

    const controls = extractSiteTextControls(siteCopy?.fields || [], {
      cookie: {
        title: 'Gestisci i cookie',
      },
      seo: {
        siteName: 'Hero 4 Gotham',
      },
    })

    expect(controls.map(({ value }) => value)).toEqual(
      expect.arrayContaining(['Gestisci i cookie', 'Hero 4 Gotham']),
    )
  })

  it('registers the dedicated site text admin view', async () => {
    const config = await configPromise
    const view = config.admin.components?.views?.siteTexts

    expect(view?.path).toBe('/testi-del-sito')
    expect(config.admin.components?.beforeNavLinks).toContain(
      '@/components/SiteTextEditor/NavLink.client',
    )
  })
})
