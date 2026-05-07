import React from 'react'

import { CMSLink } from '@/components/Link'
import type { FooterBottomBarBlock } from '@/Footer/types'

export const FooterBottomBarBlockComponent: React.FC<FooterBottomBarBlock> = ({
  copyrightText,
  items,
  links,
}) => {
  return (
    <div className="container-wide flex flex-col gap-2 py-4 text-sm text-[#667163] md:flex-row md:flex-wrap md:items-center">
      <span>{copyrightText}</span>
      {(items || []).map((item, index) => (
        <span className="flex items-center gap-3" key={item.id || index}>
          <span className="hidden md:inline text-[#a6b3a1]">{'\u00B7'}</span>
          <span>{item.text}</span>
        </span>
      ))}
      {(links || []).map(({ link }, index) => (
        <span className="flex items-center gap-3" key={index}>
          <span className="hidden md:inline text-[#a6b3a1]">{'\u00B7'}</span>
          <CMSLink className="text-[#667163] hover:text-[#5c574d]" {...link} />
        </span>
      ))}
    </div>
  )
}
