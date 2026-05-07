import React from 'react'
import { BadgeCheck, MessagesSquare, PackageCheck, Truck } from 'lucide-react'

import type { HomeHeroBlock as HomeHeroBlockProps } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { HeroShell } from '@/heros/HeroShell'

const trustIconMap = {
  consultation: MessagesSquare,
  quality: BadgeCheck,
  shipping: Truck,
  supply: PackageCheck,
} as const

type Props = HomeHeroBlockProps & {
  id?: string
}

export const HomeHeroBlock: React.FC<Props> = ({
  badgeText,
  title,
  supportingText,
  backgroundImage,
  primaryCTA,
  secondaryCTA,
  trustItems,
  id,
}) => {
  const hasBackgroundImage = backgroundImage && typeof backgroundImage === 'object'
  const heroTrustItems = trustItems?.slice(0, 4) ?? []

  return (
    <HeroShell
      className="hero-shell--home home-hero"
      containment="wide"
      id={id}
      innerClassName="home-hero__inner"
    >
      <div className="home-hero__frame">
        {hasBackgroundImage ? (
          <div className="absolute inset-0">
            <Media
              fill
              htmlElement={null}
              imgClassName="home-hero__media"
              priority
              resource={backgroundImage}
              size="100vw"
            />
            <div className="home-hero__media-overlay absolute inset-0" />
            <div className="home-hero__media-glow absolute inset-0" />
          </div>
        ) : null}

        <div className="home-hero__content">
          <div className="home-hero__content-inner">
            <div className="home-hero__copy-stack">
              {badgeText ? (
                <div className="home-hero__badge">
                  {badgeText}
                </div>
              ) : null}

              <div className="home-hero__headline-group">
                <h1 className="type-hero-title home-hero__title">{title}</h1>
                <p className="home-hero__supporting-copy">
                  {supportingText}
                </p>
              </div>

              <div className="home-hero__actions">
                {primaryCTA ? (
                  <CMSLink
                    {...primaryCTA}
                    appearance="default"
                    className="polish-action polish-action--dark"
                    size="lg"
                  />
                ) : null}
                {secondaryCTA ? (
                  <CMSLink
                    {...secondaryCTA}
                    appearance="outline"
                    className="polish-action polish-action--soft"
                    size="lg"
                  />
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {heroTrustItems.length > 0 ? (
          <div className="home-hero__trust-bar">
            <div className="home-hero__trust-inner">
              <div className="home-hero__trust-grid">
                {heroTrustItems.map((item, index) => {
                  const Icon = trustIconMap[item.icon]

                  return (
                    <div className="home-hero__trust-item" key={index}>
                      <div className="home-hero__trust-icon">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="home-hero__trust-copy">
                        <div className="home-hero__trust-title">{item.title}</div>
                        <div className="home-hero__trust-description">{item.description}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </HeroShell>
  )
}
