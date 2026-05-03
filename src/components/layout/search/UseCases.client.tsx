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
      onClick={() => setQuery()}
      className={clsx('hover:cursor-pointer', {
        ' underline': isActive,
      })}
    >
      {useCase.title}
    </button>
  )
}
