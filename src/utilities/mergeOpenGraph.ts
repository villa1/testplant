import type { Metadata } from 'next'

import { siteMetadata } from './siteMetadata'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description: siteMetadata.defaultDescription,
  locale: siteMetadata.locale,
  siteName: siteMetadata.siteName,
  title: siteMetadata.siteName,
}

export const mergeOpenGraph = (og?: Partial<Metadata['openGraph']>): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
