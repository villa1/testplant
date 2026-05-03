import 'dotenv/config'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { getPayload } from 'payload'

import { run as runArticlesImport } from './importLegacyBMJArticles'
import { run as runGlobalsImport } from './importLegacyBMJGlobals'
import { run as runPagesImport } from './importLegacyBMJPages'
import { legacyBMJPagesPath } from './lib/legacyBMJPaths'
import { notifyStorefrontRevalidate } from './lib/notifyStorefrontRevalidate'

type LegacyPageExport = {
  slug?: string | null
}

async function getLegacyPagePaths() {
  const raw = await fs.readFile(legacyBMJPagesPath, 'utf8')
  const data = JSON.parse(raw) as { pages?: LegacyPageExport[] }

  return (data.pages || [])
    .map((page) => {
      if (!page.slug) {
        return null
      }

      return page.slug === 'home' ? '/' : `/${page.slug}`
    })
    .filter((value): value is string => Boolean(value))
}

async function deletePageBySlug(slug: string) {
  const { default: config } = await import('../src/payload.config')
  const payload = await getPayload({ config: await config })

  const page = await payload.find({
    collection: 'pages',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  if (!page.docs[0]) {
    return false
  }

  await payload.delete({
    collection: 'pages',
    id: page.docs[0].id,
    overrideAccess: true,
    context: {
      disableRevalidate: true,
    },
  })

  return true
}

async function deleteFormByTitle(title: string) {
  const { default: config } = await import('../src/payload.config')
  const payload = await getPayload({ config: await config })

  const form = await payload.find({
    collection: 'forms',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    pagination: false,
    where: {
      title: {
        equals: title,
      },
    },
  })

  if (!form.docs[0]) {
    return false
  }

  await payload.delete({
    collection: 'forms',
    id: form.docs[0].id,
    overrideAccess: true,
  })

  return true
}

export async function run() {
  await runPagesImport()
  await runGlobalsImport()
  const articleImport = await runArticlesImport({
    revalidate: false,
  })

  const deletedSampleContactPage = await deletePageBySlug('contact')
  const deletedSampleContactForm = await deleteFormByTitle('Contact Form')
  const pagePaths = await getLegacyPagePaths()

  await notifyStorefrontRevalidate({
    globals: ['header', 'footer'],
    paths: [...pagePaths, ...articleImport.paths, '/contact'],
  })

  console.log(
    JSON.stringify(
      {
        articleImport,
        deletedSampleContactForm,
        deletedSampleContactPage,
        restored: true,
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
