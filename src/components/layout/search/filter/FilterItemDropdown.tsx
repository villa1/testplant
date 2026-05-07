'use client'

import { ChevronDownIcon } from 'lucide-react'
import { usePathname, useSearchParams } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'

import type { ListItem } from '.'

import { FilterItem } from './FilterItem'

export function FilterItemDropdown({ list }: { list: ListItem[] }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [active, setActive] = useState('')
  const [openSelect, setOpenSelect] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpenSelect(false)
      }
    }

    window.addEventListener('click', handleClickOutside)
    return () => window.removeEventListener('click', handleClickOutside)
  }, [])

  useEffect(() => {
    let matchedTitle = list[0]?.title ?? ''

    list.forEach((listItem: ListItem) => {
      if (
        ('path' in listItem && pathname === listItem.path) ||
        ('slug' in listItem && searchParams.get('sort') === listItem.slug)
      ) {
        matchedTitle = listItem.title
      }
    })

    setActive(matchedTitle)
  }, [pathname, list, searchParams])

  return (
    <div className="shop-filter-dropdown" ref={ref}>
      <button
        className="shop-filter-dropdown__trigger"
        onClick={() => {
          setOpenSelect(!openSelect)
        }}
        type="button"
      >
        <div>{active}</div>
        <ChevronDownIcon className="h-4" />
      </button>
      {openSelect && (
        <div
          className="shop-filter-dropdown__menu"
          onClick={() => {
            setOpenSelect(false)
          }}
        >
          <ul className="shop-filter-group__list">
            {list.map((item: ListItem, i) => (
              <FilterItem item={item} key={i} />
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
