import { Grid } from '@/components/Grid'
import { ProductGridItem } from '@/components/ProductGridItem'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
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

  const resultsText = products.docs.length > 1 ? 'results' : 'result'

  return (
    <div>
      {searchValue ? (
        <p className="mb-4 text-sm text-primary/70">
          {products.docs?.length === 0
            ? 'Tidak ada produk yang cocok untuk '
            : `Menampilkan ${products.docs.length} ${resultsText} untuk `}
          <span className="font-bold">&quot;{searchValue}&quot;</span>
        </p>
      ) : null}

      {!searchValue && products.docs?.length === 0 && (
        <p className="mb-4 text-sm text-primary/70">
          Tidak ada produk yang ditemukan. Coba filter yang berbeda.
        </p>
      )}

      {products?.docs.length > 0 ? (
        <Grid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.docs.map((product) => {
            return <ProductGridItem key={product.id} product={product} />
          })}
        </Grid>
      ) : null}
    </div>
  )
}
