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
      <div className="rounded-2xl border border-border bg-card px-6 py-10 text-sm text-muted-foreground">
        Belum ada artikel yang tersedia.
      </div>
    )
  }

  const hasSingleOrphanAtDesktop = posts.length % 3 === 1

  return (
    <div className={cn('w-full')}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {posts.map((post, index) => {
          const isDesktopOrphan = hasSingleOrphanAtDesktop && index === posts.length - 1

          return (
            <div
              className={cn({
                'xl:col-span-3 xl:flex xl:justify-center': isDesktopOrphan,
              })}
              key={post.id}
            >
              <ArticleCard
                className={cn({
                  'xl:w-full xl:max-w-[26rem]': isDesktopOrphan,
                })}
                post={post}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
