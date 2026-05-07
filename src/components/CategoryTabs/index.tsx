import React, { Suspense } from 'react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { Skeleton } from '@/components/ui/skeleton'
import { Item } from './Item'

async function List() {
  const payload = await getPayload({ config: configPromise })
  const categoriesData = await payload.find({
    collection: 'categories',
    sort: 'title',
    select: {
      title: true,
      slug: true,
    },
  })

  const categories = categoriesData.docs?.map((category) => {
    return {
      href: `/shop/${category.slug}`,
      title: category.title,
    }
  })

  return (
    <React.Fragment>
      <nav>
        <ul className="flex gap-3">
          <Item title="All" href="/shop" />
          {categories.map((category) => {
            return <Item {...category} key={category.href} />
          })}
        </ul>
      </nav>
    </React.Fragment>
  )
}

export function CategoryTabs() {
  return (
    <Suspense
      fallback={
        <div className="hidden py-4 lg:block">
          <div className="flex flex-wrap gap-3">
            <Skeleton className="h-9 w-16 rounded-full" />
            <Skeleton className="h-9 w-28 rounded-full" />
            <Skeleton className="h-9 w-24 rounded-full" />
            <Skeleton className="h-9 w-20 rounded-full" />
          </div>
        </div>
      }
    >
      <List />
    </Suspense>
  )
}
