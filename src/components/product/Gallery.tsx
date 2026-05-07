'use client'

import type { Media as MediaType } from '@/payload-types'

import { Media } from '@/components/Media'
import { GridTileImage } from '@/components/Grid/tile'
import { ProductImageFallback } from '@/components/product/ProductImageFallback'
import { useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'

import { Carousel, CarouselApi, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { DefaultDocumentIDType } from 'payload'
import type { NormalizedProductGalleryItem } from '@/utilities/productMedia'

type Props = {
  gallery: NormalizedProductGalleryItem[]
  productTitle?: string | null
}

export const Gallery: React.FC<Props> = ({ gallery, productTitle }) => {
  const searchParams = useSearchParams()
  const [current, setCurrent] = React.useState(0)
  const [api, setApi] = React.useState<CarouselApi>()

  useEffect(() => {
    if (!api) {
      return
    }
  }, [api])

  useEffect(() => {
    const values = Array.from(searchParams.values())

    if (values && api) {
      const index = gallery.findIndex((item) => {
        if (!item.variantOption) return false

        let variantID: DefaultDocumentIDType

        if (typeof item.variantOption === 'object') {
          variantID = item.variantOption.id
        } else variantID = item.variantOption

        return Boolean(values.find((value) => value === String(variantID)))
      })
      if (index !== -1) {
        setCurrent(index)
        api.scrollTo(index, true)
      }
    }
  }, [searchParams, api, gallery])

  return (
    <div>
      <div className="relative mb-8 w-full overflow-hidden">
        {gallery[current]?.image ? (
          <Media
            resource={gallery[current].image}
            className="w-full"
            imgClassName="aspect-[4/5] w-full rounded-lg object-cover"
          />
        ) : (
          <ProductImageFallback title={productTitle} />
        )}
      </div>

      <Carousel setApi={setApi} className="w-full" opts={{ align: 'start', loop: false }}>
        <CarouselContent>
          {gallery.map((item, i) => {
            return (
              <CarouselItem
                className="basis-1/5"
                key={`${item.image.id}-${i}`}
                onClick={() => setCurrent(i)}
              >
                <GridTileImage active={i === current} media={item.image} />
              </CarouselItem>
            )
          })}
        </CarouselContent>
      </Carousel>
    </div>
  )
}
