import React from 'react'

import type { Post } from '@/payload-types'

import { ArticleCard } from '@/components/ArticleCard'
import { cn } from '@/utilities/cn'

type Props = {
  posts: Post[]
}

export const ArticleArchive: React.FC<Props> = ({ posts }) => {
  if (!posts?.length) {
    return (
      <div className="container">
        <div className="rounded-2xl border border-border bg-card px-6 py-10 text-sm text-muted-foreground">
          Belum ada artikel yang tersedia.
        </div>
      </div>
    )
  }

  return (
    <div className={cn('container')}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {posts.map((post) => (
          <ArticleCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}
