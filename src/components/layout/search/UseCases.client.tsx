'use client'
import React, { useCallback, useMemo } from 'react'

import { ProductUseCase } from '@/payload-types'
import clsx from 'clsx'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

type Props = {
  useCase: ProductUseCase
}

export const UseCaseItem: React.FC<Props> = ({ useCase }) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const isActive = useMemo(() => {
    return searchParams.get('usecase') === String(useCase.id)
  }, [searchParams, useCase.id])

  const setQuery = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString())

    if (isActive) {
      params.delete('usecase')
    } else {
      params.set('usecase', String(useCase.id))
    }

    router.push(pathname + '?' + params.toString())
  }, [isActive, pathname, router, searchParams, useCase.id])

  return (
    <button
      aria-pressed={isActive}
      onClick={() => setQuery()}
      className={clsx('shop-filter-option', {
        'shop-filter-option--active': isActive,
      })}
    >
      <span>{useCase.title}</span>
      <span className="shop-filter-option__indicator">{isActive ? 'Aktif' : 'Pilih'}</span>
    </button>
  )
}
