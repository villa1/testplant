import type { GlobalConfig, PayloadRequest } from 'payload'

import { adminOnly } from '@/access/adminOnly'
import { revalidateHeader } from '@/Header/hooks/revalidateHeader'
import { link } from '@/fields/link'
import { selectedMediaHasAlt, type SelectedMediaValue } from '@/utilities/selectedMediaHasAlt'

type BrandingMode = 'logo' | 'logoText' | 'text'

const usesLogoMode = (mode: BrandingMode | null | undefined) =>
  mode === 'logo' || mode === 'logoText'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
    update: adminOnly,
  },
  fields: [
    {
      type: 'collapsible',
      label: 'Branding',
      fields: [
        {
          name: 'brandingMode',
          type: 'radio',
          defaultValue: 'logoText',
          required: true,
          admin: {
            description:
              'Pilih metode branding yang akan ditampilkan di header.',
            layout: 'horizontal',
          },
          options: [
            {
              label: 'Text',
              value: 'text',
            },
            {
              label: 'Logo',
              value: 'logo',
            },
            {
              label: 'Logo + Text',
              value: 'logoText',
            },
          ],
        },
        {
          name: 'brandName',
          type: 'text',
          defaultValue: 'PT Bumi Mekarsari Jaya',
          required: true,
          admin: {
            description: 'Nama brand utama yang selalu tampil di header.',
          },
        },
        {
          name: 'brandDescription',
          type: 'text',
          defaultValue: 'Jaringan Petani Cipanas',
          admin: {
            condition: (_, siblingData) => siblingData?.brandingMode !== 'logo',
            description: 'Deskripsi singkat di bawah nama brand. Opsional.',
          },
        },
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          admin: {
            condition: (_, siblingData) =>
              usesLogoMode((siblingData?.brandingMode as BrandingMode | undefined) ?? 'logoText'),
            description:
              'Logo untuk mode Logo atau Logo + Text. Alt text mengikuti field Alt pada media yang dipilih.',
          },
          validate: async (
            value: unknown,
            {
              req,
              siblingData,
            }: {
              req: PayloadRequest
              siblingData?: { brandingMode?: BrandingMode }
            },
          ) => {
            if (usesLogoMode(siblingData?.brandingMode) && !value) {
              return 'Logo wajib diisi untuk mode branding ini.'
            }

            if (usesLogoMode(siblingData?.brandingMode) && value) {
              const hasAlt = await selectedMediaHasAlt(req, value as SelectedMediaValue)

              if (!hasAlt) {
                return 'Isi Alt pada media yang dipilih agar logo header memiliki alt text.'
              }
            }

            return true
          },
        },
      ],
    },
    {
      name: 'navItems',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
