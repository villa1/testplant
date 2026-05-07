'use client'
import type { Product, Variant } from '@/payload-types'

import { RichText } from '@/components/RichText'
import { AddToCart } from '@/components/Cart/AddToCart'
import { Price } from '@/components/Price'
import { Button } from '@/components/ui/button'
import {
  ProductActionSkeleton,
  ProductInlineStatusSkeleton,
  ProductOptionGroupSkeleton,
} from '@/components/product/ProductSkeletons'
import { getProductPurchaseState } from '@/utilities/getProductPurchaseState'
import Link from 'next/link'
import React, { Suspense } from 'react'

import { VariantSelector } from './VariantSelector'
import { useCurrency } from '@payloadcms/plugin-ecommerce/client/react'
import { StockIndicator } from '@/components/product/StockIndicator'

export function ProductDescription({ product }: { product: Product }) {
  const { currency } = useCurrency()
  const purchaseState = getProductPurchaseState(product)
  let amount = 0,
    lowestAmount = 0,
    highestAmount = 0
  const priceField = `priceIn${currency.code}` as keyof Product
  const hasVariants = product.enableVariants && Boolean(product.variants?.docs?.length)
  const categories =
    product.categories?.filter((item): item is Exclude<typeof item, number | string> => typeof item === 'object') ||
    []
  const attributes =
    product.attributes?.filter((item): item is Exclude<typeof item, number | string> => typeof item === 'object') ||
    []
  const useCases =
    product.useCases?.filter((item): item is Exclude<typeof item, number | string> => typeof item === 'object') ||
    []

  if (hasVariants) {
    const priceField = `priceIn${currency.code}` as keyof Variant
    const variantsOrderedByPrice = product.variants?.docs
      ?.filter((variant) => variant && typeof variant === 'object')
      .sort((a, b) => {
        if (
          typeof a === 'object' &&
          typeof b === 'object' &&
          priceField in a &&
          priceField in b &&
          typeof a[priceField] === 'number' &&
          typeof b[priceField] === 'number'
        ) {
          return a[priceField] - b[priceField]
        }

        return 0
      }) as Variant[]

    const lowestVariant = variantsOrderedByPrice[0][priceField]
    const highestVariant = variantsOrderedByPrice[variantsOrderedByPrice.length - 1][priceField]
    if (
      variantsOrderedByPrice &&
      typeof lowestVariant === 'number' &&
      typeof highestVariant === 'number'
    ) {
      lowestAmount = lowestVariant
      highestAmount = highestVariant
    }
  } else if (product[priceField] && typeof product[priceField] === 'number') {
    amount = product[priceField]
  }

  return (
    <div className="flex flex-col gap-6 lg:self-start">
      <div className="flex flex-col gap-5 border-b border-border/70 pb-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl space-y-3">
          <div className="space-y-1">
            <h1 className="text-2xl font-medium text-balance">{product.title}</h1>
            {product.nameLatin ? (
              <p className="text-sm italic text-primary/60">{product.nameLatin}</p>
            ) : null}
          </div>

          {(categories.length > 0 || attributes.length > 0 || useCases.length > 0) && (
            <div className="flex flex-wrap gap-2 text-xs">
              {categories.map((category) => (
                <span
                  className="rounded-full border border-border bg-card px-3 py-1 font-medium"
                  key={category.id}
                >
                  {category.title}
                </span>
              ))}
              {attributes.map((attribute) => (
                <span
                  className="rounded-full border border-border bg-primary/5 px-3 py-1 text-primary/70"
                  key={attribute.id}
                >
                  {attribute.title}
                </span>
              ))}
              {useCases.map((useCase) => (
                <span
                  className="rounded-full border border-border bg-accent px-3 py-1 text-primary/70"
                  key={useCase.id}
                >
                  {useCase.title}
                </span>
              ))}
            </div>
          )}

        </div>

        <div className="flex flex-col gap-3 lg:items-end lg:text-right">
          {purchaseState.shouldShowPrice ? (
            <div className="font-mono text-lg uppercase tracking-[0.08em]">
              {hasVariants ? (
                <Price highestAmount={highestAmount} lowestAmount={lowestAmount} />
              ) : (
                <Price amount={amount} />
              )}
            </div>
          ) : null}

          {purchaseState.statusLabel ? (
            <div className="inline-flex rounded-md border border-border bg-accent px-3 py-2 text-sm font-medium text-primary/80 lg:self-end">
              {purchaseState.statusLabel}
            </div>
          ) : null}
        </div>
      </div>
      {product.description ? (
        <RichText className="max-w-none" data={product.description} enableGutter={false} />
      ) : null}
      {product.productNote ? (
        <div className="rounded-lg border border-border bg-accent p-4 text-sm leading-6 text-primary/80">
          {product.productNote}
        </div>
      ) : null}
      <hr className="border-border/70" />
      {hasVariants && (
        <>
          <Suspense fallback={<ProductOptionGroupSkeleton />}>
            <VariantSelector product={product} />
          </Suspense>

          <hr className="border-border/70" />
        </>
      )}
      {purchaseState.shouldShowStock ? (
        <div className="flex items-center justify-between">
          <Suspense fallback={product.enableVariants ? null : <ProductInlineStatusSkeleton />}>
            <StockIndicator product={product} />
          </Suspense>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        {purchaseState.canDirectPurchase ? (
          <Suspense fallback={<ProductActionSkeleton />}>
            <AddToCart product={product} />
          </Suspense>
        ) : null}

        {purchaseState.canRequestQuote ? (
          <Button asChild variant={purchaseState.canDirectPurchase ? 'outline' : 'default'}>
            <Link href={`/kontak?product=${product.slug}`}>Request Quotation</Link>
          </Button>
        ) : null}
      </div>

      {purchaseState.isOutOfStock ? (
        <p className="text-sm text-primary/60">
          Tanyakan ketersediaan stok berikutnya melalui halaman kontak.
        </p>
      ) : null}

      {purchaseState.needsConsultation ? (
        <p className="text-sm text-primary/60">
          Produk ini memerlukan konfirmasi ketersediaan dan penawaran terlebih dahulu.
        </p>
      ) : null}
    </div>
  )
}
