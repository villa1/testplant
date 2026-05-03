import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

import {
  getFooterBottomBarBlocks,
  getFooterColumnBlocks,
  RenderFooterBottomBarBlocks,
  RenderFooterColumnBlocks,
} from '@/Footer/RenderBlocks'
import type { BMJFooter, FooterLayout } from '@/Footer/types'

const gridClassMap: Record<number, string> = {
  1: 'md:grid-cols-1',
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-2 xl:grid-cols-3',
  4: 'md:grid-cols-2 xl:grid-cols-4',
}

const currentYear = new Date().getFullYear()

const getFallbackLayout = (): FooterLayout => [
  {
    blockType: 'identity',
    title: 'Identitas',
    brandName: 'PT Bumi Mekarsari Jaya',
    tagline: 'Jaringan Petani Cipanas',
    nib: '0712240010385',
  },
  {
    blockType: 'navigation',
    title: 'Navigasi',
    links: [
      {
        link: {
          type: 'custom',
          label: 'Home',
          url: '/',
        },
      },
      {
        link: {
          type: 'custom',
          label: 'Tentang',
          url: '/tentang',
        },
      },
      {
        link: {
          type: 'custom',
          label: 'Layanan',
          url: '/layanan',
        },
      },
      {
        link: {
          type: 'custom',
          label: 'Kontak',
          url: '/kontak',
        },
      },
    ],
  },
  {
    blockType: 'contact',
    title: 'Kontak Cepat',
    whatsappNumber: '081586664516',
    phoneNumber: '081586664516',
    email: 'bumimekarsarijaya@gmail.com',
    address: 'KP Lebak Pasar, Desa Cimacan, Cipanas, Cianjur 43253',
    mapsLabel: 'Buka Lokasi',
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=KP+Lebak+Pasar%2C+Desa+Cimacan%2C+Cipanas%2C+Cianjur+43253',
    operatingHours: 'Konfirmasi melalui WhatsApp',
  },
  {
    blockType: 'bottomBar',
    copyrightText: `\u00A9 ${currentYear} PT Bumi Mekarsari Jaya`,
    items: [
      {
        text: 'NIB 0712240010385',
      },
      {
        text: 'Cipanas, Cianjur',
      },
    ],
    links: [],
  },
]

export async function Footer() {
  const footerData = (await getCachedGlobal('footer', 2)()) as BMJFooter
  const layout =
    footerData?.layout && footerData.layout.length > 0 ? footerData.layout : getFallbackLayout()
  const columnBlocks = getFooterColumnBlocks(layout)
  const bottomBarBlocks = getFooterBottomBarBlocks(layout)
  const totalColumns = Math.min(Math.max(columnBlocks.length, 1), 4)

  return (
    <footer className="mt-auto border-t border-border bg-[#1b271b] text-white">
      <div className={`container grid gap-10 py-12 ${gridClassMap[totalColumns]}`}>
        <RenderFooterColumnBlocks blocks={layout} />
      </div>

      {bottomBarBlocks.length > 0 ? (
        <div className="border-t border-white/10">
          <RenderFooterBottomBarBlocks blocks={layout} />
        </div>
      ) : null}
    </footer>
  )
}
