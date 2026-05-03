import React from 'react'
import { BadgeCheck, MessagesSquare, PackageCheck, Truck } from 'lucide-react'

import type { HomeHeroBlock as HomeHeroBlockProps } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'

const trustIconMap = {
  consultation: MessagesSquare,
  quality: BadgeCheck,
  shipping: Truck,
  supply: PackageCheck,
} as const

export const HomeHeroBlock: React.FC<HomeHeroBlockProps> = ({
  badgeText,
  title,
  supportingText,
  backgroundImage,
  primaryCTA,
  secondaryCTA,
  trustItems,
}) => {
  const hasBackgroundImage = backgroundImage && typeof backgroundImage === 'object'

  return (
    <section className="container">
      <div className="relative overflow-hidden rounded-xl border border-border bg-card text-white">
        {hasBackgroundImage ? (
          <div className="absolute inset-0">
            <Media
              fill
              htmlElement={null}
              imgClassName="object-cover"
              priority
              resource={backgroundImage}
              size="100vw"
            />
            <div className="absolute inset-0 bg-black/45" />
          </div>
        ) : null}

        <div className="relative z-10 px-6 py-12 md:px-10 md:py-16">
          <div className="max-w-3xl space-y-6">
            {badgeText ? (
              <div className="inline-flex rounded-full border border-white/40 bg-black/15 px-4 py-2 text-sm font-medium">
                {badgeText}
              </div>
            ) : null}

            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight md:text-6xl">{title}</h1>
              <p className="max-w-2xl text-base leading-7 text-white/90 md:text-lg">
                {supportingText}
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              {primaryCTA ? <CMSLink {...primaryCTA} appearance="default" size="lg" /> : null}
              {secondaryCTA ? <CMSLink {...secondaryCTA} appearance="outline" size="lg" /> : null}
            </div>
          </div>
        </div>

        {trustItems && trustItems.length > 0 ? (
          <div className="relative z-10 border-t border-white/15 bg-black/35 px-6 py-5 md:px-10">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {trustItems.map((item, index) => {
                const Icon = trustIconMap[item.icon]

                return (
                  <div className="flex items-start gap-3" key={index}>
                    <div className="mt-0.5 shrink-0">
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold leading-5">{item.title}</div>
                      <div className="text-sm leading-5 text-white/80">{item.description}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}
