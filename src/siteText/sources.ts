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
]

export const getSiteTextSource = (slug: string, kind: SiteTextSource['kind']) =>
  siteTextSources.find((source) => source.slug === slug && source.kind === kind)
