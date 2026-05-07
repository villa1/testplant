import React from 'react'

import { cn } from '@/utilities/cn'
import {
  resolveSectionShellContainment,
  resolveSectionShellSpacing,
  resolveSectionShellVariant,
  resolveSectionShellVariantMeta,
  sectionShellContainmentClasses,
  sectionShellSpacingClasses,
  sectionShellVariantClasses,
  type SectionShellContainment,
  type SectionShellSpacing,
  type SectionShellVariant,
} from './layoutPrimitives.config'

export type {
  SectionShellContainment,
  SectionShellSpacing,
  SectionShellVariant,
} from './layoutPrimitives.config'

type SectionShellProps = React.PropsWithChildren<{
  background?: React.ReactNode
  className?: string
  containment?: SectionShellContainment
  id?: string
  innerClassName?: string
  spacing?: SectionShellSpacing
  variant?: SectionShellVariant
}>

export const SectionShell: React.FC<SectionShellProps> = ({
  background,
  children,
  className,
  containment,
  id,
  innerClassName,
  spacing,
  variant,
}) => {
  const resolvedContainment = resolveSectionShellContainment(containment)
  const resolvedSpacing = resolveSectionShellSpacing(spacing)
  const resolvedVariant = resolveSectionShellVariant(variant)
  const resolvedVariantMeta = resolveSectionShellVariantMeta(resolvedVariant)

  return (
    <section
      className={cn(
        'section-shell',
        sectionShellSpacingClasses[resolvedSpacing],
        sectionShellVariantClasses[resolvedVariant],
        className,
      )}
      data-section-containment={resolvedContainment}
      data-section-decorative={resolvedVariantMeta.decorative ? 'true' : 'false'}
      data-section-role={resolvedVariantMeta.role}
      data-section-shell="true"
      data-section-spacing={resolvedSpacing}
      data-section-surface-shift={resolvedVariantMeta.surfaceShift ? 'true' : 'false'}
      data-section-variant={resolvedVariant}
      id={id}
    >
      {background ? (
        <div aria-hidden="true" className="section-shell__background">
          {background}
        </div>
      ) : null}

      <div
        className={cn(
          'section-shell__inner',
          sectionShellContainmentClasses[resolvedContainment],
          innerClassName,
        )}
      >
        {children}
      </div>
    </section>
  )
}
