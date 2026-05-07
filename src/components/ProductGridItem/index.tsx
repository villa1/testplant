import type { Product } from '@/payload-types'

import Link from 'next/link'
import React from 'react'
import clsx from 'clsx'
import { ArrowRight } from 'lucide-react'
import { Media } from '@/components/Media'
import { Price } from '@/components/Price'
import { ProductImageFallback } from '@/components/product/ProductImageFallback'
import { getProductPurchaseState } from '@/utilities/getProductPurchaseState'
import { getPrimaryProductMedia } from '@/utilities/productMedia'

type Props = {
  className?: string
  product: Partial<Product>
}

export const ProductGridItem: React.FC<Props> = ({ className, product }) => {
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

  const descriptor =
    attributes[0]?.title || useCases[0]?.title || primaryCategory?.title || 'Pilihan nursery untuk kebutuhan proyek'

  let statusCopy: string | null = null

  if (purchaseState.needsConsultation) {
    statusCopy = 'Konsultasikan'
  } else if (purchaseState.isOutOfStock) {
    statusCopy = 'Stok Kosong'
  } else if (purchaseState.orderType === 'rfq') {
    statusCopy = 'RFQ'
  }

  const priceLabel = purchaseState.shouldShowPrice ? 'Harga mulai' : 'Konsultasi'
  const detailCopy = purchaseState.canDirectPurchase
    ? 'Lihat detail'
    : purchaseState.canRequestQuote
      ? 'Ajukan RFQ'
      : 'Pelajari'

  return (
    <Link
      className={clsx(
        'catalog-product-card group',
        className,
      )}
      href={`/products/${product.slug}`}
    >
      <div className="catalog-product-card__media">
        {image ? (
          <Media
            className="relative h-full w-full object-cover"
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

        {statusCopy ? (
          <span
            className={clsx('catalog-product-card__status', {
              'bg-[#f2dfb0] text-[#7b6119]': purchaseState.needsConsultation,
              'bg-[#f2d6d6] text-[#9b3e3e]': purchaseState.isOutOfStock,
              'bg-[#d6ead4] text-[#46613e]':
                !purchaseState.needsConsultation && !purchaseState.isOutOfStock,
            })}
          >
            {statusCopy}
          </span>
        ) : null}
      </div>

      <div className="catalog-product-card__body">
        <div className="space-y-3">
          {primaryCategory ? <p className="catalog-product-card__eyebrow">{primaryCategory.title}</p> : null}

          <div className="space-y-2">
            <h3 className="catalog-product-card__title">{title}</h3>
            <p className="catalog-product-card__descriptor">{descriptor}</p>
          </div>

          {purchaseState.statusLabel ? <p className="catalog-product-card__detail">{purchaseState.statusLabel}</p> : null}
        </div>

        <div className="catalog-product-card__footer">
          <div className="space-y-1">
            <p className="catalog-product-card__price-label">{priceLabel}</p>
            {purchaseState.shouldShowPrice && typeof price === 'number' ? (
              <Price amount={price} className="text-xl font-semibold text-primary" />
            ) : (
              <p className="text-sm font-medium text-primary/75">
                {purchaseState.canRequestQuote ? 'Hubungi untuk penawaran' : 'Lihat spesifikasi lengkap'}
              </p>
            )}
          </div>

          <span className="catalog-product-card__cta">
            {detailCopy}
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  )
}
