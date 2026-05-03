import type { Block } from 'payload'

export const SupplyCapacity: Block = {
  slug: 'supplyCapacity',
  interfaceName: 'SupplyCapacityBlock',
  labels: {
    singular: 'Supply Capacity',
    plural: 'Supply Capacity Blocks',
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
        description: 'Pernyataan kapasitas supply tanpa mengklaim angka stok tetap.',
      },
    },
  ],
}
