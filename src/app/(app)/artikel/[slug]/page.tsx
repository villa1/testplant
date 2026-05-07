import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React, { cache } from 'react'

import { Media } from '@/components/Media'
import { RichText } from '@/components/RichText'
import { PageFrame } from '@/components/layout/PageFrame'
import { SectionShell } from '@/components/layout/SectionShell'
import { Surface } from '@/components/layout/Surface'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { siteMetadata } from '@/utilities/siteMetadata'
import { extractLexicalPlainText } from '@/utilities/extractLexicalPlainText'

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
  const normalizedContent = stripDuplicateLeadingHeading(post.content, post.title)
  const articleLead = getArticleLead(post, normalizedContent)

  return (
    <PageFrame as="article" className="article-detail-page" family="editorial">
      <SectionShell containment="wide" spacing="compact" variant="plain">
        <div className="space-y-8 md:space-y-10">
          <div className="mx-auto max-w-3xl space-y-6">
            <Link
              className="inline-flex text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              href="/artikel"
            >
              Kembali ke Artikel
            </Link>
            <div className="space-y-4">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-primary/50">
                Artikel BMJ
              </p>
              <h1 className="text-4xl font-semibold tracking-tight text-balance md:text-5xl lg:text-[3.5rem]">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
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
              {articleLead ? (
                <p className="article-detail__lead max-w-2xl text-lg leading-8 md:text-xl">
                  {articleLead}
                </p>
              ) : null}
            </div>
          </div>

          {heroImage ? (
            <Surface
              className="article-detail__hero mx-auto max-w-5xl overflow-hidden p-0"
              variant="elevated"
            >
              <Media
                resource={heroImage}
                imgClassName="article-detail__hero-image h-auto w-full object-cover"
                htmlElement={null}
              />
            </Surface>
          ) : null}
        </div>
      </SectionShell>

      <SectionShell containment="reading" spacing="compact" variant="plain">
        <div>
          <Surface
            className="article-detail__body px-5 py-6 md:px-8 md:py-8 lg:px-10 lg:py-10"
            variant="flat"
          >
            <RichText
              className="article-detail__prose max-w-none"
              data={normalizedContent}
              enableGutter={false}
            />
          </Surface>
        </div>
      </SectionShell>
    </PageFrame>
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

const getArticleLead = (post: Post, content: Post['content']) => {
  const metaDescription = post.meta?.description?.trim()

  if (metaDescription) {
    return metaDescription
  }

  const plainText = extractLexicalPlainText(content).trim()

  if (!plainText || plainText.toLocaleLowerCase('id-ID') === post.title.trim().toLocaleLowerCase('id-ID')) {
    return null
  }

  return plainText.length > 220 ? `${plainText.slice(0, 217).trimEnd()}...` : plainText
}

const stripDuplicateLeadingHeading = (content: Post['content'], title: string): Post['content'] => {
  if (!content || typeof content !== 'object') {
    return content
  }

  const root = (content as { root?: { children?: unknown[] } }).root

  if (!root || !Array.isArray(root.children) || root.children.length === 0) {
    return content
  }

  const [firstChild, ...remainingChildren] = root.children

  if (!isDuplicateHeadingNode(firstChild, title)) {
    return content
  }

  return {
    ...(content as Record<string, unknown>),
    root: {
      ...root,
      children: remainingChildren,
    },
  } as Post['content']
}

const isDuplicateHeadingNode = (node: unknown, title: string) => {
  if (!node || typeof node !== 'object') {
    return false
  }

  const headingNode = node as {
    children?: unknown[]
    type?: string
  }

  if (headingNode.type !== 'heading' || !Array.isArray(headingNode.children)) {
    return false
  }

  const headingText = extractLexicalPlainText({ children: headingNode.children })
    .trim()
    .toLocaleLowerCase('id-ID')
  const normalizedTitle = title.trim().toLocaleLowerCase('id-ID')

  return Boolean(headingText) && headingText === normalizedTitle
}
