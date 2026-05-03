import { cn } from '@/utilities/cn'
import { PRODUCT_IMAGE_FALLBACK_SRC } from '@/utilities/productMedia'
import Image from 'next/image'
import React from 'react'

type Props = {
  className?: string
  title?: string | null
}

export const ProductImageFallback: React.FC<Props> = ({ className, title }) => {
  return (
    <div
      className={cn(
        'relative aspect-square overflow-hidden rounded-[inherit] border border-dashed border-border bg-accent/40',
        className,
      )}
    >
      <Image
        alt={title ? `Placeholder image for ${title}` : 'Placeholder image for BMJ product'}
        className="object-cover"
        fill
        priority={false}
        sizes="(max-width: 768px) 100vw, 50vw"
        src={PRODUCT_IMAGE_FALLBACK_SRC}
      />

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent p-4 text-white">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-white/75">BMJ Placeholder</p>
        <p className="mt-1 text-sm font-medium">{title || 'Visual produk belum tersedia'}</p>
      </div>
    </div>
  )
}
