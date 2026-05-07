import * as React from 'react'

import { cn } from '@/utilities/cn'

type SkeletonProps = React.ComponentProps<'div'>

function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn('animate-pulse rounded-md bg-neutral-200/85 dark:bg-neutral-800/85', className)}
      data-skeleton="true"
      {...props}
    />
  )
}

export { Skeleton }
