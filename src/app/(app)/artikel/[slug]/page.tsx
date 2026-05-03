import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React, { cache } from 'react'

import { Media } from '@/components/Media'
import { RichText } from '@/components/RichText'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { siteMetadata } from '@/utilities/siteMetadata'

import type { Post } from '@/payload-types'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const posts = await payload.find({
    collection: 'posts',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  return posts.docs
    .filter((post) => Boolean(post.slug))
    .map(({ slug }) => ({
      slug,
    }))
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function ArticlePage({ params }: Args) {
  const { slug = '' } = await params
  const decodedSlug = decodeURIComponent(slug)
  const post = await queryPostBySlug({ slug: decodedSlug })

  if (!post) {
    return notFound()
  }

  const heroImage =
    post.heroImage && typeof post.heroImage === 'object' ? post.heroImage : undefined

  return (
    <article className="pt-16 pb-24">
      <div className="container max-w-4xl">
        <div className="space-y-4">
          <Link className="text-sm text-muted-foreground hover:text-foreground" href="/artikel">
            Kembali ke Artikel
          </Link>
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">{post.title}</h1>
            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              {post.publishedAt && (
                <time dateTime={post.publishedAt}>
                  {new Intl.DateTimeFormat('id-ID', {
                    dateStyle: 'long',
                  }).format(new Date(post.publishedAt))}
                </time>
              )}
              {post.populatedAuthors && post.populatedAuthors.length > 0 && (
                <span>
                  {post.populatedAuthors
                    .map((author) => author?.name)
                    .filter(Boolean)
                    .join(', ')}
                </span>
              )}
            </div>
          </div>
        </div>

        {heroImage && (
          <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card">
            <Media
              resource={heroImage}
              imgClassName="h-auto w-full object-cover"
              htmlElement={null}
            />
          </div>
        )}

        <div className="mt-10">
          <RichText className="mx-auto max-w-none" data={post.content} enableGutter={false} />
        </div>
      </div>
    </article>
  )
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug = '' } = await params
  const decodedSlug = decodeURIComponent(slug)
  const post = await queryPostBySlug({ slug: decodedSlug })

  if (!post) {
    return {
      description: siteMetadata.defaultDescription,
      title: siteMetadata.siteName,
    }
  }

  const ogImage =
    typeof post.meta?.image === 'object' && post.meta.image?.url
      ? `${process.env.NEXT_PUBLIC_SERVER_URL}${post.meta.image.url}`
      : undefined

  const title = post.meta?.title || post.title
  const description = post.meta?.description || siteMetadata.defaultDescription

  return {
    description,
    openGraph: mergeOpenGraph({
      description,
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
      title,
      url: `/artikel/${post.slug}`,
    }),
    title,
  }
}

const queryPostBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      and: [
        {
          slug: {
            equals: slug,
          },
        },
        ...(draft ? [] : [{ _status: { equals: 'published' } }]),
      ],
    },
  })

  return (result.docs?.[0] || null) as Post | null
})
