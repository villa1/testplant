import type { Block } from 'payload'

import { link } from '@/fields/link'

export const ClosingCTA: Block = {
  slug: 'closingCTA',
  interfaceName: 'ClosingCtaBlock',
  labels: {
    singular: 'Closing CTA',
    plural: 'Closing CTA Blocks',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'body',
      type: 'textarea',
      required: true,
    },
    {
      name: 'phoneNumber',
      type: 'text',
      required: true,
    },
    link({
      appearances: ['default'],
      overrides: {
        name: 'primaryCTA',
        label: 'Primary CTA',
        admin: {
          description: 'CTA penutup. Secara bisnis tetap diarahkan ke WhatsApp.',
        },
      },
    }),
  ],
}
