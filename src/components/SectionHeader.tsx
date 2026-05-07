import React from 'react'
import { cn } from '@/utilities/cn'

type SectionHeaderProps = {
  align?: 'center' | 'left' | 'right'
  className?: string
  eyebrow?: string | null
  headingSize?: 'lg' | 'md' | 'sm'
  introClassName?: string
  title: string
  intro?: string | null
  titleClassName?: string
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  align = 'left',
  className,
  eyebrow,
  headingSize = 'md',
  intro,
  introClassName,
  title,
  titleClassName,
}) => {
  return (
    <header
      className={cn(
        'section-header',
        `section-header--${align}`,
        className,
      )}
      data-section-header="true"
    >
      {eyebrow ? <p className="section-header__eyebrow">{eyebrow}</p> : null}
      <h2
        className={cn(
          'section-header__title',
          `section-header__title--${headingSize}`,
          titleClassName,
        )}
      >
        {title}
      </h2>
      {intro ? (
        <p className={cn('section-header__intro', introClassName)}>{intro}</p>
      ) : null}
    </header>
  )
}
