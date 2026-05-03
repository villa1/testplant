import { revalidatePath, revalidateTag } from 'next/cache'

import type { Config } from 'src/payload-types'

type GlobalSlug = keyof Config['globals']

type RevalidateStorefrontArgs = {
  globals?: GlobalSlug[]
  paths?: string[]
}

const normalizePath = (value: string) => {
  if (!value) {
    return null
  }

  const trimmed = value.trim()

  if (!trimmed) {
    return null
  }

  if (trimmed === '/') {
    return '/'
  }

  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`
}

export const revalidateStorefront = ({ globals = [], paths = [] }: RevalidateStorefrontArgs) => {
  for (const slug of new Set(globals)) {
    revalidateTag(`global_${slug}`, 'max')
  }

  for (const path of new Set(paths.map(normalizePath).filter((value): value is string => Boolean(value)))) {
    revalidatePath(path)
  }
}
