import React from 'react'

import { CMSLink } from '@/components/Link'
import type { FooterBottomBarBlock } from '@/Footer/types'

export const FooterBottomBarBlockComponent: React.FC<FooterBottomBarBlock> = ({
  copyrightText,
  items,
  links,
}) => {
  return (
    <div className="container flex flex-col gap-2 py-4 text-sm text-white/64 md:flex-row md:flex-wrap md:items-center">
      <span>{copyrightText}</span>
      {(items || []).map((item, index) => (
        <span className="flex items-center gap-3" key={item.id || index}>
          <span className="hidden md:inline text-white/40">{'\u00B7'}</span>
          <span>{item.text}</span>
        </span>
      ))}
      {(links || []).map(({ link }, index) => (
        <span className="flex items-center gap-3" key={index}>
          <span className="hidden md:inline text-white/40">{'\u00B7'}</span>
          <CMSLink className="text-white/64 hover:text-white" {...link} />
        </span>
      ))}
    </div>
  )
}
