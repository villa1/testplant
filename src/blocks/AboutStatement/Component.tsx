import React from 'react'

import type { AboutStatementBlock as AboutStatementBlockProps } from '@/payload-types'

import { SectionHeader } from '@/components/SectionHeader'

export const AboutStatementBlock: React.FC<AboutStatementBlockProps> = ({ body, title }) => {
  return (
    <section className="container">
      <div className="rounded-xl border border-border bg-card p-8 md:p-10">
        <SectionHeader title={title} />
        <div className="mt-6 max-w-4xl">
          <p className="text-base leading-8 text-muted-foreground md:text-lg">{body}</p>
        </div>
      </div>
    </section>
  )
}
