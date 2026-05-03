import type { Header } from '@/payload-types'

export type BrandingMode = 'logo' | 'logoText' | 'text'

export type HeaderLogoAsset = {
  alt: string
  height: number | null
  id: number | string
  url: string
  width: number | null
}

export type NormalizedHeaderIdentity = {
  brandDescription: string | null
  brandName: string
  effectiveMode: BrandingMode
  logo: HeaderLogoAsset | null
}

export type NormalizedHeaderNavItem = {
  href: string
  id: string
  isExternal: boolean
  label: string
  newTab: boolean
}

export type NormalizedStorefrontHeader = {
  identity: NormalizedHeaderIdentity
  navItems: NormalizedHeaderNavItem[]
}

const DEFAULT_BRAND_NAME = 'PT Bumi Mekarsari Jaya'

const VALID_BRANDING_MODES = new Set<BrandingMode>(['text', 'logo', 'logoText'])

const usesLogoMode = (mode: BrandingMode) => mode === 'logo' || mode === 'logoText'

const normalizeString = (value: string | null | undefined) => {
  if (typeof value !== 'string') {
    return null
  }

  const normalized = value.trim()

  return normalized.length > 0 ? normalized : null
}

const normalizeBrandingMode = (value: Header['brandingMode'] | null | undefined): BrandingMode => {
  if (typeof value === 'string' && VALID_BRANDING_MODES.has(value as BrandingMode)) {
    return value as BrandingMode
  }

  return 'text'
}

const toLogoAsset = (value: Header['logo']): HeaderLogoAsset | null => {
  if (!value || typeof value !== 'object') {
    return null
  }

  const alt = normalizeString(value.alt)
  const url = normalizeString(value.url)

  if (!alt || !url) {
    return null
  }

  return {
    alt,
    height: value.height ?? null,
    id: value.id,
    url,
    width: value.width ?? null,
  }
}

const toInternalHref = (slug: string) => (slug === 'home' ? '/' : `/${slug}`)

const resolveReferenceHref = (
  reference: NonNullable<NonNullable<Header['navItems']>[number]['link']['reference']>,
) => {
  if (typeof reference.value === 'object' && reference.value?.slug) {
    return toInternalHref(reference.value.slug)
  }

  return null
}

const isExternalHref = (href: string) => /^(https?:\/\/|mailto:|tel:)/i.test(href)

const normalizeNavItems = (items: Header['navItems']): NormalizedHeaderNavItem[] =>
  (items || [])
    .map((item, index) => {
      const label = normalizeString(item.link.label)

      if (!label) {
        return null
      }

      const href =
        item.link.type === 'reference' && item.link.reference
          ? resolveReferenceHref(item.link.reference)
          : normalizeString(item.link.url)

      if (!href) {
        return null
      }

      return {
        href,
        id: item.id || `${label}-${index}`,
        isExternal: isExternalHref(href),
        label,
        newTab: Boolean(item.link.newTab),
      }
    })
    .filter((item): item is NormalizedHeaderNavItem => Boolean(item))

export const normalizeStorefrontHeader = (header: Header): NormalizedStorefrontHeader => {
  const configuredMode = normalizeBrandingMode(header.brandingMode)
  const logo = toLogoAsset(header.logo)
  const effectiveMode = usesLogoMode(configuredMode) && !logo ? 'text' : configuredMode
  const brandName = normalizeString(header.brandName) || DEFAULT_BRAND_NAME
  const brandDescription = normalizeString(header.brandDescription)

  return {
    identity: {
      brandDescription,
      brandName,
      effectiveMode,
      logo,
    },
    navItems: normalizeNavItems(header.navItems),
  }
}
