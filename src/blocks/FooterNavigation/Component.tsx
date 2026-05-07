import React from 'react'

import { CMSLink } from '@/components/Link'
import type { FooterNavigationBlock } from '@/Footer/types'

export const FooterNavigationBlockComponent: React.FC<FooterNavigationBlock> = ({
  title,
  links,
}) => {
  return (
    <div className="space-y-3">
      {title ? (
        <h2 className="text-base font-semibold tracking-tight text-[#5c574d]">{title}</h2>
      ) : null}

      <nav className="flex flex-col gap-2">
        {(links || []).map(({ link }, index) => (
          <CMSLink className="text-sm text-[#667163] hover:text-[#5c574d]" key={index} {...link} />
        ))}
      </nav>
    </div>
  )
}
