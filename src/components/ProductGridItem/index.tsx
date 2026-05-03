import type { Product, Variant } from '@/payload-types'

import Link from 'next/link'
import React from 'react'
import clsx from 'clsx'
import { Media } from '@/components/Media'
import { Price } from '@/components/Price'
import { ProductImageFallback } from '@/components/product/ProductImageFallback'
import { getProductPurchaseState } from '@/utilities/getProductPurchaseState'
import { getPrimaryProductMedia } from '@/utilities/productMedia'

type Props = {
  product: Partial<Product>
}

export const ProductGridItem: React.FC<Props> = ({ product }) => {
  const { gallery, priceInUSD, title } = product
  const purchaseState = getProductPurchaseState(product)

  let price = priceInUSD

  const variants = product.variants?.docs

  if (variants && variants.length > 0) {
    const variant = variants[0]
    if (
      variant &&
      typeof variant === 'object' &&
      variant?.priceInUSD &&
      typeof variant.priceInUSD === 'number'
    ) {
      price = variant.priceInUSD
    }
  }

  const image = getPrimaryProductMedia({
    gallery,
    meta: product.meta,
  })
  const primaryCategory =
    product.categories?.find((item): item is Exclude<typeof item, number | string> => typeof item === 'object') ||
    null
  const attributes =
    product.attributes?.filter((item): item is Exclude<typeof item, number | string> => typeof item === 'object') ||
    []
  const useCases =
    product.useCases?.filter((item): item is Exclude<typeof item, number | string> => typeof item === 'object') ||
    []

  const secondaryTags = [...attributes.map((item) => item.title), ...useCases.map((item) => item.title)].slice(0, 2)

  let statusCopy: string | null = null

  if (purchaseState.needsConsultation) {
    statusCopy = 'Konsultasikan'
  } else if (purchaseState.isOutOfStock) {
    statusCopy = 'Stok Kosong'
  } else if (purchaseState.orderType === 'rfq') {
    statusCopy = 'RFQ'
  }

  const footerCopy = purchaseState.canDirectPurchase
    ? 'Lihat & beli'
    : purchaseState.canRequestQuote
      ? 'Lihat & ajukan RFQ'
      : 'Lihat detail'

  return (
    <Link
      className="group flex h-full w-full flex-col overflow-hidden rounded-[1.75rem] border border-border bg-primary-foreground shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl"
      href={`/products/${product.slug}`}
    >
      <div className="relative">
        {image ? (
          <Media
            className={clsx('relative aspect-square object-cover p-8')}
            height={80}
            imgClassName={clsx('h-full w-full rounded-[1.5rem] object-cover', {
              'transition duration-300 ease-in-out group-hover:scale-[1.03]': true,
            })}
            resource={image}
            width={80}
          />
        ) : (
          <ProductImageFallback className="aspect-square rounded-none border-0" title={title} />
        )}

        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-4">
          {primaryCategory ? (
            <span className="rounded-full bg-card/95 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.12em] text-primary shadow-sm">
              {primaryCategory.title}
            </span>
          ) : <span />}

          {statusCopy ? (
            <span
              className={clsx(
                'rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] shadow-sm',
                {
                  'bg-amber-100 text-amber-800': purchaseState.needsConsultation,
                  'bg-red-100 text-red-800': purchaseState.isOutOfStock,
                  'bg-emerald-100 text-emerald-800':
                    !purchaseState.needsConsultation && !purchaseState.isOutOfStock,
                },
              )}
            >
              {statusCopy}
            </span>
          ) : null}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="space-y-3">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold leading-tight text-primary transition-colors group-hover:text-primary/80">
              {title}
            </h3>
          </div>

          {secondaryTags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {secondaryTags.map((tag) => (
                <span
                  className="rounded-full border border-border bg-accent px-2.5 py-1 text-[11px] text-primary/70"
                  key={tag}
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        <div className="mt-auto flex items-end justify-between gap-4 border-t border-border pt-4">
          <div className="space-y-1">
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-primary/45">
              {purchaseState.shouldShowPrice ? 'Harga' : 'Aksi'}
            </p>
            {purchaseState.shouldShowPrice && typeof price === 'number' ? (
              <Price amount={price} className="text-base font-medium text-primary" />
            ) : (
              <p className="text-sm font-medium text-primary/70">
                {purchaseState.canRequestQuote ? 'Request Quotation' : 'Lihat detail'}
              </p>
            )}
          </div>

          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-primary/55 transition-colors group-hover:text-primary">
            {footerCopy}
          </span>
        </div>
      </div>
    </Link>
  )
}
