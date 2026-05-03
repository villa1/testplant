import type { Block } from 'payload'

export const ValueStatement: Block = {
  slug: 'valueStatement',
  interfaceName: 'ValueStatementBlock',
  labels: {
    singular: 'Value Statement',
    plural: 'Value Statement Blocks',
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
        description: 'Pernyataan visi atau nilai bisnis yang jujur dan spesifik.',
      },
    },
  ],
}
