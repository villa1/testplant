import 'dotenv/config'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { getPayload } from 'payload'

import { type LegacyMediaRecord, findExistingLegacyMedia, toAlt } from './lib/legacyMedia'
import { legacyBMJPagesPath } from './lib/legacyBMJPaths'

type LegacyExport = {
  forms: Array<Record<string, any>>
  media: LegacyMediaRecord[]
  pages: Array<Record<string, any>>
}

const legacyProjectRoot = path.resolve(process.cwd(), '..', 'mekarsarijaya')
const legacyMediaRoot = path.join(legacyProjectRoot, 'public', 'media')

const remapRelations = (
  value: unknown,
  parentKey: string | undefined,
  mediaMap: Map<string, number | string>,
  formMap: Map<string, number | string>,
): unknown => {
  if (Array.isArray(value)) {
    return value.map((item) => remapRelations(item, parentKey, mediaMap, formMap))
  }

  if (value && typeof value === 'object') {
    const output: Record<string, unknown> = {}

    for (const [key, childValue] of Object.entries(value)) {
      output[key] = remapRelations(childValue, key, mediaMap, formMap)
    }

    return output
  }

  if ((typeof value === 'number' || typeof value === 'string') && parentKey) {
    if (['backgroundImage', 'image', 'media'].includes(parentKey) && mediaMap.has(String(value))) {
      return mediaMap.get(String(value))
    }

    if (parentKey === 'form' && formMap.has(String(value))) {
      return formMap.get(String(value))
    }
  }

  return value
}

export async function run() {
  console.log(`[import] reading export from ${legacyBMJPagesPath}`)
  console.log('[import] loading payload config')

  const { default: config } = await import('../src/payload.config')
  console.log('[import] payload config loaded')

  const raw = await fs.readFile(legacyBMJPagesPath, 'utf8')
  const payload = await getPayload({ config: await config })
  console.log('[import] payload initialized')
  const { forms, media, pages } = JSON.parse(raw) as LegacyExport

  const mediaMap = new Map<string, number | string>()
  const formMap = new Map<string, number | string>()
  const currentMedia = await payload.find({
    collection: 'media',
    depth: 0,
    limit: 1000,
    overrideAccess: true,
    pagination: false,
  })

  console.log(`[import] media=${media.length} forms=${forms.length} pages=${pages.length}`)

  for (const legacyMedia of media) {
    console.log(`[media] checking ${legacyMedia.filename}`)
    let target = findExistingLegacyMedia(currentMedia.docs, legacyMedia)

    if (!target) {
      const absoluteFilePath = path.join(legacyMediaRoot, legacyMedia.filename)
      console.log(`[media] creating ${legacyMedia.filename} from ${absoluteFilePath}`)
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

      currentMedia.docs.push(target)
    }

    mediaMap.set(String(legacyMedia.id), target.id)
  }

  for (const legacyForm of forms) {
    console.log(`[form] syncing ${legacyForm.title}`)

    const existing = await payload.find({
      collection: 'forms',
      depth: 0,
      limit: 1,
      overrideAccess: true,
      pagination: false,
      where: {
        title: {
          equals: legacyForm.title,
        },
      },
    })

    const formData = {
      title: legacyForm.title,
      fields: legacyForm.fields,
      submitButtonLabel: legacyForm.submitButtonLabel,
      confirmationType: legacyForm.confirmationType,
      confirmationMessage: legacyForm.confirmationMessage,
      redirect: legacyForm.redirect,
      emails: legacyForm.emails,
    }

    const target = existing.docs[0]
      ? await payload.update({
          collection: 'forms',
          id: existing.docs[0].id,
          overrideAccess: true,
          data: formData,
        })
      : await payload.create({
          collection: 'forms',
          overrideAccess: true,
          data: formData,
        })

    formMap.set(String(legacyForm.id), target.id)
  }

  for (const legacyPage of pages) {
    console.log(`[page] syncing ${legacyPage.slug}`)

    const pageData = remapRelations(legacyPage, undefined, mediaMap, formMap) as Record<string, unknown>

    delete pageData.id
    delete pageData.createdAt
    delete pageData.updatedAt

    if ('publishedAt' in pageData) {
      pageData.publishedOn = pageData.publishedAt
      delete pageData.publishedAt
    }

    const existing = await payload.find({
      collection: 'pages',
      depth: 0,
      limit: 1,
      overrideAccess: true,
      pagination: false,
      where: {
        slug: {
          equals: String(pageData.slug),
        },
      },
    })

    if (existing.docs[0]) {
      await payload.update({
        collection: 'pages',
        id: existing.docs[0].id,
        context: {
          disableRevalidate: true,
        },
        overrideAccess: true,
        data: pageData as any,
      })
      console.log(`[page] updated ${legacyPage.slug}`)
    } else {
      await payload.create({
        collection: 'pages',
        context: {
          disableRevalidate: true,
        },
        overrideAccess: true,
        data: pageData as any,
      })
      console.log(`[page] created ${legacyPage.slug}`)
    }
  }

  console.log(
    JSON.stringify({
      importedPages: pages.length,
      importedMedia: media.length,
      importedForms: forms.length,
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
