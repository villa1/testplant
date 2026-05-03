import type { Block } from 'payload'

export const DeliveryCoverage: Block = {
  slug: 'deliveryCoverage',
  interfaceName: 'DeliveryCoverageBlock',
  labels: {
    singular: 'Delivery Coverage',
    plural: 'Delivery Coverage Blocks',
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
      admin: {
        description: 'Penjelasan realistis mengenai area layanan dan negosiasi pengiriman jarak jauh.',
      },
    },
  ],
}
