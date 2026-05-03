import type { Block } from 'payload'

export const ProofGallery: Block = {
  slug: 'proofGallery',
  interfaceName: 'ProofGalleryBlock',
  labels: {
    singular: 'Proof Gallery',
    plural: 'Proof Gallery Blocks',
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
      minRows: 4,
      maxRows: 6,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
        },
      ],
    },
  ],
}
