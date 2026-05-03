import type {
  ArticleArchiveBlock as ArticleArchiveBlockProps,
  Post,
  PostCategory,
} from '@/payload-types'

import configPromise from '@payload-config'
import { getPayload, type DefaultDocumentIDType } from 'payload'
import { draftMode } from 'next/headers'
import React from 'react'

import { ArticleArchive } from '@/components/ArticleArchive'
import { RichText } from '@/components/RichText'

const isPost = (value: Post | string | number | null | undefined): value is Post => {
  return typeof value === 'object' && value !== null
}

const resolveCategoryIDs = (
  categories: (PostCategory | string | number)[] | null | undefined,
): DefaultDocumentIDType[] => {
  return (categories || [])
    .map((category) => (typeof category === 'object' ? category.id : category))
    .filter(
      (category): category is DefaultDocumentIDType =>
        category !== null && typeof category !== 'undefined',
    )
}

export const ArticleArchiveBlock: React.FC<
  ArticleArchiveBlockProps & {
    id?: DefaultDocumentIDType
    className?: string
  }
> = async (props) => {
  const { id, categories, introContent, limit: limitFromProps, populateBy, selectedDocs } = props

  const payload = await getPayload({ config: configPromise })
  const { isEnabled: draft } = await draftMode()
  const limit = limitFromProps || 12

  let posts: Post[] = []

  if (populateBy === 'collection') {
    const categoryIDs = resolveCategoryIDs(categories)
    const fetchedPosts = await payload.find({
      collection: 'posts',
      depth: 1,
      draft,
      limit,
      overrideAccess: draft,
      pagination: false,
      sort: '-publishedAt',
      where: {
        and: [
          ...(categoryIDs.length > 0
            ? [
                {
                  categories: {
                    in: categoryIDs,
                  },
                },
              ]
            : []),
          ...(draft ? [] : [{ _status: { equals: 'published' as const } }]),
        ],
      },
    })

    posts = fetchedPosts.docs
  } else if (selectedDocs?.length) {
    const selectedIDs: DefaultDocumentIDType[] = selectedDocs
      .map((post) => (typeof post === 'object' ? post.id : post))
      .filter(
        (post): post is DefaultDocumentIDType => post !== null && typeof post !== 'undefined',
      )

    const selectedObjects = selectedDocs.filter(isPost)

    if (selectedObjects.length === selectedDocs.length) {
      posts = selectedObjects
    } else if (selectedIDs.length > 0) {
      const fetchedPosts = await payload.find({
        collection: 'posts',
        depth: 1,
        draft,
        limit: selectedIDs.length,
        overrideAccess: draft,
        pagination: false,
        where: {
          and: [
            {
              id: {
                in: selectedIDs,
              },
            },
            ...(draft ? [] : [{ _status: { equals: 'published' as const } }]),
          ],
        },
      })

      const postsByID = new Map(fetchedPosts.docs.map((post) => [String(post.id), post]))
      posts = selectedIDs
        .map((postID) => postsByID.get(String(postID)))
        .filter((post): post is Post => Boolean(post))
    }
  }

  return (
    <div className="my-16" id={`block-${id}`}>
      {introContent && (
        <div className="container mb-16">
          <RichText className="ml-0 max-w-3xl" data={introContent} enableGutter={false} />
        </div>
      )}
      <ArticleArchive posts={posts} />
    </div>
  )
}
