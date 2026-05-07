import { Grid } from '@/components/Grid'
import { ProductGridItem } from '@/components/ProductGridItem'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'
import React from 'react'

export const metadata = {
  description: 'Jelajahi tanaman proyek, semak, ground cover, rambat, dan palem dari PT Bumi Mekarsari Jaya.',
  title: 'Shop',
}

type SearchParams = { [key: string]: string | string[] | undefined }

type Props = {
  searchParams: Promise<SearchParams>
}

export default async function ShopPage({ searchParams }: Props) {
  const { q: searchValue, sort, category, attribute, usecase } = await searchParams
  const payload = await getPayload({ config: configPromise })

  const products = await payload.find({
    collection: 'products',
    draft: false,
    overrideAccess: false,
    select: {
      title: true,
      slug: true,
      gallery: true,
      categories: true,
      attributes: true,
      useCases: true,
      meta: true,
      priceInUSD: true,
      availabilityStatus: true,
      orderType: true,
    },
    populate: {
      categories: {
        title: true,
      },
      productAttributes: {
        title: true,
      },
      productUseCases: {
        title: true,
      },
    },
    ...(sort ? { sort } : { sort: 'title' }),
    ...(searchValue || category || attribute || usecase
      ? {
          where: {
            and: [
              {
                _status: {
                  equals: 'published',
                },
              },
              ...(searchValue
                ? [
                    {
                      or: [
                        {
                          title: {
                            like: searchValue,
                          },
                        },
                        {
                          description: {
                            like: searchValue,
                          },
                        },
                      ],
                    },
                  ]
                : []),
              ...(category
                ? [
                    {
                      categories: {
                        contains: category,
                      },
                    },
                  ]
                : []),
              ...(attribute
                ? [
                    {
                      attributes: {
                        contains: attribute,
                      },
                    },
                  ]
                : []),
              ...(usecase
                ? [
                    {
                      useCases: {
                        contains: usecase,
                      },
                    },
                  ]
                : []),
            ],
          },
        }
      : {}),
  })

  const activeFilterCount = [searchValue, category, attribute, usecase, sort].filter(Boolean).length
  const hasFilters = activeFilterCount > 0
  const totalProducts = products.docs.length

  return (
    <div>
      <section className="catalog-summary">
        <div className="space-y-2">
          <p className="catalog-summary__eyebrow">Katalog BMJ</p>
          <h2 className="catalog-summary__title">
            {totalProducts > 0 ? `${totalProducts} produk siap dijelajahi` : 'Belum ada produk yang cocok'}
          </h2>
          <p className="catalog-summary__meta">
            {searchValue
              ? `Hasil pencarian untuk "${searchValue}" dengan kombinasi filter yang sedang aktif.`
              : hasFilters
                ? 'Katalog sudah difilter sesuai kategori, atribut, atau use case yang Anda pilih.'
                : 'Mulai dari koleksi utama BMJ lalu persempit pilihan dengan filter di sisi kiri.'}
          </p>
        </div>

        <div className="catalog-summary__actions">
          {searchValue ? <span className="catalog-summary__chip">Pencarian aktif</span> : null}
          {category ? <span className="catalog-summary__chip">Kategori dipilih</span> : null}
          {attribute ? <span className="catalog-summary__chip">Atribut dipilih</span> : null}
          {usecase ? <span className="catalog-summary__chip">Use case dipilih</span> : null}
          {sort ? <span className="catalog-summary__chip">Urutan khusus</span> : null}
          {hasFilters ? (
            <Link className="catalog-summary__link" href="/shop">
              Reset filter
            </Link>
          ) : null}
        </div>
      </section>

      {!searchValue && totalProducts === 0 ? (
        <p className="mb-4 text-sm text-primary/70">Tidak ada produk yang ditemukan. Coba filter yang berbeda.</p>
      ) : null}

      {products?.docs.length > 0 ? (
        <Grid className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {products.docs.map((product) => {
            return <ProductGridItem key={product.id} product={product} />
          })}
        </Grid>
      ) : null}
    </div>
  )
}
