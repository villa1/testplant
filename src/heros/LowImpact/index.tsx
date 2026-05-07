import React from 'react'

import type { Page } from '@/payload-types'

import { RichText } from '@/components/RichText'
import { HeroShell } from '@/heros/HeroShell'

type LowImpactHeroType =
  | {
      children?: React.ReactNode
      richText?: never
    }
  | (Omit<Page['hero'], 'richText'> & {
      children?: never
      richText?: Page['hero']['richText']
    })

export const LowImpactHero: React.FC<LowImpactHeroType> = ({ children, richText }) => {
  return (
    <HeroShell className="hero-shell--low-impact" containment="wide">
      <div className="hero-shell__body">
        <div className="hero-shell__content">
          {children || (richText && <RichText className="hero-shell__prose" data={richText} enableGutter={false} />)}
        </div>
      </div>
    </HeroShell>
  )
}
