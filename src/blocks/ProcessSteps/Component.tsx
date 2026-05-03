import React from 'react'

import type { ProcessStepsBlock as ProcessStepsBlockProps } from '@/payload-types'

import { SectionHeader } from '@/components/SectionHeader'
import { cn } from '@/utilities/ui'

export const ProcessStepsBlock: React.FC<ProcessStepsBlockProps> = ({ intro, steps, title }) => {
  const gridClassName =
    steps?.length === 4 ? 'md:grid-cols-2 xl:grid-cols-4' : 'md:grid-cols-3'

  return (
    <section className="container">
      <div className="space-y-8">
        <SectionHeader intro={intro} title={title} />

        <div className={cn('grid gap-6', gridClassName)}>
          {steps?.map((step, index) => (
            <article className="rounded-xl border border-border bg-card p-6" key={index}>
              <div className="text-sm font-medium text-muted-foreground">Langkah {index + 1}</div>
              <h3 className="mt-3 text-xl font-semibold tracking-tight">{step.title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
