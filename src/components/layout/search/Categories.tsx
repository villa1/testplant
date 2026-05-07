import React, { Suspense } from 'react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { FilterGroupSkeleton } from './FilterGroupSkeleton'
import { CategoryItem } from './Categories.client'

async function CategoryList() {
  const payload = await getPayload({ config: configPromise })

  const categories = await payload.find({
    collection: 'categories',
    sort: 'title',
  })

  return (
    <section className="shop-filter-group">
      <h3 className="shop-filter-group__title">Kategori</h3>

      <ul className="shop-filter-group__list">
        {categories.docs.map((category) => {
          return (
            <li key={category.id}>
              <CategoryItem category={category} />
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export function Categories() {
  return (
    <Suspense fallback={<FilterGroupSkeleton itemCount={8} />}>
      <CategoryList />
    </Suspense>
  )
}
