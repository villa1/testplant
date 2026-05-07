import React from 'react'

import { SectionShell } from '@/components/layout/SectionShell'
import { Surface } from '@/components/layout/Surface'
import type { AboutStatementBlock as AboutStatementBlockProps } from '@/payload-types'

import { SectionHeader } from '@/components/SectionHeader'

type Props = AboutStatementBlockProps & {
  id?: string
}

export const AboutStatementBlock: React.FC<Props> = ({ body, id, title }) => {
  return (
    <SectionShell id={id} spacing="compact" variant="plain">
      <Surface>
        <SectionHeader title={title} />
        <div className="mt-6 max-w-4xl">
          <p className="text-base leading-8 text-muted-foreground md:text-lg">{body}</p>
        </div>
      </Surface>
    </SectionShell>
  )
}
