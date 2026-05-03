import type { Block } from 'payload'

export const SupplyCategories: Block = {
  slug: 'supplyCategories',
  interfaceName: 'SupplyCategoriesBlock',
  labels: {
    singular: 'Supply Categories',
    plural: 'Supply Categories Blocks',
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
      name: 'categories',
      type: 'array',
      required: true,
      minRows: 4,
      maxRows: 6,
      fields: [
        {
          name: 'supplyType',
          type: 'select',
          defaultValue: 'highVolume',
          options: [
            {
              label: 'Volume Besar',
              value: 'highVolume',
            },
            {
              label: 'Konsultasi Dulu',
              value: 'consultation',
            },
          ],
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
  ],
}
