'use client'
import React, { useCallback, useMemo } from 'react'

import { ProductAttribute } from '@/payload-types'
import clsx from 'clsx'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

type Props = {
  attribute: ProductAttribute
}

export const AttributeItem: React.FC<Props> = ({ attribute }) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const isActive = useMemo(() => {
    return searchParams.get('attribute') === String(attribute.id)
  }, [attribute.id, searchParams])

  const setQuery = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString())

    if (isActive) {
      params.delete('attribute')
    } else {
      params.set('attribute', String(attribute.id))
    }

    router.push(pathname + '?' + params.toString())
  }, [attribute.id, isActive, pathname, router, searchParams])

  return (
    <button
      aria-pressed={isActive}
      onClick={() => setQuery()}
      className={clsx('shop-filter-option', {
        'shop-filter-option--active': isActive,
      })}
    >
      <span>{attribute.title}</span>
      <span className="shop-filter-option__indicator">{isActive ? 'Aktif' : 'Pilih'}</span>
    </button>
  )
}
