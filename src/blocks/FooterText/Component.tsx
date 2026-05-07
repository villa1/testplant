import React from 'react'

import type { FooterTextBlock } from '@/Footer/types'

export const FooterTextBlockComponent: React.FC<FooterTextBlock> = ({ title, content }) => {
  return (
    <div className="space-y-3">
      {title ? (
        <h2 className="text-base font-semibold tracking-tight text-[#5c574d]">{title}</h2>
      ) : null}
      <p className="whitespace-pre-line text-sm leading-7 text-[#667163]">{content}</p>
    </div>
  )
}
