import type { PayloadRequest } from 'payload'

import type { Media as MediaResource } from '@/payload-types'

export type SelectedMediaValue = MediaResource | number | string | null | undefined

export const getMediaID = (value: SelectedMediaValue) => {
  if (!value) {
    return null
  }

  if (typeof value === 'object') {
    return value.id
  }

  return value
}

export const selectedMediaHasAlt = async (req: PayloadRequest, value: SelectedMediaValue) => {
  if (typeof value === 'object' && value?.alt) {
    return Boolean(value.alt.trim())
  }

  const mediaID = getMediaID(value)

  if (!mediaID) {
    return false
  }

  const media = await req.payload.findByID({
    collection: 'media',
    id: mediaID,
    depth: 0,
    overrideAccess: true,
  })

  return Boolean(typeof media?.alt === 'string' && media.alt.trim())
}
