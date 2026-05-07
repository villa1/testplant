import React from 'react'

import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/utilities/cn'

type FilterGroupSkeletonProps = {
  className?: string
  itemCount?: number
}

export function FilterGroupSkeleton({
  className,
  itemCount = 6,
}: FilterGroupSkeletonProps) {
  return (
    <div className={cn('shop-filter-group', className)}>
      <Skeleton className="mb-4 h-3 w-2/5 rounded-full bg-[#8ba67d]/20" />

      <div className="shop-filter-group__list">
        {Array.from({ length: itemCount }).map((_, index) => (
          <Skeleton className="h-11 w-full rounded-2xl bg-[#8ba67d]/12" key={index} />
        ))}
      </div>
    </div>
  )
}
