import type { Media, Product } from '@/payload-types'

export const PRODUCT_IMAGE_FALLBACK_SRC = '/media/bmj-product-placeholder.svg'

type ProductWithMedia = Pick<Product, 'gallery' | 'meta'>

export type NormalizedProductGalleryItem = Omit<NonNullable<Product['gallery']>[number], 'image'> & {
  image: Media
}

export type NormalizedContextGalleryItem = Omit<
  NonNullable<Product['productGallery']>[number],
  'image'
> & {
  image: Media
}

export function hasValidMediaURL(resource: unknown): resource is Media {
  return Boolean(
    resource &&
      typeof resource === 'object' &&
      'url' in resource &&
      typeof resource.url === 'string' &&
      resource.url,
  )
}

export function normalizeProductGallery(
  gallery: Product['gallery'] | null | undefined,
): NormalizedProductGalleryItem[] {
  return (gallery || []).flatMap((item) => {
    if (!hasValidMediaURL(item?.image)) return []

    return [
      {
        ...item,
        image: item.image,
      },
    ]
  })
}

export function normalizeProductContextGallery(
  gallery: Product['productGallery'] | null | undefined,
): NormalizedContextGalleryItem[] {
  return (gallery || []).flatMap((item) => {
    if (!hasValidMediaURL(item?.image)) return []

    return [
      {
        ...item,
        image: item.image,
      },
    ]
  })
}

export function getPrimaryProductMedia(product: ProductWithMedia): Media | null {
  const normalizedGallery = normalizeProductGallery(product.gallery)

  if (normalizedGallery.length > 0) {
    return normalizedGallery[0].image
  }

  if (hasValidMediaURL(product.meta?.image)) {
    return product.meta.image
  }

  return null
}
