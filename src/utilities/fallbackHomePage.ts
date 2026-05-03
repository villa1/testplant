import type { RequiredDataFromCollectionSlug } from 'payload'

import { siteMetadata } from './siteMetadata'

export const fallbackHomePage = (): RequiredDataFromCollectionSlug<'pages'> => {
  return {
    _status: 'published',
    hero: {
      type: 'none',
    },
    layout: [],
    meta: {
      description: siteMetadata.defaultDescription,
      title: siteMetadata.siteName,
    },
    slug: 'home',
    title: 'Beranda',
  }
}
