import React from 'react'

import type { SupplyCategoriesBlock as SupplyCategoriesBlockProps } from '@/payload-types'

import { Media } from '@/components/Media'
import { SectionHeader } from '@/components/SectionHeader'

export const SupplyCategoriesBlock: React.FC<SupplyCategoriesBlockProps> = ({
  categories,
  intro,
  title,
}) => {
  return (
    <section className="container">
      <div className="space-y-8">
        <SectionHeader intro={intro} title={title} />

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {categories?.map((category, index) => {
            const image =
              category.image && typeof category.image === 'object' ? category.image : undefined

            return (
              <article className="overflow-hidden rounded-xl border border-border bg-card" key={index}>
                {image ? (
                  <div className="relative aspect-[4/3]">
                    <Media fill htmlElement={null} imgClassName="object-cover" resource={image} size="33vw" />
                  </div>
                ) : null}

                <div className="space-y-3 p-6">
                  <div className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    {category.supplyType === 'consultation' ? 'Konsultasi Dulu' : 'Siap Supply'}
                  </div>
                  <h3 className="text-xl font-semibold tracking-tight">{category.title}</h3>
                  <p className="text-sm leading-7 text-muted-foreground">{category.description}</p>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
