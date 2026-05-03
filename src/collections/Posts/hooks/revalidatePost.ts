import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath } from 'next/cache'

const getPostPath = (slug?: null | string) => (slug ? `/artikel/${slug}` : null)

export const revalidatePost: CollectionAfterChangeHook = ({
  doc,
  previousDoc,
  req: { context, payload },
}) => {
  if (!context.disableRevalidate) {
    if (doc?._status === 'published') {
      const currentPath = getPostPath(doc.slug)

      if (currentPath) {
        payload.logger.info(`Revalidating post at path: ${currentPath}`)
        revalidatePath(currentPath)
      }

      revalidatePath('/artikel')
    }

    if (previousDoc?._status === 'published') {
      const oldPath = getPostPath(previousDoc.slug)

      if (oldPath && oldPath !== getPostPath(doc?.slug)) {
        payload.logger.info(`Revalidating old post at path: ${oldPath}`)
        revalidatePath(oldPath)
      }

      if (doc?._status !== 'published') {
        revalidatePath('/artikel')
      }
    }
  }

  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    const path = getPostPath(doc?.slug)

    if (path) {
      revalidatePath(path)
    }

    revalidatePath('/artikel')
  }

  return doc
}
