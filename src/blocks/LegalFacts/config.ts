import type { Block } from 'payload'

export const LegalFacts: Block = {
  slug: 'legalFacts',
  interfaceName: 'LegalFactsBlock',
  labels: {
    singular: 'Legal Facts',
    plural: 'Legal Facts Blocks',
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
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'value',
          type: 'textarea',
          required: true,
        },
      ],
    },
  ],
}
