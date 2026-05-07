import React from 'react'

import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/utilities/cn'

type ProductGallerySkeletonProps = {
  className?: string
  thumbnailCount?: number
}

export const ProductGallerySkeleton: React.FC<ProductGallerySkeletonProps> = ({
  className,
  thumbnailCount = 5,
}) => {
  return (
    <div className={cn('w-full', className)}>
      <Skeleton className="mb-8 aspect-square w-full rounded-lg" />

      <div className="flex gap-4">
        {Array.from({ length: thumbnailCount }).map((_, index) => (
          <Skeleton className="aspect-square w-full basis-1/5 rounded-lg" key={index} />
        ))}
      </div>
    </div>
  )
}

export const ProductOptionGroupSkeleton: React.FC = () => {
  return (
    <div className="space-y-4">
      <Skeleton className="h-4 w-24" />

      <div className="flex flex-wrap gap-3">
        <Skeleton className="h-9 w-20 rounded-md" />
        <Skeleton className="h-9 w-24 rounded-md" />
        <Skeleton className="h-9 w-[4.5rem] rounded-md" />
      </div>
    </div>
  )
}

export const ProductInlineStatusSkeleton: React.FC = () => {
  return <Skeleton className="h-4 w-28 rounded-sm" />
}

export const ProductActionSkeleton: React.FC<{ className?: string }> = ({ className }) => {
  return <Skeleton className={cn('h-10 w-36 rounded-md', className)} />
}
