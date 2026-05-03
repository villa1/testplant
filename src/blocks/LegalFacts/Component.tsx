import React from 'react'

import type { LegalFactsBlock as LegalFactsBlockProps } from '@/payload-types'

import { SectionHeader } from '@/components/SectionHeader'

export const LegalFactsBlock: React.FC<LegalFactsBlockProps> = ({ intro, items, title }) => {
  return (
    <section className="container">
      <div className="space-y-8">
        <SectionHeader intro={intro} title={title} />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items?.map((item, index) => (
            <article className="rounded-xl border border-border bg-card p-6" key={index}>
              <div className="text-sm font-medium text-muted-foreground">{item.label}</div>
              <div className="mt-3 text-base font-semibold leading-7">{item.value}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
