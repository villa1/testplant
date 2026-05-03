import React from 'react'
import { CheckCircle2 } from 'lucide-react'

import type { PreparationChecklistBlock as PreparationChecklistBlockProps } from '@/payload-types'

import { SectionHeader } from '@/components/SectionHeader'

export const PreparationChecklistBlock: React.FC<PreparationChecklistBlockProps> = ({
  intro,
  items,
  title,
}) => {
  return (
    <section className="container">
      <div className="space-y-8">
        <SectionHeader intro={intro} title={title} />

        <div className="grid gap-4 md:grid-cols-2">
          {items?.map((item, index) => (
            <article className="rounded-xl border border-border bg-card p-5" key={index}>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                <p className="text-sm leading-7 text-muted-foreground">{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
