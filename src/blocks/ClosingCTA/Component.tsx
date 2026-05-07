import React from 'react'

import { SectionShell } from '@/components/layout/SectionShell'
import { Surface } from '@/components/layout/Surface'
import type { ClosingCtaBlock as ClosingCtaBlockProps } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { SectionHeader } from '@/components/SectionHeader'

type Props = ClosingCtaBlockProps & {
  id?: string
}

export const ClosingCTABlock: React.FC<Props> = ({
  body,
  id,
  phoneNumber,
  primaryCTA,
  title,
}) => {
  return (
    <SectionShell
      className="overflow-hidden"
      id={id}
      spacing="compact"
      variant="plain"
    >
      <Surface
        className="rounded-[1.5rem] border-[#d8e1d5] bg-white/96 shadow-[0_24px_52px_rgba(15,23,42,0.08)] backdrop-blur-sm"
        variant="elevated"
      >
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <SectionHeader intro={body} title={title} />
            <div className="mt-6">
              <div className="text-sm font-medium text-muted-foreground">WhatsApp / Telepon</div>
              <div className="mt-2 text-2xl font-semibold tracking-tight">{phoneNumber}</div>
            </div>
          </div>

          <div>
            {primaryCTA ? (
              <CMSLink
                {...primaryCTA}
                appearance="default"
                className="polish-action polish-action--dark"
                size="lg"
              />
            ) : null}
          </div>
        </div>
      </Surface>
    </SectionShell>
  )
}
