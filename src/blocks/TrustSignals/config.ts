import type { Block } from 'payload'

export const TrustSignals: Block = {
  slug: 'trustSignals',
  interfaceName: 'TrustSignalsBlock',
  labels: {
    singular: 'Trust Signals',
    plural: 'Trust Signals Blocks',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'intro',
      type: 'textarea',
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 3,
      maxRows: 4,
      fields: [
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
