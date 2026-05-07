import React from 'react'

import { SectionShell } from '@/components/layout/SectionShell'
import { Surface } from '@/components/layout/Surface'
import type { MapEmbedBlock as MapEmbedBlockProps } from '@/payload-types'

import { SectionHeader } from '@/components/SectionHeader'

type Props = MapEmbedBlockProps & {
  id?: string
}

export const MapEmbedBlock: React.FC<Props> = ({ embedUrl, id, intro, title }) => {
  return (
    <SectionShell id={id} spacing="compact" variant="plain">
      <SectionHeader intro={intro} title={title} />

      <Surface className="mt-8 overflow-hidden p-0">
        <iframe
          className="h-[420px] w-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={embedUrl}
          title={title}
        />
      </Surface>
    </SectionShell>
  )
}
