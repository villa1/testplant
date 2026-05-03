import type { Block } from 'payload'

import { link } from '@/fields/link'

export const HomeHero: Block = {
  slug: 'homeHero',
  interfaceName: 'HomeHeroBlock',
  labels: {
    singular: 'Home Hero',
    plural: 'Home Heroes',
  },
  fields: [
    {
      name: 'badgeText',
      type: 'text',
      admin: {
        description: 'Eyebrow kecil di atas title. Opsional.',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'supportingText',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Subheadline / supporting copy hero.',
      },
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    link({
      appearances: false,
      overrides: {
        name: 'primaryCTA',
        label: 'Primary CTA',
        admin: {
          description: 'CTA utama. Harus mengarah ke WhatsApp.',
        },
      },
    }),
    link({
      appearances: false,
      overrides: {
        name: 'secondaryCTA',
        label: 'Secondary CTA',
        admin: {
          description: 'CTA sekunder informasional, misalnya ke /layanan atau /tentang.',
        },
      },
    }),
    {
      name: 'trustItems',
      type: 'array',
      required: true,
      minRows: 3,
      maxRows: 4,
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'icon',
          type: 'select',
          required: true,
          options: [
            {
              label: 'Pengiriman',
              value: 'shipping',
            },
            {
              label: 'Kualitas',
              value: 'quality',
            },
            {
              label: 'Konsultasi',
              value: 'consultation',
            },
            {
              label: 'Supply',
              value: 'supply',
            },
          ],
        },
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}
