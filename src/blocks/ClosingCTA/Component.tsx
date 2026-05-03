import React from 'react'

import type { ClosingCtaBlock as ClosingCtaBlockProps } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { SectionHeader } from '@/components/SectionHeader'

export const ClosingCTABlock: React.FC<ClosingCtaBlockProps> = ({
  body,
  phoneNumber,
  primaryCTA,
  title,
}) => {
  return (
    <section className="container">
      <div className="rounded-xl border border-border bg-card p-8 md:p-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <SectionHeader intro={body} title={title} />
            <div className="mt-6">
              <div className="text-sm font-medium text-muted-foreground">WhatsApp / Telepon</div>
              <div className="mt-2 text-2xl font-semibold tracking-tight">{phoneNumber}</div>
            </div>
          </div>

          <div>
            {primaryCTA ? <CMSLink {...primaryCTA} appearance="default" size="lg" /> : null}
          </div>
        </div>
      </div>
    </section>
  )
}
