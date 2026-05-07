import type { LegalIndexBlock as LegalIndexBlockProps, Page } from '@/payload-types'

import configPromise from '@payload-config'
import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'

import { SectionHeader } from '@/components/SectionHeader'
import { SectionShell } from '@/components/layout/SectionShell'
import { Surface } from '@/components/layout/Surface'
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
    <SectionShell id={id ? `block-${id}` : undefined} spacing="compact" variant="plain">
      {title ? <SectionHeader className="mb-8" title={title} /> : null}

      {docs.length === 0 ? (
        <Surface>
          <p>{emptyMessage}</p>
        </Surface>
      ) : (
        <div className="grid grid-cols-4 gap-x-4 gap-y-4 sm:grid-cols-8 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-8 xl:gap-x-8">
          {docs.map((page, index) => {
            const { description, image: metaImage } = page.meta || {}
            const href = `/${page.slug}`
            const sanitizedDescription = description?.replace(/\s/g, ' ')

            return (
              <div className="col-span-4" key={page.slug || index}>
                <Surface as="article" className="h-full overflow-hidden p-0">
                  <div className="relative w-full">
                    {!metaImage && <div className="p-4 text-sm text-muted-foreground">No image</div>}
                    {metaImage && typeof metaImage !== 'string' && <Media resource={metaImage} size="33vw" />}
                  </div>
                  <div className="p-4">
                    {page.title ? (
                      <h3 className="type-card-title">
                        <Link href={href}>{page.title}</Link>
                      </h3>
                    ) : null}
                    {sanitizedDescription ? (
                      <div className="mt-2">
                        <p>{sanitizedDescription}</p>
                      </div>
                    ) : null}
                  </div>
                </Surface>
              </div>
            )
          })}
        </div>
      )}
    </SectionShell>
  )
}
