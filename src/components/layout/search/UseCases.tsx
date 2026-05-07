import React, { Suspense } from 'react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { FilterGroupSkeleton } from './FilterGroupSkeleton'
import { UseCaseItem } from './UseCases.client'

async function UseCaseList() {
  const payload = await getPayload({ config: configPromise })

  const useCases = await payload.find({
    collection: 'productUseCases',
    sort: 'title',
  })

  if (!useCases.docs.length) return null

  return (
    <section className="shop-filter-group">
      <h3 className="shop-filter-group__title">Use Case</h3>

      <ul className="shop-filter-group__list">
        {useCases.docs.map((useCase) => {
          return (
            <li key={useCase.id}>
              <UseCaseItem useCase={useCase} />
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export function UseCases() {
  return (
    <Suspense fallback={<FilterGroupSkeleton itemCount={4} />}>
      <UseCaseList />
    </Suspense>
  )
}
