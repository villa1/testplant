import type { Block, PayloadRequest } from 'payload'

import { selectedMediaHasAlt, type SelectedMediaValue } from '@/utilities/selectedMediaHasAlt'

export const FooterIdentity: Block = {
  slug: 'identity',
  interfaceName: 'FooterIdentityBlock',
  labels: {
    singular: 'Footer Identity',
    plural: 'Footer Identity Blocks',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Identitas',
    },
    {
      name: 'brandName',
      type: 'text',
      defaultValue: 'PT Bumi Mekarsari Jaya',
      required: true,
    },
    {
      name: 'tagline',
      type: 'textarea',
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Alt text logo mengikuti field Alt pada media yang dipilih.',
      },
      validate: async (value: unknown, { req }: { req: PayloadRequest }) => {
        if (value) {
          const hasAlt = await selectedMediaHasAlt(req, value as SelectedMediaValue)

          if (!hasAlt) {
            return 'Isi Alt pada media yang dipilih agar logo footer memiliki alt text.'
          }
        }

        return true
      },
    },
    {
      name: 'nib',
      type: 'text',
    },
  ],
}
