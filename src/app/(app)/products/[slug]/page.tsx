import type { Media, Product } from '@/payload-types'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { ArticleCard } from '@/components/ArticleCard'
import { GridTileImage } from '@/components/Grid/tile'
import { Media as MediaComponent } from '@/components/Media'
import { Gallery } from '@/components/product/Gallery'
import { ProductDescription } from '@/components/product/ProductDescription'
import { ProductImageFallback } from '@/components/product/ProductImageFallback'
import { extractLexicalPlainText } from '@/utilities/extractLexicalPlainText'
import { getProductPurchaseState } from '@/utilities/getProductPurchaseState'
import {
  getPrimaryProductMedia,
  normalizeProductContextGallery,
  normalizeProductGallery,
} from '@/utilities/productMedia'
import { getServerSideURL } from '@/utilities/getURL'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React, { Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeftIcon } from 'lucide-react'
import { Metadata } from 'next'

type Args = {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const product = await queryProductBySlug({ slug })

  if (!product) return notFound()

  const gallery = normalizeProductGallery(product.gallery)
  const seoImage = getPrimaryProductMedia(product)

  const canIndex = product._status === 'published'
  const serverURL = getServerSideURL()

  const description = product.meta?.description || extractLexicalPlainText(product.description)
  const canonicalUrl =
    product.meta?.canonicalUrl ||
    `${serverURL}/products/${encodeURIComponent(product.slug || '')}`

  return {
    alternates: {
      canonical: canonicalUrl,
    },
    description,
    openGraph: seoImage?.url
      ? {
          description,
          images: [
            {
              alt: seoImage?.alt,
              height: seoImage.height!,
              url: seoImage?.url.startsWith('http') ? seoImage?.url : `${serverURL}${seoImage?.url}`,
              width: seoImage.width!,
            },
          ],
        }
      : null,
    robots: {
      follow: canIndex,
      googleBot: {
        follow: canIndex,
        index: canIndex,
      },
      index: canIndex,
    },
    title: product.meta?.title || product.title,
  }
}

export default async function ProductPage({ params }: Args) {
  const { slug } = await params
  const product = await queryProductBySlug({ slug })

  if (!product) return notFound()

  const gallery = normalizeProductGallery(product.gallery)
  const productGallery = normalizeProductContextGallery(product.productGallery)
  const primaryMedia = getPrimaryProductMedia(product)
  const purchaseState = getProductPurchaseState(product)
  const hasStock = product.enableVariants
    ? product?.variants?.docs?.some((variant) => {
        if (typeof variant !== 'object') return false
        return variant.inventory && variant?.inventory > 0
      })
    : product.inventory! > 0
  const category =
    product.categories?.find((item): item is Exclude<typeof item, number | string> => typeof item === 'object') ||
    null
  const relatedArticles =
    product.relatedArticles?.filter((article): article is Exclude<typeof article, number | string> => typeof article === 'object') ||
    []

  let lowestPrice = product.priceInUSD
  let highestPrice = product.priceInUSD

  if (product.enableVariants && product?.variants?.docs?.length) {
    const numericPrices = product.variants.docs
      .filter((variant): variant is Exclude<typeof variant, string | number> => typeof variant === 'object')
      .map((variant) => variant.priceInUSD)
      .filter((value): value is number => typeof value === 'number')

    if (numericPrices.length > 0) {
      lowestPrice = Math.min(...numericPrices)
      highestPrice = Math.max(...numericPrices)
    }
  }

  const descriptionPlainText = extractLexicalPlainText(product.description)
  const serverURL = getServerSideURL()
  const imageUrls = gallery
    .map((item) => item.image?.url)
    .filter((url): url is string => Boolean(url))
    .map((url) => (url.startsWith('http') ? url : `${serverURL}${url}`))
  const seoImageUrl = primaryMedia?.url
    ? primaryMedia.url.startsWith('http')
      ? primaryMedia.url
      : `${serverURL}${primaryMedia.url}`
    : undefined

  const productJsonLd = {
    name: product.title,
    '@context': 'https://schema.org',
    '@type': 'Product',
    brand: {
      '@type': 'Brand',
      name: 'PT Bumi Mekarsari Jaya',
    },
    description: descriptionPlainText,
    image: imageUrls.length > 0 ? imageUrls : seoImageUrl ? [seoImageUrl] : undefined,
    offers: {
      '@type': 'AggregateOffer',
      availability:
        purchaseState.isAvailable && hasStock
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      ...(purchaseState.shouldShowPrice && typeof lowestPrice === 'number'
        ? {
            highPrice: typeof highestPrice === 'number' ? highestPrice : lowestPrice,
            lowPrice: lowestPrice,
            offerCount: product.enableVariants ? product.variants?.docs?.length || 1 : 1,
            priceCurrency: 'USD',
          }
        : {}),
      seller: {
        '@type': 'Organization',
        name: 'PT Bumi Mekarsari Jaya',
        url: serverURL,
      },
    },
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Shop',
        item: `${serverURL}/shop`,
      },
      ...(category
        ? [
            {
              '@type': 'ListItem',
              position: 2,
              name: category.title,
              item: `${serverURL}/shop?category=${category.id}`,
            },
          ]
        : []),
      {
        '@type': 'ListItem',
        position: category ? 3 : 2,
        name: product.title,
      },
    ],
  }

  const relatedProducts =
    product.relatedProducts?.filter((relatedProduct) => typeof relatedProduct === 'object') ?? []

  return (
    <React.Fragment>
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd),
        }}
        type="application/ld+json"
      />
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
        type="application/ld+json"
      />
      <div className="container pt-8 pb-8">
        <Button asChild variant="ghost" className="mb-4">
          <Link href="/shop">
            <ChevronLeftIcon />
            Semua produk
          </Link>
        </Button>
        <div className="flex flex-col gap-12 rounded-lg border p-8 md:py-12 lg:flex-row lg:gap-8 bg-primary-foreground">
          <div className="h-full w-full basis-full lg:basis-1/2">
            <Suspense
              fallback={
                <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden" />
              }
            >
              {gallery.length > 0 ? (
                <Gallery gallery={gallery} productTitle={product.title} />
              ) : (
                <ProductImageFallback
                  className="max-h-[550px] w-full"
                  title={product.title}
                />
              )}
            </Suspense>
          </div>

          <div className="basis-full lg:basis-1/2">
            <ProductDescription product={product} />
          </div>
        </div>

        <div className="mt-10 space-y-10">
          <ProductSpecificationSections product={product} />

          {productGallery.length ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold">Galeri Kebun & Konteks Supply</h2>
                <p className="text-sm text-primary/60">
                  Foto ini membantu menunjukkan konteks supply nyata dari jaringan kebun BMJ.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {productGallery.map((item, index) => (
                  <div
                    className="overflow-hidden rounded-2xl border bg-primary-foreground"
                    key={`${item.image.id}-${index}`}
                  >
                    <MediaComponent
                      resource={item.image}
                      imgClassName="aspect-[4/3] h-auto w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {product.videoUrl ? (
            <div className="space-y-3 rounded-2xl border bg-primary-foreground p-6">
              <h2 className="text-2xl font-semibold">Video Produk</h2>
              <Link
                className="inline-flex text-sm font-medium text-primary hover:underline"
                href={product.videoUrl}
                rel="noreferrer"
                target="_blank"
              >
                Lihat video tanaman ini
              </Link>
            </div>
          ) : null}
        </div>
      </div>

      {product.layout?.length ? <RenderBlocks blocks={product.layout} /> : <></>}

      {relatedArticles.length ? (
        <div className="container pt-8">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Artikel Terkait</h2>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {relatedArticles.map((post) => (
                <ArticleCard key={post.id} post={post} />
              ))}
            </div>
          </section>
        </div>
      ) : null}

      {relatedProducts.length ? (
        <div className="container">
          <RelatedProducts products={relatedProducts as Product[]} />
        </div>
      ) : (
        <></>
      )}
    </React.Fragment>
  )
}

function RelatedProducts({ products }: { products: Product[] }) {
  if (!products.length) return null

  return (
    <div className="py-8">
      <h2 className="mb-4 text-2xl font-bold">Related Products</h2>
      <ul className="flex w-full gap-4 overflow-x-auto pt-1">
        {products.map((product) => (
          <li
            className="aspect-square w-full flex-none min-[475px]:w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5"
            key={product.id}
          >
            <Link className="relative h-full w-full" href={`/products/${product.slug}`}>
              <GridTileImage
                label={{
                  amount: product.priceInUSD!,
                  title: product.title,
                }}
                media={product.meta?.image as Media}
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

const queryProductBySlug = async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'products',
    depth: 1,
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      and: [
        {
          slug: {
            equals: slug,
          },
        },
        ...(draft ? [] : [{ _status: { equals: 'published' } }]),
      ],
    },
    populate: {
      categories: {
        title: true,
      },
      media: {
        alt: true,
        filename: true,
        height: true,
        url: true,
        width: true,
      },
      postCategories: {
        title: true,
      },
      posts: {
        categories: true,
        heroImage: true,
        meta: true,
        publishedAt: true,
        slug: true,
        title: true,
      },
      productAttributes: {
        title: true,
      },
      products: {
        meta: true,
        priceInUSD: true,
        slug: true,
        title: true,
      },
      productUseCases: {
        title: true,
      },
      variants: {
        inventory: true,
        options: true,
        priceInUSD: true,
        title: true,
      },
      variantOptions: {
        label: true,
      },
      variantTypes: {
        label: true,
        name: true,
        options: true,
      },
    },
  })

  const product = result.docs?.[0] || null

  if (!product) {
    return null
  }

  return {
    ...product,
    gallery: normalizeProductGallery(product.gallery) as Product['gallery'],
    productGallery: normalizeProductContextGallery(product.productGallery) as Product['productGallery'],
  }
}

function ProductSpecificationSections({ product }: { product: Product }) {
  const physicalSpecs = toInfoItems([
    ['Kebutuhan Sinar Matahari', getSelectLabel(product.sunRequirement)],
    ['Kebutuhan Air', getSelectLabel(product.waterRequirement)],
    ['Kecepatan Tumbuh', getSelectLabel(product.growthRate)],
    ['Kondisi Tanaman', getSelectLabel(product.plantCondition)],
  ])

  const botanicalSpecs = toInfoItems([
    ['Famili', product.family],
    ['Asal Geografis', product.nativeRegion],
    ['Tinggi Dewasa', product.plantHeight],
    ['Lebar Tajuk Dewasa', product.plantSpread],
    ['Tanah Ideal', product.idealSoil],
    ['Keunikan', product.specialFeature],
  ])

  const trustNotes = toInfoItems([
    ['Asal Kebun', product.originLocation],
    ['Catatan Supply', product.supplyNote],
    ['Standar Kualitas', product.qualityNote],
  ])

  if (physicalSpecs.length === 0 && botanicalSpecs.length === 0 && trustNotes.length === 0) {
    return null
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {physicalSpecs.length > 0 ? (
        <InfoCard title="Karakteristik Fisik" items={physicalSpecs} />
      ) : null}
      {botanicalSpecs.length > 0 ? (
        <InfoCard title="Botanical & Expertise" items={botanicalSpecs} />
      ) : null}
      {trustNotes.length > 0 ? <InfoCard title="Supply & Trust" items={trustNotes} /> : null}
    </div>
  )
}

function InfoCard({ title, items }: { title: string; items: string[][] }) {
  return (
    <section className="rounded-2xl border bg-primary-foreground p-6">
      <h2 className="mb-4 text-xl font-semibold">{title}</h2>
      <dl className="space-y-4">
        {items.map(([label, value]) => (
          <div className="space-y-1" key={label}>
            <dt className="text-sm font-medium text-primary/60">{label}</dt>
            <dd className="text-sm leading-6 text-primary/90">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

function getSelectLabel(value: string | null | undefined) {
  if (!value) return null

  const labels: Record<string, string> = {
    bibit: 'Bibit',
    cepat: 'Cepat',
    'full-shade': 'Full Shade',
    'full-sun': 'Full Sun',
    lambat: 'Lambat',
    'partial-shade': 'Partial Shade',
    remaja: 'Remaja',
    rendah: 'Rendah',
    sedang: 'Sedang',
    'siap-tanam': 'Siap Tanam',
    tinggi: 'Tinggi',
  }

  return labels[value] || value
}

function toInfoItems(items: Array<[string, string | null | undefined]>): string[][] {
  return items.filter((item): item is [string, string] => Boolean(item[1]))
}
