import React from 'react'

import type { ProofGalleryBlock as ProofGalleryBlockProps } from '@/payload-types'

import { Media } from '@/components/Media'
import { SectionHeader } from '@/components/SectionHeader'

export const ProofGalleryBlock: React.FC<ProofGalleryBlockProps> = ({ intro, items, title }) => {
  return (
    <section className="container">
      <div className="space-y-8">
        <SectionHeader intro={intro} title={title} />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items?.map((item, index) => {
            const hasImage = item.image && typeof item.image === 'object'

            return (
              <figure className="overflow-hidden rounded-xl border border-border bg-card" key={index}>
                {hasImage ? (
                  <div className="relative aspect-[4/3]">
                    <Media
                      fill
                      htmlElement={null}
                      imgClassName="object-cover"
                      resource={item.image}
                      size="33vw"
                    />
                  </div>
                ) : null}

                {item.caption ? (
                  <figcaption className="border-t border-border px-4 py-3 text-sm text-muted-foreground">
                    {item.caption}
                  </figcaption>
                ) : null}
              </figure>
            )
          })}
        </div>
      </div>
    </section>
  )
}
