import React, { Suspense } from 'react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { FilterGroupSkeleton } from './FilterGroupSkeleton'
import { AttributeItem } from './Attributes.client'

async function AttributeList() {
  const payload = await getPayload({ config: configPromise })

  const attributes = await payload.find({
    collection: 'productAttributes',
    sort: 'title',
  })

  if (!attributes.docs.length) return null

  return (
    <section className="shop-filter-group">
      <h3 className="shop-filter-group__title">Atribut</h3>

      <ul className="shop-filter-group__list">
        {attributes.docs.map((attribute) => {
          return (
            <li key={attribute.id}>
              <AttributeItem attribute={attribute} />
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export function Attributes() {
  return (
    <Suspense fallback={<FilterGroupSkeleton itemCount={4} />}>
      <AttributeList />
    </Suspense>
  )
}
