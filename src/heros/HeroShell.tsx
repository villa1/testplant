import React from 'react'

import { SectionShell, type SectionShellContainment } from '@/components/layout/SectionShell'
import { cn } from '@/utilities/cn'

type HeroShellProps = React.PropsWithChildren<{
  background?: React.ReactNode
  className?: string
  containment?: SectionShellContainment
  id?: string
  innerClassName?: string
}>

export const HeroShell: React.FC<HeroShellProps> = ({
  background,
  children,
  className,
  containment,
  id,
  innerClassName,
}) => {
  return (
    <SectionShell
      background={background}
      className={cn('hero-shell', className)}
      containment={containment}
      id={id}
      innerClassName={cn('hero-shell__inner', innerClassName)}
      spacing="none"
      variant="hero"
    >
      {children}
    </SectionShell>
  )
}
