import Link from 'next/link'
import React from 'react'

import { Logo } from '@/components/Logo/Logo'
import type { FooterIdentityBlock } from '@/Footer/types'

export const FooterIdentityBlockComponent: React.FC<FooterIdentityBlock> = ({
  title,
  brandName,
  tagline,
  logo,
  nib,
}) => {
  return (
    <div className="space-y-4">
      {title ? (
        <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-white/64">{title}</h2>
      ) : null}

      <Link className="inline-flex items-start" href="/">
        <Logo
          brandDescription={tagline}
          brandName={brandName}
          brandingMode={logo ? 'logoText' : 'text'}
          className="[&_span:last-child]:text-white/68 [&_span:first-child]:text-white"
          logo={logo}
        />
      </Link>

      {nib ? (
        <div className="text-sm leading-7 text-white/78">
          <div>NIB {nib}</div>
        </div>
      ) : null}
    </div>
  )
}
