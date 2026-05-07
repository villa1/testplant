'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { RichText } from '@/components/RichText'
import { HeroShell } from '@/heros/HeroShell'

export const HighImpactHero: React.FC<Page['hero']> = ({ links, media, richText }) => {
  const { setHeaderTheme } = useHeaderTheme()
  const hasMedia = media && typeof media === 'object'

  useEffect(() => {
    setHeaderTheme('dark')
    return () => {
      setHeaderTheme(undefined)
    }
  }, [setHeaderTheme])

  const background = hasMedia ? (
    <>
      <Media fill htmlElement={null} imgClassName="object-cover" priority resource={media} size="100vw" />
      <div className="absolute inset-0 bg-black/45" />
    </>
  ) : (
    <div className="absolute inset-0 bg-[#203223]" />
  )

  return (
    <HeroShell background={background} className="hero-shell--high-impact" containment="wide">
      <div className="hero-shell__body" data-theme="dark">
        <div className="hero-shell__content hero-shell__content--centered">
          {richText ? (
            <RichText
              className="hero-shell__prose prose-headings:text-white prose-p:text-white/90 prose-strong:text-white prose-a:text-white"
              data={richText}
              enableGutter={false}
            />
          ) : null}

          {Array.isArray(links) && links.length > 0 && (
            <ul className="hero-shell__actions justify-center">
              {links.map(({ link }, i) => {
                return (
                  <li key={i}>
                    <CMSLink {...link} />
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </HeroShell>
  )
}
