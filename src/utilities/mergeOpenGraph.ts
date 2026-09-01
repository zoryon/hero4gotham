import type { Metadata } from 'next'
import { DEFAULT_META_DESCRIPTION, SITE_NAME } from './siteMetadata'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description: DEFAULT_META_DESCRIPTION,
  siteName: SITE_NAME,
  title: SITE_NAME,
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  const { images, ...openGraph } = og || {}

  return {
    ...defaultOpenGraph,
    ...openGraph,
    ...(images ? { images } : {}),
  }
}
