import Link from 'next/link'
import React from 'react'

import type { Post } from '@/payload-types'

import { Media } from '@/components/Media'
import { cn } from '@/utilities/cn'

type Props = {
  className?: string
  post: Post
}

export const ArticleCard: React.FC<Props> = ({ className, post }) => {
  const heroImage = post.heroImage && typeof post.heroImage === 'object' ? post.heroImage : null
  const description = post.meta?.description?.replace(/\s/g, ' ')
  const href = `/artikel/${post.slug}`
  const categories = (post.categories || []).filter(
    (category): category is Exclude<typeof category, string | number> => typeof category === 'object',
  )

  return (
    <article
      className={cn(
        'overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-colors hover:border-primary/40',
        className,
      )}
    >
      {heroImage && (
        <div className="overflow-hidden border-b border-border bg-muted/30">
          <Media
            resource={heroImage}
            imgClassName="aspect-[4/3] h-auto w-full object-cover"
            size="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          />
        </div>
      )}

      <div className="space-y-4 p-6">
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            {categories.map((category) => (
              <span key={category.id}>{category.title}</span>
            ))}
          </div>
        )}

        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight">
            <Link className="hover:text-primary" href={href}>
              {post.title}
            </Link>
          </h3>

          {post.publishedAt && (
            <time className="block text-sm text-muted-foreground" dateTime={post.publishedAt}>
              {new Intl.DateTimeFormat('id-ID', {
                dateStyle: 'long',
              }).format(new Date(post.publishedAt))}
            </time>
          )}

          {description && <p className="text-sm leading-6 text-muted-foreground">{description}</p>}
        </div>

        <Link className="inline-flex text-sm font-medium text-primary hover:underline" href={href}>
          Baca artikel
        </Link>
      </div>
    </article>
  )
}
