import React from 'react'
import { CheckCircle2 } from 'lucide-react'

import type { TrustSignalsBlock as TrustSignalsBlockProps } from '@/payload-types'

import { SectionHeader } from '@/components/SectionHeader'

export const TrustSignalsBlock: React.FC<TrustSignalsBlockProps> = ({ intro, items, title }) => {
  return (
    <section className="container">
      <div className="space-y-8">
        <SectionHeader intro={intro} title={title} />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {items?.map((item, index) => (
            <article className="rounded-xl border border-border bg-card p-6" key={index}>
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              <h3 className="mt-4 text-lg font-semibold tracking-tight">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
