'use client'

import type { SortFilterItem as SortFilterItemType } from '@/lib/constants'

import { createUrl } from '@/utilities/createUrl'
import clsx from 'clsx'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import React from 'react'

import type { ListItem } from '.'
import type { PathFilterItem as PathFilterItemType } from '.'

function PathFilterItem({ item }: { item: PathFilterItemType }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const active = pathname === item.path
  const newParams = new URLSearchParams(searchParams.toString())
  const DynamicTag = active ? 'p' : Link

  newParams.delete('q')

  return (
    <li className="flex" key={item.title}>
      <DynamicTag
        className={clsx(
          'shop-filter-option',
          {
            'shop-filter-option--active': active,
          },
        )}
        href={createUrl(item.path, newParams)}
      >
        <span>{item.title}</span>
        <span className="shop-filter-option__indicator">{active ? 'Aktif' : 'Pilih'}</span>
      </DynamicTag>
    </li>
  )
}

function SortFilterItem({ item }: { item: SortFilterItemType }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const active = searchParams.get('sort') === item.slug
  const params = new URLSearchParams(searchParams.toString())

  if (item.slug && item.slug.length) {
    params.set('sort', item.slug)
  } else {
    params.delete('sort')
  }

  const href = createUrl(pathname, params)
  const DynamicTag = active ? 'p' : Link

  return (
    <li className="flex text-sm" key={item.title}>
      <DynamicTag
        className={clsx('shop-filter-option', {
          'shop-filter-option--active': active,
        })}
        href={href}
        prefetch={!active ? false : undefined}
      >
        <span>{item.title}</span>
        <span className="shop-filter-option__indicator">{active ? 'Aktif' : 'Pilih'}</span>
      </DynamicTag>
    </li>
  )
}

export function FilterItem({ item }: { item: ListItem }) {
  return 'path' in item ? <PathFilterItem item={item} /> : <SortFilterItem item={item} />
}
