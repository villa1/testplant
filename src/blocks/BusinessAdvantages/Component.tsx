import React from 'react'

import { SectionShell } from '@/components/layout/SectionShell'
import { Surface } from '@/components/layout/Surface'
import type { BusinessAdvantagesBlock as BusinessAdvantagesBlockProps } from '@/payload-types'

import { SectionHeader } from '@/components/SectionHeader'

type Props = BusinessAdvantagesBlockProps & {
  id?: string
}

export const BusinessAdvantagesBlock: React.FC<Props> = ({
  id,
  intro,
  items,
  title,
}) => {
  return (
    <SectionShell id={id} spacing="compact" variant="plain">
      <div className="space-y-8">
        <SectionHeader intro={intro} title={title} />

        <div className="grid gap-6 md:grid-cols-3">
          {items?.map((item, index) => (
            <Surface as="article" key={index}>
              <div className="text-sm font-medium text-muted-foreground">Keunggulan {index + 1}</div>
              <h3 className="mt-3 type-card-title">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.description}</p>
            </Surface>
          ))}
        </div>
      </div>
    </SectionShell>
  )
}
