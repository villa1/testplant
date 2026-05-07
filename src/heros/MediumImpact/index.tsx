import React from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { RichText } from '@/components/RichText'
import { HeroShell } from '@/heros/HeroShell'

export const MediumImpactHero: React.FC<Page['hero']> = ({ links, media, richText }) => {
  return (
    <HeroShell className="hero-shell--medium-impact" containment="wide">
      <div className="hero-shell__body">
        <div className="hero-shell__stack">
          <div className="hero-shell__content">
            {richText ? (
              <RichText className="hero-shell__prose" data={richText} enableGutter={false} />
            ) : null}

            {Array.isArray(links) && links.length > 0 && (
              <ul className="hero-shell__actions">
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

          {media && typeof media === 'object' ? (
            <div className="hero-shell__media">
              <Media priority resource={media} />
              {media.caption ? (
                <div className="hero-shell__caption">
                  <RichText className="hero-shell__caption-rich-text" data={media.caption} enableGutter={false} />
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </HeroShell>
  )
}
