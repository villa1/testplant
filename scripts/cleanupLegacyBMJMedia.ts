import 'dotenv/config'
import { fileURLToPath } from 'node:url'

import { getPayload } from 'payload'

type MediaDoc = {
  alt?: string | null
  createdAt?: string | null
  filename?: string | null
  filesize?: number | null
  height?: number | null
  id: number | string
  mimeType?: string | null
  width?: number | null
}

const mediaRelationKeys = new Set(['backgroundImage', 'heroImage', 'image', 'logo', 'media'])

const mediaGroupKey = (doc: MediaDoc) =>
  [doc.alt || '', doc.filesize || '', doc.width || '', doc.height || '', doc.mimeType || ''].join('|')

const sortNewestFirst = (left: MediaDoc, right: MediaDoc) => {
  const leftDate = left.createdAt ? Date.parse(left.createdAt) : 0
  const rightDate = right.createdAt ? Date.parse(right.createdAt) : 0

  if (leftDate !== rightDate) {
    return rightDate - leftDate
  }

  return Number(right.id) - Number(left.id)
}

const collectReferencedMediaIDs = (value: unknown, output: Set<string>) => {
  if (Array.isArray(value)) {
    value.forEach((item) => collectReferencedMediaIDs(item, output))
    return
  }

  if (!value || typeof value !== 'object') {
    return
  }

  for (const [key, child] of Object.entries(value)) {
    if (mediaRelationKeys.has(key) && (typeof child === 'number' || typeof child === 'string')) {
      output.add(String(child))
    }

    collectReferencedMediaIDs(child, output)
  }
}

export async function run() {
  const { default: config } = await import('../src/payload.config')
  const payload = await getPayload({ config: await config })

  const [pages, categories, products, variants, header, footer, media] = await Promise.all([
    payload.find({
      collection: 'pages',
      depth: 0,
      limit: 1000,
      overrideAccess: true,
      pagination: false,
    }),
    payload.find({
      collection: 'categories',
      depth: 0,
      limit: 1000,
      overrideAccess: true,
      pagination: false,
    }),
    payload.find({
      collection: 'products',
      depth: 0,
      limit: 1000,
      overrideAccess: true,
      pagination: false,
    }),
    payload.find({
      collection: 'variants',
      depth: 0,
      limit: 1000,
      overrideAccess: true,
      pagination: false,
    }),
    payload.findGlobal({
      slug: 'header',
      depth: 0,
      overrideAccess: true,
    }),
    payload.findGlobal({
      slug: 'footer',
      depth: 0,
      overrideAccess: true,
    }),
    payload.find({
      collection: 'media',
      depth: 0,
      limit: 1000,
      overrideAccess: true,
      pagination: false,
    }),
  ])

  const referencedMediaIDs = new Set<string>()

  collectReferencedMediaIDs(pages.docs, referencedMediaIDs)
  collectReferencedMediaIDs(categories.docs, referencedMediaIDs)
  collectReferencedMediaIDs(products.docs, referencedMediaIDs)
  collectReferencedMediaIDs(variants.docs, referencedMediaIDs)
  collectReferencedMediaIDs(header, referencedMediaIDs)
  collectReferencedMediaIDs(footer, referencedMediaIDs)

  const duplicateGroups = new Map<string, MediaDoc[]>()

  for (const doc of media.docs as MediaDoc[]) {
    const key = mediaGroupKey(doc)
    const current = duplicateGroups.get(key) || []
    current.push(doc)
    duplicateGroups.set(key, current)
  }

  const deleted: Array<{ filename: string; id: number | string }> = []
  const kept: Array<{ filename: string; id: number | string; reason: 'in-use' | 'newest' }> = []

  for (const group of duplicateGroups.values()) {
    if (group.length < 2) {
      continue
    }

    const sorted = [...group].sort(sortNewestFirst)
    const used = sorted.filter((doc) => referencedMediaIDs.has(String(doc.id)))

    if (used.length > 0) {
      for (const doc of used) {
        kept.push({
          filename: String(doc.filename || ''),
          id: doc.id,
          reason: 'in-use',
        })
      }

      for (const doc of sorted) {
        if (referencedMediaIDs.has(String(doc.id))) {
          continue
        }

        await payload.delete({
          collection: 'media',
          id: doc.id,
          overrideAccess: true,
        })

        deleted.push({
          filename: String(doc.filename || ''),
          id: doc.id,
        })
      }

      continue
    }

    const [keep, ...remove] = sorted

    kept.push({
      filename: String(keep.filename || ''),
      id: keep.id,
      reason: 'newest',
    })

    for (const doc of remove) {
      await payload.delete({
        collection: 'media',
        id: doc.id,
        overrideAccess: true,
      })

      deleted.push({
        filename: String(doc.filename || ''),
        id: doc.id,
      })
    }
  }

  console.log(
    JSON.stringify(
      {
        deletedCount: deleted.length,
        deleted,
        keptCount: kept.length,
        kept,
        referencedMediaCount: referencedMediaIDs.size,
      },
      null,
      2,
    ),
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
