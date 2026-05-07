import React from 'react'
import { CheckCircle2 } from 'lucide-react'

import { SectionShell } from '@/components/layout/SectionShell'
import { Surface } from '@/components/layout/Surface'
import type { PreparationChecklistBlock as PreparationChecklistBlockProps } from '@/payload-types'

import { SectionHeader } from '@/components/SectionHeader'

type Props = PreparationChecklistBlockProps & {
  id?: string
}

export const PreparationChecklistBlock: React.FC<Props> = ({
  id,
  intro,
  items,
  title,
}) => {
  return (
    <SectionShell id={id} spacing="compact" variant="plain">
      <div className="space-y-8">
        <SectionHeader intro={intro} title={title} />

        <div className="grid gap-4 md:grid-cols-2">
          {items?.map((item, index) => (
            <Surface as="article" key={index}>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                <p className="text-sm leading-7 text-muted-foreground">{item.text}</p>
              </div>
            </Surface>
          ))}
        </div>
      </div>
    </SectionShell>
  )
}
