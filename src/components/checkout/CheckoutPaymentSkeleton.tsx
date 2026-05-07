import React from 'react'

import { Skeleton } from '@/components/ui/skeleton'

export const CheckoutPaymentSkeleton: React.FC = () => {
  return (
    <div className="pb-16">
      <Skeleton className="mb-6 h-10 w-40" />

      <div className="space-y-6 rounded-2xl border border-border bg-card p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-11 w-full rounded-md" />
          <Skeleton className="h-11 w-full rounded-md" />
        </div>

        <Skeleton className="h-11 w-full rounded-md" />

        <div className="grid gap-4 md:grid-cols-[1.4fr_0.8fr]">
          <Skeleton className="h-11 w-full rounded-md" />
          <Skeleton className="h-11 w-full rounded-md" />
        </div>

        <Skeleton className="h-12 w-44 rounded-md" />
      </div>
    </div>
  )
}
