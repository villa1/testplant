import clsx from 'clsx'
import React from 'react'

import type { Media as MediaResource } from '@/payload-types'
import type { BrandingMode, HeaderLogoAsset } from '@/components/Header/normalize'

import { Media } from '@/components/Media'
import type { MediaLikeResource } from '@/components/Media/types'

interface Props {
  brandName?: string | null
  brandDescription?: string | null
  brandingMode?: BrandingMode | null
  className?: string
  loading?: 'lazy' | 'eager'
  logo?: HeaderLogoAsset | MediaLikeResource | MediaResource | number | string | null
  priority?: boolean
}

const toRenderableLogo = (
  value: HeaderLogoAsset | MediaLikeResource | MediaResource | number | string | null | undefined,
): MediaLikeResource | null => {
  if (!value || typeof value !== 'object') {
    return null
  }

  const alt = typeof value.alt === 'string' ? value.alt.trim() : ''
  const url = typeof value.url === 'string' ? value.url.trim() : ''

  if (!alt || !url) {
    return null
  }

  return {
    alt,
    height: value.height ?? null,
    mimeType: 'mimeType' in value ? value.mimeType ?? null : null,
    url,
    width: value.width ?? null,
  }
}

export const Logo = (props: Props) => {
  const { brandName, brandDescription, brandingMode, className, logo, priority } = props
  const requestedMode = brandingMode || 'logoText'
  const logoAsset = toRenderableLogo(logo)
  const hasLogo = Boolean(logoAsset)
  const modeUsesLogo = requestedMode === 'logo' || requestedMode === 'logoText'
  const effectiveMode = modeUsesLogo && !hasLogo ? 'text' : requestedMode
  const shouldRenderLogo = effectiveMode === 'logo' || effectiveMode === 'logoText'
  const shouldRenderText = effectiveMode === 'text' || effectiveMode === 'logoText'

  if (shouldRenderText && !brandName) {
    return null
  }

  return (
    <div className={clsx('flex items-center gap-3', className)}>
      {shouldRenderLogo ? (
        <Media
          className="shrink-0"
          imgClassName="h-11 w-11 rounded-md object-cover"
          priority={priority}
          resource={logoAsset || undefined}
          size="44px"
        />
      ) : null}

      {shouldRenderText ? (
        <div className="flex min-w-0 flex-col">
          <span className="font-[family:var(--font-brand)] text-lg leading-none tracking-tight md:text-xl">
            {brandName}
          </span>
          {brandDescription ? (
            <span className="mt-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground md:text-xs">
              {brandDescription}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
