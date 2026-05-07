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
        <h2 className="text-base font-semibold tracking-tight text-[#5c574d]">{title}</h2>
      ) : null}

      <Link className="inline-flex items-start" href="/">
        <Logo
          brandDescription={tagline}
          brandName={brandName}
          brandingMode={logo ? 'logoText' : 'text'}
          className="[&_span:last-child]:text-[#617553] [&_span:first-child]:text-[#5c574d]"
          logo={logo}
        />
      </Link>

      {nib ? (
        <div className="text-sm leading-7 text-[#667163]">
          <div>NIB {nib}</div>
        </div>
      ) : null}
    </div>
  )
}
