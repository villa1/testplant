import React from 'react'

import type { Category, Product, SupplyCategoriesBlock as SupplyCategoriesBlockProps } from '@/payload-types'

import configPromise from '@payload-config'
import Link from 'next/link'
import { getPayload } from 'payload'

import { Media } from '@/components/Media'
import { Price } from '@/components/Price'
import { SectionHeader } from '@/components/SectionHeader'
import {
  getPrimaryProductMedia,
  hasValidMediaURL,
  normalizeProductContextGallery,
  normalizeProductGallery,
} from '@/utilities/productMedia'

type HomepageCategory = Pick<Category, 'id' | 'slug' | 'title'>

type HomepageProduct = Pick<
  Product,
  | 'availabilityStatus'
  | 'categories'
  | 'gallery'
  | 'id'
  | 'meta'
  | 'orderType'
  | 'priceInUSD'
  | 'productGallery'
  | 'slug'
  | 'title'
  | 'updatedAt'
>

const isRasterMedia = (media: unknown): media is NonNullable<ReturnType<typeof getPrimaryProductMedia>> => {
  return Boolean(hasValidMediaURL(media) && media.mimeType && media.mimeType !== 'image/svg+xml')
}

const getShowcaseProductMedia = (product: HomepageProduct) => {
  const galleryItem = normalizeProductGallery(product.gallery).find((item) => isRasterMedia(item.image))

  if (galleryItem) return galleryItem.image

  const contextGalleryItem = normalizeProductContextGallery(product.productGallery).find((item) =>
    isRasterMedia(item.image),
  )

  if (contextGalleryItem) return contextGalleryItem.image

  if (isRasterMedia(product.meta?.image)) {
    return product.meta.image
  }

  return null
}

const productRank = (product: HomepageProduct): number => {
  let score = 0

  if (typeof product.priceInUSD === 'number') score += 4
  if (getPrimaryProductMedia(product)) score += 3
  if (product.availabilityStatus === 'tersedia') score += 2
  if (product.orderType === 'langsung' || product.orderType === 'keduanya') score += 1

  return score
}

const productBelongsToCategory = (product: HomepageProduct, categoryId: string): boolean => {
  return (product.categories || []).some((category) => {
    if (typeof category === 'object' && category?.id) {
      return String(category.id) === categoryId
    }

    return String(category) === categoryId
  })
}

const getRepresentativeProduct = (products: HomepageProduct[]): HomepageProduct | null => {
  if (products.length === 0) return null

  return [...products].sort((left, right) => {
    const rankDelta = productRank(right) - productRank(left)

    if (rankDelta !== 0) return rankDelta

    const rightUpdatedAt = right.updatedAt ? new Date(right.updatedAt).getTime() : 0
    const leftUpdatedAt = left.updatedAt ? new Date(left.updatedAt).getTime() : 0
    const updatedAtDelta = rightUpdatedAt - leftUpdatedAt

    if (updatedAtDelta !== 0) return updatedAtDelta

    return left.title.localeCompare(right.title)
  })[0]
}

export const SupplyCategoriesBlock = async ({ intro, title }: SupplyCategoriesBlockProps) => {
  const payload = await getPayload({ config: configPromise })

  const [categoriesResult, productsResult] = await Promise.all([
    payload.find({
      collection: 'categories',
      limit: 100,
      overrideAccess: false,
      pagination: false,
      select: {
        slug: true,
        title: true,
      },
      sort: '-createdAt',
    }),
    payload.find({
      collection: 'products',
      draft: false,
      limit: 100,
      overrideAccess: false,
      pagination: false,
      select: {
        availabilityStatus: true,
        categories: true,
        gallery: true,
        meta: true,
        orderType: true,
        priceInUSD: true,
        productGallery: true,
        slug: true,
        title: true,
        updatedAt: true,
      },
      where: {
        _status: {
          equals: 'published',
        },
      },
    }),
  ])

  const categories = categoriesResult.docs as HomepageCategory[]
  const products = productsResult.docs as HomepageProduct[]
  const entries = categories.map((category) => {
    const categoryProducts = products.filter((product) => productBelongsToCategory(product, String(category.id)))
    const representativeProduct = getRepresentativeProduct(categoryProducts)

    return {
      category,
      categoryHref: `/shop?category=${category.id}`,
      heroImage: representativeProduct ? getShowcaseProductMedia(representativeProduct) : null,
      representativeProduct,
      productHref: representativeProduct?.slug ? `/products/${representativeProduct.slug}` : `/shop?category=${category.id}`,
    }
  })

  return (
    <section className="container">
      <div className="space-y-6">
        <SectionHeader intro={intro} title={title} />

        <div className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-5 lg:gap-4">
            {entries.map(({ category, categoryHref, heroImage }) => {
              return (
                <Link
                  className="group block overflow-hidden rounded-[1.25rem] bg-neutral-950 shadow-[0_10px_26px_rgba(15,23,42,0.12)]"
                  href={categoryHref}
                  key={category.id}
                >
                  <div className="relative aspect-[4/5] overflow-hidden">
                      {heroImage ? (
                        <Media
                          fill
                          htmlElement={null}
                          imgClassName="object-cover transition duration-500 group-hover:scale-[1.04]"
                          resource={heroImage}
                          size="(max-width: 1024px) 46vw, 18vw"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-[linear-gradient(160deg,#245a36_0%,#17361f_55%,#0f2517_100%)]" />
                    )}

                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,20,12,0.04)_0%,rgba(10,20,12,0.36)_55%,rgba(10,20,12,0.92)_100%)]" />

                    <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
                      <p className="max-w-[14ch] text-sm font-semibold leading-tight text-white sm:text-base">
                        {category.title}
                      </p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-5 lg:gap-4">
            {entries.map(({ category, heroImage, productHref, representativeProduct }) => {
              return representativeProduct ? (
                <Link
                  className="group block overflow-hidden rounded-[1.25rem] border border-black/6 bg-white p-2.5 shadow-[0_0_1px_rgba(0,0,0,0.22)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(15,23,42,0.10)] sm:p-3"
                  href={productHref}
                  key={category.id}
                >
                  <div className="space-y-2.5">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-[1rem] bg-[#f3f3f3]">
                      {heroImage ? (
                        <Media
                          fill
                          htmlElement={null}
                          imgClassName="object-cover transition duration-500 group-hover:scale-[1.03]"
                          resource={heroImage}
                          size="(max-width: 1024px) 46vw, 18vw"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-[linear-gradient(160deg,#f5f8f2_0%,#edf4ea_52%,#dfeadb_100%)]">
                          <div className="absolute inset-x-0 top-0 h-10 bg-[radial-gradient(circle_at_top_left,rgba(70,126,72,0.14),transparent_58%)]" />
                          <div className="absolute inset-x-0 bottom-0 p-3">
                            <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#49654a]">
                              BMJ Sample Product
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="line-clamp-2 text-[13px] font-semibold leading-snug text-foreground sm:text-sm">
                        {representativeProduct.title}
                      </h3>

                      <div className="flex items-end justify-between gap-2 border-t border-black/6 pt-2">
                        {typeof representativeProduct.priceInUSD === 'number' ? (
                          <Price
                            amount={representativeProduct.priceInUSD}
                            as="span"
                            className="text-sm font-bold text-foreground"
                          />
                        ) : (
                          <span className="text-sm font-semibold text-foreground">Lihat Detail</span>
                        )}

                        <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-foreground/55">
                          Detail
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="rounded-[1.25rem] border border-dashed border-border bg-card/50 p-4" key={category.id}>
                  <p className="text-sm font-semibold text-foreground">{category.title}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Produk representatif untuk kategori ini sedang disiapkan.
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
