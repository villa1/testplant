import { Grid } from '@/components/Grid'
import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

export default function Loading() {
  return (
    <Grid className="grid-cols-2 lg:grid-cols-6">
      {Array(12)
        .fill(0)
        .map((_, index) => {
          return <Skeleton className="aspect-[4/5] rounded-[1.25rem] lg:col-span-2" key={index} />
        })}
    </Grid>
  )
}
