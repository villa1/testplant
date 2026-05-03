import 'dotenv/config'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { getPayload } from 'payload'

import { type LegacyMediaRecord, findExistingLegacyMedia, toAlt } from './lib/legacyMedia'
import { legacyBMJGlobalsPath } from './lib/legacyBMJPaths'

type LinkGroup = {
  label?: string | null
  newTab?: boolean | null
  reference?:
    | {
        relationTo?: 'pages' | null
        value?: number | string | null
      }
    | null
  type?: 'custom' | 'reference' | null
  url?: string | null
}

type LinkArrayItem = {
  id?: string | null
  link: LinkGroup
}

type FooterLayoutBlock = Record<string, unknown> & {
  blockType: string
}

type LegacyHeader = {
  brandDescription?: string | null
  brandName?: string | null
  brandingMode?: 'logo' | 'logoText' | 'text' | null
  logo?: number | string | null
  navItems?: LinkArrayItem[] | null
}

type LegacyFooter = {
  layout?: FooterLayoutBlock[] | null
}

type PageStub = {
  id: number | string
  slug: string
}

type LegacyExport = {
  footer: LegacyFooter
  header: LegacyHeader
  media: LegacyMediaRecord[]
  pages: PageStub[]
}

const legacyProjectRoot = path.resolve(process.cwd(), '..', 'mekarsarijaya')
const legacyMediaRoot = path.join(legacyProjectRoot, 'public', 'media')

const getMediaID = (value: unknown) =>
  typeof value === 'number' || typeof value === 'string' ? value : null

const remapLinkGroup = (
  link: LinkGroup,
  oldPagesById: Map<string, PageStub>,
  newPageIdsBySlug: Map<string, number | string>,
) => {
  if (link?.type !== 'reference' || link.reference?.relationTo !== 'pages' || !link.reference.value) {
    return link
  }

  const legacyPage = oldPagesById.get(String(link.reference.value))

  if (!legacyPage) {
    return null
  }

  const mappedPageID = newPageIdsBySlug.get(legacyPage.slug)

  if (!mappedPageID) {
    return null
  }

  return {
    ...link,
    reference: {
      relationTo: 'pages' as const,
      value: mappedPageID,
    },
  }
}

const filterMappedLinks = (
  items: LinkArrayItem[] | null | undefined,
  oldPagesById: Map<string, PageStub>,
  newPageIdsBySlug: Map<string, number | string>,
  knownInternalRoutes: Set<string>,
) =>
  (items || [])
    .map((item) => {
      const mappedLink = remapLinkGroup(item.link, oldPagesById, newPageIdsBySlug)

      if (!mappedLink) {
        return null
      }

      if (
        mappedLink.type === 'custom' &&
        mappedLink.url &&
        mappedLink.url.startsWith('/') &&
        !mappedLink.url.startsWith('//')
      ) {
        const normalizedPath = mappedLink.url.split('?')[0].split('#')[0]
        const slug = normalizedPath === '/' ? 'home' : normalizedPath.replace(/^\/+/, '').split('/')[0]

        if (!knownInternalRoutes.has(slug)) {
          return null
        }
      }

      return {
        ...item,
        link: mappedLink,
      }
    })
    .filter((value): value is LinkArrayItem => Boolean(value))

export async function run() {
  console.log(`[globals] reading export from ${legacyBMJGlobalsPath}`)
  console.log('[globals] loading payload config')

  const { default: config } = await import('../src/payload.config')
  console.log('[globals] payload config loaded')

  const raw = await fs.readFile(legacyBMJGlobalsPath, 'utf8')
  const payload = await getPayload({ config: await config })
  console.log('[globals] payload initialized')

  const { footer, header, media, pages } = JSON.parse(raw) as LegacyExport

  const oldPagesById = new Map<string, PageStub>(pages.map((page) => [String(page.id), page]))

  const currentPages = await payload.find({
    collection: 'pages',
    depth: 0,
    limit: 100,
    overrideAccess: true,
    pagination: false,
  })

  const newPageIdsBySlug = new Map<string, number | string>()
  const currentMedia = await payload.find({
    collection: 'media',
    depth: 0,
    limit: 1000,
    overrideAccess: true,
    pagination: false,
  })

  for (const page of currentPages.docs) {
    if (page.slug) {
      newPageIdsBySlug.set(page.slug, page.id)
    }
  }

  const knownInternalRoutes = new Set<string>([
    'home',
    ...newPageIdsBySlug.keys(),
    'shop',
    'account',
    'find-order',
    'checkout',
    'order',
    'orders',
    'products',
    'logout',
    'admin',
  ])

  const referencedMediaIDs = new Set<string>()

  if (header.logo) {
    referencedMediaIDs.add(String(header.logo))
  }

  for (const block of footer.layout || []) {
    if (block.blockType === 'identity' && getMediaID(block.logo) !== null) {
      referencedMediaIDs.add(String(block.logo))
    }
  }

  const exportedMediaById = new Map<string, LegacyMediaRecord>(
    media.map((item) => [String(item.id), item]),
  )

  const mediaMap = new Map<string, number | string>()

  for (const legacyMediaID of referencedMediaIDs) {
    const legacyMedia = exportedMediaById.get(String(legacyMediaID))

    if (!legacyMedia?.filename) {
      throw new Error(`[globals] missing filename for legacy media ${legacyMediaID}`)
    }

    let target = findExistingLegacyMedia(currentMedia.docs, legacyMedia)

    if (!target) {
      const absoluteFilePath = path.join(legacyMediaRoot, legacyMedia.filename)
      const buffer = await fs.readFile(absoluteFilePath)

      target = await payload.create({
        collection: 'media',
        overrideAccess: true,
        data: {
          alt: legacyMedia.alt || toAlt(legacyMedia.filename),
        },
        file: {
          name: legacyMedia.filename,
          data: buffer,
          mimetype: legacyMedia.mimeType || 'application/octet-stream',
          size: buffer.byteLength,
        },
      })
      console.log(`[globals] imported media ${legacyMedia.filename}`)

      currentMedia.docs.push(target)
    }

    mediaMap.set(String(legacyMediaID), target.id)
  }

  const mappedHeader = {
    brandingMode: header.brandingMode || 'logoText',
    brandName: header.brandName || 'PT Bumi Mekarsari Jaya',
    brandDescription: header.brandDescription || 'Jaringan Petani Cipanas',
    ...(header.logo && mediaMap.has(String(header.logo))
      ? { logo: mediaMap.get(String(header.logo)) }
      : {}),
    navItems: filterMappedLinks(
      header.navItems,
      oldPagesById,
      newPageIdsBySlug,
      knownInternalRoutes,
    ),
  }

  const mappedFooterLayout = (footer.layout || [])
    .map((block) => {
      if (block.blockType === 'identity') {
        return {
          ...block,
          ...(block.logo && mediaMap.has(String(block.logo))
            ? { logo: mediaMap.get(String(block.logo)) }
            : {}),
        }
      }

      if (block.blockType === 'navigation') {
        const links = filterMappedLinks(
          (block.links as LinkArrayItem[] | null | undefined) || [],
          oldPagesById,
          newPageIdsBySlug,
          knownInternalRoutes,
        )

        if (!links.length) {
          return null
        }

        return {
          ...block,
          links,
        }
      }

      if (block.blockType === 'bottomBar') {
        return {
          ...block,
          links: filterMappedLinks(
            (block.links as LinkArrayItem[] | null | undefined) || [],
            oldPagesById,
            newPageIdsBySlug,
            knownInternalRoutes,
          ),
        }
      }

      return block
    })
    .filter((block): block is FooterLayoutBlock => Boolean(block))

  await payload.updateGlobal({
    slug: 'header',
    context: {
      disableRevalidate: true,
    },
    overrideAccess: true,
    data: mappedHeader as any,
  })

  await payload.updateGlobal({
    slug: 'footer',
    context: {
      disableRevalidate: true,
    },
    overrideAccess: true,
    data: {
      layout: mappedFooterLayout,
    } as any,
  })

  console.log(
    JSON.stringify({
      footerBlocks: mappedFooterLayout.length,
      headerNavItems: mappedHeader.navItems.length,
      referencedMedia: mediaMap.size,
    }),
  )
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  run()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}
