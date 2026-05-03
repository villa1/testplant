import type { Footer as GeneratedFooter, Media, Page } from '@/payload-types'

export type FooterLink = {
  label: string
  newTab?: boolean | null
  reference?:
    | {
        relationTo: 'pages'
        value: number | Page
      }
    | null
  type?: 'custom' | 'reference' | null
  url?: string | null
}

export type FooterLinkItem = {
  id?: string | null
  link: FooterLink
}

export type FooterIdentityBlock = {
  blockName?: string | null
  blockType: 'identity'
  brandName: string
  id?: string | null
  logo?: number | Media | null
  nib?: string | null
  tagline?: string | null
  title?: string | null
}

export type FooterNavigationBlock = {
  blockName?: string | null
  blockType: 'navigation'
  id?: string | null
  links?: FooterLinkItem[] | null
  title?: string | null
}

export type FooterContactBlock = {
  address?: string | null
  blockName?: string | null
  blockType: 'contact'
  email?: string | null
  id?: string | null
  mapsLabel?: string | null
  mapsUrl?: string | null
  operatingHours?: string | null
  phoneNumber?: string | null
  title?: string | null
  whatsappNumber?: string | null
}

export type FooterTextBlock = {
  blockName?: string | null
  blockType: 'text'
  content: string
  id?: string | null
  title?: string | null
}

export type FooterBottomBarBlock = {
  blockName?: string | null
  blockType: 'bottomBar'
  copyrightText: string
  id?: string | null
  items?:
    | {
        id?: string | null
        text: string
      }[]
    | null
  links?: FooterLinkItem[] | null
}

export type FooterColumnBlock =
  | FooterContactBlock
  | FooterIdentityBlock
  | FooterNavigationBlock
  | FooterTextBlock

export type FooterBlock = FooterColumnBlock | FooterBottomBarBlock
export type FooterLayout = FooterBlock[]
export type BMJFooter = GeneratedFooter & {
  layout?: FooterLayout | null
}
