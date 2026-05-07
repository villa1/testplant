import React from 'react'

import { SectionShell } from '@/components/layout/SectionShell'
import { Surface } from '@/components/layout/Surface'
import type { LegalFactsBlock as LegalFactsBlockProps } from '@/payload-types'

import { SectionHeader } from '@/components/SectionHeader'

type Props = LegalFactsBlockProps & {
  id?: string
}

export const LegalFactsBlock: React.FC<Props> = ({ id, intro, items, title }) => {
  return (
    <SectionShell id={id} spacing="compact" variant="plain">
      <div className="space-y-8">
        <SectionHeader intro={intro} title={title} />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items?.map((item, index) => (
            <Surface as="article" key={index}>
              <div className="text-sm font-medium text-muted-foreground">{item.label}</div>
              <div className="mt-3 text-base font-semibold leading-7">{item.value}</div>
            </Surface>
          ))}
        </div>
      </div>
    </SectionShell>
  )
}
