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
        <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-white/64">{title}</h2>
      ) : null}

      <nav className="flex flex-col gap-2">
        {(links || []).map(({ link }, index) => (
          <CMSLink className="text-sm text-white/78 hover:text-white" key={index} {...link} />
        ))}
      </nav>
    </div>
  )
}
