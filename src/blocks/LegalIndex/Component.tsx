import type { LegalIndexBlock as LegalIndexBlockProps, Page } from '@/payload-types'

import configPromise from '@payload-config'
import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'

import { Media } from '@/components/Media'

type LegalPageSummary = Pick<Page, 'slug' | 'title' | 'meta'>

export const LegalIndexBlock: React.FC<
  LegalIndexBlockProps & {
    id?: string
  }
> = async (props) => {
  const { id, emptyMessage, title } = props

  const payload = await getPayload({ config: configPromise })

  const legalPages = await payload.find({
    collection: 'pages',
    depth: 1,
    limit: 100,
    pagination: false,
    sort: 'title',
    where: {
      and: [
        {
          pageType: {
            equals: 'legal',
          },
        },
        {
          slug: {
            not_equals: 'legal',
          },
        },
      ],
    },
  })

  const docs = legalPages.docs as LegalPageSummary[]

  return (
    <div className="container" id={`block-${id}`}>
      {title ? <h2 className="mb-8">{title}</h2> : null}

      {docs.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-5">
          <p>{emptyMessage}</p>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-x-4 gap-y-4 sm:grid-cols-8 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-8 xl:gap-x-8">
          {docs.map((page, index) => {
            const { description, image: metaImage } = page.meta || {}
            const href = `/${page.slug}`
            const sanitizedDescription = description?.replace(/\s/g, ' ')

            return (
              <div className="col-span-4" key={page.slug || index}>
                <article className="h-full overflow-hidden rounded-lg border border-border bg-card">
                  <div className="relative w-full">
                    {!metaImage && <div className="p-4 text-sm text-muted-foreground">No image</div>}
                    {metaImage && typeof metaImage !== 'string' && <Media resource={metaImage} size="33vw" />}
                  </div>
                  <div className="p-4">
                    {page.title ? (
                      <div className="prose">
                        <h3>
                          <Link className="not-prose" href={href}>
                            {page.title}
                          </Link>
                        </h3>
                      </div>
                    ) : null}
                    {sanitizedDescription ? (
                      <div className="mt-2">
                        <p>{sanitizedDescription}</p>
                      </div>
                    ) : null}
                  </div>
                </article>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
