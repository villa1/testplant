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
      onClick={() => setQuery()}
      className={clsx('hover:cursor-pointer', {
        ' underline': isActive,
      })}
    >
      {attribute.title}
    </button>
  )
}
