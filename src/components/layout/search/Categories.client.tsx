'use client'
import React, { useCallback, useMemo } from 'react'

import { Category } from '@/payload-types'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import clsx from 'clsx'

type Props = {
  category: Category
}

export const CategoryItem: React.FC<Props> = ({ category }) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const isActive = useMemo(() => {
    return searchParams.get('category') === String(category.id)
  }, [category.id, searchParams])

  const setQuery = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString())

    if (isActive) {
      params.delete('category')
    } else {
      params.set('category', String(category.id))
    }

    const newParams = params.toString()

    router.push(pathname + '?' + newParams)
  }, [category.id, isActive, pathname, router, searchParams])

  return (
    <button
      aria-pressed={isActive}
      onClick={() => setQuery()}
      className={clsx('shop-filter-option', {
        'shop-filter-option--active': isActive,
      })}
    >
      <span>{category.title}</span>
      <span className="shop-filter-option__indicator">{isActive ? 'Aktif' : 'Pilih'}</span>
    </button>
  )
}
