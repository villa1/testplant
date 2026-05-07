import React from 'react'

import type { CallToActionBlock as CTABlockProps } from '@/payload-types'
import { SectionShell } from '@/components/layout/SectionShell'
import { Surface } from '@/components/layout/Surface'
import { RichText } from '@/components/RichText'
import { CMSLink } from '@/components/Link'

export const CallToActionBlock: React.FC<
  CTABlockProps & {
    id?: string | number
    className?: string
  }
> = ({ className, id, links, richText }) => {
  return (
    <SectionShell className={className} id={id ? String(id) : undefined} spacing="compact" variant="plain">
      <Surface className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div className="max-w-3xl flex items-center">
          {richText && <RichText className="mb-0" data={richText} enableGutter={false} />}
        </div>
        <div className="flex flex-col gap-8">
          {(links || []).map(({ link }, i) => {
            return <CMSLink key={i} size="lg" {...link} />
          })}
        </div>
      </Surface>
    </SectionShell>
  )
}
