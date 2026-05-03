import 'dotenv/config'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { getPayload, type DefaultDocumentIDType } from 'payload'

import { type LegacyMediaRecord, findExistingLegacyMedia, toAlt } from './lib/legacyMedia'
import {
  legacyBMJArticlePagePath,
  legacyBMJPostCategoriesPath,
  legacyBMJPostsPath,
} from './lib/legacyBMJPaths'
import { notifyStorefrontRevalidate } from './lib/notifyStorefrontRevalidate'

type LegacyCollectionResponse<T> = {
  docs?: T[]
}

type LegacyMediaDoc = LegacyMediaRecord & {
  url?: string | null
}

type CurrentMediaDoc = {
  alt?: string | null
  filename?: string | null
  filesize?: number | null
  height?: number | null
  id: DefaultDocumentIDType
  mimeType?: string | null
  width?: number | null
}

type LegacyCategory = {
  id: DefaultDocumentIDType
  slug?: string | null
  title?: string | null
}

type LegacyPost = {
  _status?: 'draft' | 'published' | null
  authors?: DefaultDocumentIDType[] | null
  categories?: Array<LegacyCategory | DefaultDocumentIDType> | null
  content?: Record<string, unknown> | null
  heroImage?: LegacyMediaDoc | DefaultDocumentIDType | null
  id: DefaultDocumentIDType
  meta?: {
    description?: string | null
    image?: LegacyMediaDoc | DefaultDocumentIDType | null
    title?: string | null
  } | null
  populatedAuthors?: Array<{
    name?: string | null
  }> | null
  publishedAt?: string | null
  relatedPosts?: Array<LegacyPost | DefaultDocumentIDType> | null
  slug?: string | null
  title?: string | null
}

type LegacyArticlePage = {
  _status?: 'draft' | 'published' | null
  hero?: Record<string, unknown> | null
  layout?: Array<{
    blockName?: string | null
    blockType?: string | null
    categories?: Array<LegacyCategory | DefaultDocumentIDType> | null
    introContent?: Record<string, unknown> | null
    limit?: number | null
    populateBy?: 'collection' | 'selection' | null
    selectedDocs?: Array<LegacyPost | DefaultDocumentIDType> | null
  }> | null
  meta?: Record<string, unknown> | null
  pageType?: 'default' | 'legal' | null
  publishedAt?: string | null
  slug?: string | null
  title?: string | null
}

type RunOptions = {
  revalidate?: boolean
}

type RunResult = {
  importedArticlePage: boolean
  importedPostCategories: number
  importedPosts: number
  paths: string[]
}

const legacyProjectRoot = path.resolve(process.cwd(), '..', 'mekarsarijaya')
const legacyMediaRoot = path.join(legacyProjectRoot, 'public', 'media')

const normalizeName = (value: string) => value.trim().toLowerCase().replace(/\s+/g, ' ')

const isLegacyMediaDoc = (value: unknown): value is LegacyMediaDoc =>
  typeof value === 'object' && value !== null && 'filename' in value

const toIDArray = (
  values: Array<{ id: DefaultDocumentIDType } | DefaultDocumentIDType> | null | undefined,
) =>
  (values || [])
    .map((value) => (typeof value === 'object' ? value.id : value))
    .filter((value): value is DefaultDocumentIDType => value !== null && typeof value !== 'undefined')

async function readDocs<T>(filePath: string): Promise<T[]> {
  const raw = await fs.readFile(filePath, 'utf8')
  const data = JSON.parse(raw) as LegacyCollectionResponse<T>

  return data.docs || []
}

async function ensureMedia(
  payload: Awaited<ReturnType<typeof getPayload>>,
  currentMedia: CurrentMediaDoc[],
  legacyMedia: LegacyMediaDoc | null | undefined,
): Promise<DefaultDocumentIDType | undefined> {
  if (!legacyMedia?.filename) {
    return undefined
  }

  let target = findExistingLegacyMedia(currentMedia, legacyMedia)

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

    currentMedia.push(target)
  }

  return target.id as DefaultDocumentIDType
}

async function remapContentRelations(
  payload: Awaited<ReturnType<typeof getPayload>>,
  currentMedia: CurrentMediaDoc[],
  value: unknown,
): Promise<unknown> {
  if (Array.isArray(value)) {
    return Promise.all(value.map((item) => remapContentRelations(payload, currentMedia, item)))
  }

  if (isLegacyMediaDoc(value)) {
    return ensureMedia(payload, currentMedia, value)
  }

  if (value && typeof value === 'object') {
    const output: Record<string, unknown> = {}

    for (const [key, childValue] of Object.entries(value)) {
      if (['backgroundImage', 'image', 'media'].includes(key) && isLegacyMediaDoc(childValue)) {
        output[key] = await ensureMedia(payload, currentMedia, childValue)
      } else {
        output[key] = await remapContentRelations(payload, currentMedia, childValue)
      }
    }

    return output
  }

  return value
}

export async function run(options: RunOptions = {}): Promise<RunResult> {
  const shouldRevalidate = options.revalidate ?? true
  const { default: config } = await import('../src/payload.config')
  const payload = await getPayload({ config: await config })

  const [legacyPosts, legacyCategories, legacyArticlePages] = await Promise.all([
    readDocs<LegacyPost>(legacyBMJPostsPath),
    readDocs<LegacyCategory>(legacyBMJPostCategoriesPath),
    readDocs<LegacyArticlePage>(legacyBMJArticlePagePath),
  ])

  const legacyArticlePage = legacyArticlePages[0] || null
  const legacyArticleBlock = legacyArticlePage?.layout?.find((block) => block.blockType === 'archive')

  const relevantCategoryIDs = new Set<string>()

  for (const legacyPost of legacyPosts) {
    for (const categoryID of toIDArray(legacyPost.categories || [])) {
      relevantCategoryIDs.add(String(categoryID))
    }
  }

  for (const categoryID of toIDArray(legacyArticleBlock?.categories || [])) {
    relevantCategoryIDs.add(String(categoryID))
  }

  const articleCategories = legacyCategories.filter((category) => relevantCategoryIDs.has(String(category.id)))

  const [currentMediaResult, currentUsersResult, currentPostCategoriesResult, currentPostsResult] =
    await Promise.all([
      payload.find({
        collection: 'media',
        depth: 0,
        limit: 1000,
        overrideAccess: true,
        pagination: false,
      }),
      payload.find({
        collection: 'users',
        depth: 0,
        limit: 1000,
        overrideAccess: true,
        pagination: false,
      }),
      payload.find({
        collection: 'postCategories',
        depth: 0,
        limit: 1000,
        overrideAccess: true,
        pagination: false,
      }),
      payload.find({
        collection: 'posts',
        depth: 0,
        limit: 1000,
        overrideAccess: true,
        pagination: false,
      }),
    ])

  const currentMedia = [...currentMediaResult.docs]
  const currentUsersByName = new Map(
    currentUsersResult.docs.flatMap((user) =>
      typeof user.name === 'string' && user.name.trim().length > 0
        ? ([[normalizeName(user.name), user.id]] as const)
        : [],
    ),
  )
  const currentPostCategoriesBySlug = new Map(
    currentPostCategoriesResult.docs
      .filter((category) => typeof category.slug === 'string' && category.slug.length > 0)
      .map((category) => [category.slug, category]),
  )
  const currentPostsBySlug = new Map(
    currentPostsResult.docs
      .filter((post) => typeof post.slug === 'string' && post.slug.length > 0)
      .map((post) => [post.slug, post]),
  )

  const categoryMap = new Map<string, DefaultDocumentIDType>()
  const postMap = new Map<string, DefaultDocumentIDType>()

  for (const legacyCategory of articleCategories) {
    if (!legacyCategory.slug) {
      continue
    }

    const existing = currentPostCategoriesBySlug.get(legacyCategory.slug)
    const categoryData = {
      title: legacyCategory.title || legacyCategory.slug,
      slug: legacyCategory.slug,
      description: null,
    }

    const target = existing
      ? await payload.update({
          collection: 'postCategories',
          id: existing.id,
          overrideAccess: true,
          data: categoryData,
        })
      : await payload.create({
          collection: 'postCategories',
          overrideAccess: true,
          data: categoryData,
        })

    currentPostCategoriesBySlug.set(legacyCategory.slug, target)
    categoryMap.set(String(legacyCategory.id), target.id)
  }

  for (const legacyPost of legacyPosts) {
    if (!legacyPost.slug || !legacyPost.title || !legacyPost.content) {
      continue
    }

    const heroImageID = await ensureMedia(
      payload,
      currentMedia,
      isLegacyMediaDoc(legacyPost.heroImage) ? legacyPost.heroImage : null,
    )
    const metaImageID = await ensureMedia(
      payload,
      currentMedia,
      isLegacyMediaDoc(legacyPost.meta?.image) ? legacyPost.meta?.image : null,
    )
    const content = await remapContentRelations(payload, currentMedia, legacyPost.content)

    const categoryIDs = toIDArray(legacyPost.categories || [])
      .map((categoryID) => categoryMap.get(String(categoryID)))
      .filter((categoryID): categoryID is DefaultDocumentIDType => Boolean(categoryID))

    const authorIDs = (legacyPost.populatedAuthors || [])
      .map((author) => {
        if (!author?.name) {
          return undefined
        }

        return currentUsersByName.get(normalizeName(author.name))
      })
      .filter((userID): userID is DefaultDocumentIDType => Boolean(userID))

    const postData = {
      title: legacyPost.title,
      slug: legacyPost.slug,
      heroImage: heroImageID,
      content,
      categories: categoryIDs,
      meta: {
        title: legacyPost.meta?.title || legacyPost.title,
        image: metaImageID,
        description: legacyPost.meta?.description || null,
      },
      publishedAt: legacyPost.publishedAt || undefined,
      authors: authorIDs,
      relatedPosts: [],
      _status: legacyPost._status || 'published',
    }

    const existing = currentPostsBySlug.get(legacyPost.slug)
    const target = existing
      ? await payload.update({
          collection: 'posts',
          id: existing.id,
          overrideAccess: true,
          context: {
            disableRevalidate: true,
          },
          data: postData as any,
        })
      : await payload.create({
          collection: 'posts',
          overrideAccess: true,
          context: {
            disableRevalidate: true,
          },
          data: postData as any,
        })

    currentPostsBySlug.set(legacyPost.slug, target)
    postMap.set(String(legacyPost.id), target.id)
  }

  for (const legacyPost of legacyPosts) {
    if (!legacyPost.slug) {
      continue
    }

    const target = currentPostsBySlug.get(legacyPost.slug)

    if (!target) {
      continue
    }

    const relatedPostIDs = toIDArray(legacyPost.relatedPosts || [])
      .map((postID) => postMap.get(String(postID)))
      .filter((postID): postID is DefaultDocumentIDType => Boolean(postID))

    await payload.update({
      collection: 'posts',
      id: target.id,
      overrideAccess: true,
      context: {
        disableRevalidate: true,
      },
      data: {
        relatedPosts: relatedPostIDs,
      },
    })
  }

  let importedArticlePage = false

  if (legacyArticlePage && legacyArticleBlock) {
    const selectedDocs = toIDArray(legacyArticleBlock.selectedDocs || [])
      .map((postID) => postMap.get(String(postID)))
      .filter((postID): postID is DefaultDocumentIDType => Boolean(postID))

    const pageData = {
      title: legacyArticlePage.title || 'Artikel',
      slug: legacyArticlePage.slug || 'artikel',
      hero: legacyArticlePage.hero || {
        type: 'none',
      },
      meta: legacyArticlePage.meta || {},
      pageType: legacyArticlePage.pageType || 'default',
      publishedOn: legacyArticlePage.publishedAt || undefined,
      layout: [
        {
          blockType: 'articleArchive',
          blockName: legacyArticleBlock.blockName || undefined,
          introContent: legacyArticleBlock.introContent || undefined,
          populateBy: legacyArticleBlock.populateBy || 'collection',
          limit: legacyArticleBlock.limit || 12,
          categories: toIDArray(legacyArticleBlock.categories || [])
            .map((categoryID) => categoryMap.get(String(categoryID)))
            .filter((categoryID): categoryID is DefaultDocumentIDType => Boolean(categoryID)),
          selectedDocs,
        },
      ],
      _status: legacyArticlePage._status || 'published',
    }

    const existing = await payload.find({
      collection: 'pages',
      depth: 0,
      limit: 1,
      overrideAccess: true,
      pagination: false,
      where: {
        slug: {
          equals: pageData.slug,
        },
      },
    })

    if (existing.docs[0]) {
      await payload.update({
        collection: 'pages',
        id: existing.docs[0].id,
        overrideAccess: true,
        context: {
          disableRevalidate: true,
        },
        data: pageData as any,
      })
    } else {
      await payload.create({
        collection: 'pages',
        overrideAccess: true,
        context: {
          disableRevalidate: true,
        },
        data: pageData as any,
      })
    }

    importedArticlePage = true
  }

  const postPaths = legacyPosts
    .map((post) => (post.slug ? `/artikel/${post.slug}` : null))
    .filter((postPath): postPath is string => Boolean(postPath))
  const paths = Array.from(new Set(['/artikel', ...postPaths]))

  if (shouldRevalidate) {
    await notifyStorefrontRevalidate({
      paths,
    })
  }

  return {
    importedArticlePage,
    importedPostCategories: articleCategories.length,
    importedPosts: legacyPosts.length,
    paths,
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  run()
    .then((result) => {
      console.log(JSON.stringify(result, null, 2))
      process.exit(0)
    })
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}
