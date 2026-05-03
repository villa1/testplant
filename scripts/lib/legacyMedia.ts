import path from 'node:path'

export type LegacyMediaRecord = {
  alt?: string | null
  filename: string
  filesize?: number | null
  height?: number | null
  id: number | string
  mimeType?: string | null
  width?: number | null
}

type CurrentMediaDoc = {
  alt?: string | null
  filename?: string | null
  filesize?: number | null
  height?: number | null
  id: number | string
  mimeType?: string | null
  width?: number | null
}

export const toAlt = (filename: string) =>
  path
    .parse(filename)
    .name
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const escapeForRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const matchesLegacyFilename = (candidate: string, legacyFilename: string) => {
  const parsed = path.parse(legacyFilename)
  const pattern = new RegExp(
    `^${escapeForRegex(parsed.name)}(?:-\\d+)?${escapeForRegex(parsed.ext)}$`,
    'i',
  )

  return pattern.test(candidate)
}

const sameDefinedNumber = (left: number | null | undefined, right: number | null | undefined) =>
  typeof left !== 'number' || typeof right !== 'number' || left === right

const matchesLegacyMetadata = (doc: CurrentMediaDoc, legacyMedia: LegacyMediaRecord) => {
  const expectedAlt = (legacyMedia.alt || toAlt(legacyMedia.filename)).trim()

  if (!expectedAlt || String(doc.alt || '').trim() !== expectedAlt) {
    return false
  }

  if (legacyMedia.mimeType && doc.mimeType && legacyMedia.mimeType !== doc.mimeType) {
    return false
  }

  if (!sameDefinedNumber(doc.filesize, legacyMedia.filesize)) {
    return false
  }

  if (!sameDefinedNumber(doc.width, legacyMedia.width)) {
    return false
  }

  if (!sameDefinedNumber(doc.height, legacyMedia.height)) {
    return false
  }

  return true
}

export const findExistingLegacyMedia = <T extends CurrentMediaDoc>(
  docs: T[],
  legacyMedia: LegacyMediaRecord,
) =>
  docs.find((doc) => matchesLegacyFilename(String(doc.filename || ''), legacyMedia.filename)) ||
  docs.find((doc) => matchesLegacyMetadata(doc, legacyMedia))
