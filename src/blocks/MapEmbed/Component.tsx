import React from 'react'

import type { MapEmbedBlock as MapEmbedBlockProps } from '@/payload-types'

import { SectionHeader } from '@/components/SectionHeader'

export const MapEmbedBlock: React.FC<MapEmbedBlockProps> = ({ embedUrl, intro, title }) => {
  return (
    <section className="container">
      <SectionHeader intro={intro} title={title} />

      <div className="mt-8 overflow-hidden rounded-xl border border-border bg-card">
        <iframe
          className="h-[420px] w-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={embedUrl}
          title={title}
        />
      </div>
    </section>
  )
}
