import React from 'react'

import { SectionShell } from '@/components/layout/SectionShell'
import { Media } from '@/components/Media'
import { SectionHeader } from '@/components/SectionHeader'
import type { TrustSignalsBlock as TrustSignalsBlockProps } from '@/payload-types'

const TRUST_SIGNAL_ICON = '/media/trust-signal-icon.png'

const cardAssets = [
  {
    image: '/media/IMG-20250626-WA0012.jpg',
  },
  {
    image: '/media/AIR%20MANCUR.jpg',
  },
  {
    image: '/media/HANJUANG%20HIJAU.jpg',
  },
  {
    image: '/media/HANJUANG%20MERAH.jpg',
  },
] as const

type TrustSignalCardProps = {
  description: string
  image: string
  priority?: boolean
  title: string
}

const TrustSignalCard: React.FC<TrustSignalCardProps> = ({
  description,
  image,
  priority,
  title,
}) => {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[0.95rem] bg-[#354E33] text-white shadow-[0_18px_42px_rgba(15,23,42,0.16)]">
      <div className="relative aspect-square overflow-hidden">
        <Media
          fill
          htmlElement={null}
          imgClassName="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.09]"
          priority={priority}
          size="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
          src={image}
        />

        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(53,78,51,0)_46%,rgba(53,78,51,0.12)_62%,rgba(53,78,51,0.94)_100%)]" />
        <div className="absolute inset-0 bg-[#354E33]/0 transition-colors duration-500 ease-out group-hover:bg-[#354E33]/20" />

        <div className="pointer-events-none absolute inset-0 z-10 grid grid-rows-[minmax(0,1fr)_auto_auto] px-5 pb-7 pt-7 text-center md:px-6 md:pb-8 md:pt-8">
          <div />

          <div className="flex justify-center pb-4 md:pb-5">
            <Media
              alt=""
              height={807}
              htmlElement={null}
              imgClassName="h-auto w-[clamp(4.35rem,17vw,5.4rem)] drop-shadow-[0_8px_18px_rgba(0,0,0,0.18)]"
              src={TRUST_SIGNAL_ICON}
              width={1000}
            />
          </div>

          <div className="flex min-h-[4.2rem] items-end justify-center md:min-h-[4.6rem]">
            <h3 className="mx-auto max-w-[11ch] text-[clamp(1.55rem,2.1vw,1.9rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)] line-clamp-2">
              {title}
            </h3>
          </div>
        </div>
      </div>

      <div className="flex flex-1 items-start bg-[#354E33] px-5 pb-6 pt-5 md:px-6 md:pb-7 md:pt-6">
        <p className="max-w-[26ch] text-[0.98rem] leading-8 text-white/88 line-clamp-4 md:text-[1rem]">
          {description}
        </p>
      </div>
    </article>
  )
}

type Props = TrustSignalsBlockProps & {
  id?: string
}

export const TrustSignalsBlock: React.FC<Props> = ({ id, intro, items, title }) => {
  const visibleItems = items?.slice(0, 4) ?? []

  return (
    <SectionShell
      className="overflow-hidden"
      id={id}
      spacing="compact"
      variant="plain"
    >
      <div className="space-y-8 md:space-y-10">
        <div className="mx-auto max-w-3xl text-center [&_p]:mx-auto">
          <SectionHeader intro={intro} title={title} />
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {visibleItems.map((item, index) => {
            const asset = cardAssets[index % cardAssets.length]

            return (
              <TrustSignalCard
                description={item.description}
                image={asset.image}
                key={index}
                priority={index === 0}
                title={item.title}
              />
            )
          })}
        </div>
      </div>
    </SectionShell>
  )
}
