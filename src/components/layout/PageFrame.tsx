import React from 'react'

import { cn } from '@/utilities/cn'
import {
  pageFrameFamilyClasses,
  resolvePageFrameFamily,
  resolvePageFrameFamilyMeta,
  type PageFrameFamily,
} from './layoutPrimitives.config'

export type { PageFrameFamily } from './layoutPrimitives.config'

type PageFrameProps = React.PropsWithChildren<{
  as?: 'article' | 'div' | 'section'
  className?: string
  family?: PageFrameFamily
  hasHero?: boolean
}>

export const PageFrame: React.FC<PageFrameProps> = ({
  as = 'div',
  children,
  className,
  family,
  hasHero = false,
}) => {
  const Component = as
  const resolvedFamily = resolvePageFrameFamily(family)
  const resolvedFamilyMeta = resolvePageFrameFamilyMeta(resolvedFamily)

  return (
    <Component
      className={cn(pageFrameFamilyClasses[resolvedFamily], hasHero && 'page-frame--has-hero', className)}
      data-page-expressive={resolvedFamilyMeta.expressive ? 'true' : 'false'}
      data-page-family={resolvedFamily}
      data-page-frame="true"
      data-page-has-hero={hasHero ? 'true' : 'false'}
      data-page-tone={resolvedFamilyMeta.tone}
    >
      {children}
    </Component>
  )
}
