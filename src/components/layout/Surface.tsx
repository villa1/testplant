import React from 'react'

import { cn } from '@/utilities/cn'

export type SurfaceVariant = 'default' | 'elevated' | 'flat' | 'outlined' | 'accent' | 'dark'

type SurfaceProps = React.PropsWithChildren<{
  as?: 'article' | 'aside' | 'div' | 'li' | 'section'
  className?: string
  variant?: SurfaceVariant
}>

export const Surface: React.FC<SurfaceProps> = ({
  as = 'div',
  children,
  className,
  variant = 'default',
}) => {
  const Component = as

  return (
    <Component
      className={cn('surface', variant !== 'default' && `surface--${variant}`, className)}
      data-surface="true"
      data-surface-variant={variant}
    >
      {children}
    </Component>
  )
}
