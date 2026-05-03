import React from 'react'

import type { FooterTextBlock } from '@/Footer/types'

export const FooterTextBlockComponent: React.FC<FooterTextBlock> = ({ title, content }) => {
  return (
    <div className="space-y-3">
      {title ? (
        <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-white/64">{title}</h2>
      ) : null}
      <p className="whitespace-pre-line text-sm leading-7 text-white/78">{content}</p>
    </div>
  )
}
