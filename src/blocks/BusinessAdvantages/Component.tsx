import React from 'react'

import type { BusinessAdvantagesBlock as BusinessAdvantagesBlockProps } from '@/payload-types'

import { SectionHeader } from '@/components/SectionHeader'

export const BusinessAdvantagesBlock: React.FC<BusinessAdvantagesBlockProps> = ({
  intro,
  items,
  title,
}) => {
  return (
    <section className="container">
      <div className="space-y-8">
        <SectionHeader intro={intro} title={title} />

        <div className="grid gap-6 md:grid-cols-3">
          {items?.map((item, index) => (
            <article className="rounded-xl border border-border bg-card p-6" key={index}>
              <div className="text-sm font-medium text-muted-foreground">Keunggulan {index + 1}</div>
              <h3 className="mt-3 text-xl font-semibold tracking-tight">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
