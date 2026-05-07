import type { SortFilterItem } from '@/lib/constants'

import React, { Suspense } from 'react'

import { FilterItemDropdown } from './FilterItemDropdown'
import { FilterItem } from './FilterItem'
export type ListItem = PathFilterItem | SortFilterItem
export type PathFilterItem = { path: string; title: string }

function FilterItemList({ list }: { list: ListItem[] }) {
  return (
    <React.Fragment>
      {list.map((item: ListItem, i) => (
        <FilterItem item={item} key={i} />
      ))}
    </React.Fragment>
  )
}

export function FilterList({ list, title }: { list: ListItem[]; title?: string }) {
  return (
    <section className="shop-filter-group">
      <nav>
        {title ? (
          <h3 className="shop-filter-group__title">{title}</h3>
        ) : null}
        <ul className="shop-filter-group__list hidden md:flex">
          <Suspense fallback={null}>
            <FilterItemList list={list} />
          </Suspense>
        </ul>
        <div className="md:hidden">
          <Suspense fallback={null}>
            <FilterItemDropdown list={list} />
          </Suspense>
        </div>
      </nav>
    </section>
  )
}
