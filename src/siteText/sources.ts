export type SiteTextCollectionSource = {
  area: string
  kind: 'collection'
  respectAccess?: boolean
  slug: string
  titleField: string
}

export type SiteTextGlobalSource = {
  area: string
  kind: 'global'
  slug: string
  title: string
}

export type SiteTextSource = SiteTextCollectionSource | SiteTextGlobalSource

export const siteTextSources: SiteTextSource[] = [
  { area: 'Pagine', kind: 'collection', slug: 'pages', titleField: 'title' },
  { area: 'Elementi comuni', kind: 'global', slug: 'header', title: 'Header' },
  { area: 'Elementi comuni', kind: 'global', slug: 'footer', title: 'Footer' },
  {
    area: 'Elementi comuni',
    kind: 'global',
    slug: 'membershipDocuments',
    title: 'Documenti',
  },
  { area: 'Elementi comuni', kind: 'collection', slug: 'variables', titleField: 'name' },
  { area: 'Eventi', kind: 'collection', slug: 'events', titleField: 'title' },
  { area: 'Attività', kind: 'collection', slug: 'activities', titleField: 'title' },
  { area: 'Articoli', kind: 'collection', slug: 'posts', titleField: 'title' },
  { area: 'Articoli', kind: 'collection', slug: 'categories', titleField: 'title' },
  {
    area: 'Media',
    kind: 'collection',
    respectAccess: true,
    slug: 'media',
    titleField: 'filename',
  },
  { area: 'Moduli', kind: 'collection', slug: 'forms', titleField: 'title' },
  { area: 'Privacy', kind: 'global', slug: 'privacyPolicy', title: 'Privacy Policy' },
  { area: 'Elementi comuni', kind: 'global', slug: 'siteCopy', title: 'Testi comuni' },
]

export const getSiteTextSource = (slug: string, kind: SiteTextSource['kind']) =>
  siteTextSources.find((source) => source.slug === slug && source.kind === kind)
