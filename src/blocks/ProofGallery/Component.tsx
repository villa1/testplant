import React from 'react'

import type { ProofGalleryBlock as ProofGalleryBlockProps } from '@/payload-types'

import { SectionShell } from '@/components/layout/SectionShell'
import { Media } from '@/components/Media'
import { SectionHeader } from '@/components/SectionHeader'
import { cn } from '@/utilities/cn'

type Props = ProofGalleryBlockProps & {
  id?: string
}

export const ProofGalleryBlock: React.FC<Props> = ({ id, intro, items, title }) => {
  const galleryItems = items?.filter((item) => item.image && typeof item.image === 'object') || []
  const useMosaicLayout = galleryItems.length >= 6
  const mosaicClasses = [
    'xl:col-[1] xl:row-[1]',
    'xl:col-[1] xl:row-[2]',
    'xl:col-[2] xl:row-[1_/_span_2]',
    'xl:col-[3] xl:row-[1_/_span_2]',
    'xl:col-[4] xl:row-[1]',
    'xl:col-[4] xl:row-[2]',
  ]
  const renderGalleryItem = (
    item: (typeof galleryItems)[number],
    index: number,
    className: string,
    size: string,
  ) => (
    <figure className={className} key={index}>
      <Media
        fill
        htmlElement={null}
        imgClassName="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        resource={item.image}
        size={size}
      />

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,12,9,0.02)_0%,rgba(7,12,9,0.16)_40%,rgba(7,12,9,0.84)_100%)]" />

      {item.caption ? (
        <figcaption className="absolute inset-x-0 bottom-0 p-4 md:p-5">
          <span className="inline-flex max-w-full rounded-full border border-white/15 bg-white/12 px-3 py-1 text-[0.72rem] font-medium tracking-[0.16em] text-white/90 backdrop-blur-sm">
            {item.caption}
          </span>
        </figcaption>
      ) : null}
    </figure>
  )

  return (
    <SectionShell
      id={id}
      spacing="compact"
      variant="plain"
    >
      <SectionHeader
        className="max-w-3xl pb-8 text-[#354E33] md:pb-10"
        intro={intro}
        introClassName="max-w-2xl text-[#596A5A]"
        title={title}
        titleClassName="text-[#354E33] font-semibold"
      />

      <div className="rounded-[1.5rem] border border-white/55 bg-white/92 p-4 shadow-[0_22px_54px_rgba(15,23,42,0.16)] backdrop-blur-sm md:p-5 xl:p-6">
        {useMosaicLayout ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:auto-rows-[13.875rem] xl:grid-cols-[1.18fr_1fr_1fr_1.58fr]">
            {galleryItems.slice(0, 6).map((item, index) => {
              const sizeHint =
                index === 2 || index === 3 ? '25vw' : index === 4 || index === 5 ? '32vw' : '28vw'

              return renderGalleryItem(
                item,
                index,
                cn(
                  'group relative overflow-hidden rounded-[1rem] bg-card shadow-[0_14px_30px_rgba(15,23,42,0.1)]',
                  index === 0 ? 'col-span-2 aspect-[16/11] sm:col-span-1 sm:aspect-[4/3] md:aspect-[16/11] xl:aspect-auto' : '',
                  index === 1 ? 'aspect-[4/3] md:aspect-[16/11] xl:aspect-auto' : '',
                  index >= 2 && index <= 3 ? 'aspect-[4/3] md:aspect-[4/5] xl:aspect-auto' : '',
                  index >= 4 ? 'aspect-[4/3] md:aspect-[16/11] xl:aspect-auto' : '',
                  mosaicClasses[index],
                ),
                sizeHint,
              )
            })}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {galleryItems.map((item, index) =>
              renderGalleryItem(
                item,
                index,
                'group relative aspect-[4/3] overflow-hidden rounded-[1rem] bg-card shadow-[0_14px_30px_rgba(15,23,42,0.1)]',
                '33vw',
              ),
            )}
          </div>
        )}
      </div>
    </SectionShell>
  )
}
