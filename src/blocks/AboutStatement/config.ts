import type { Block } from 'payload'

export const AboutStatement: Block = {
  slug: 'aboutStatement',
  interfaceName: 'AboutStatementBlock',
  labels: {
    singular: 'About Statement',
    plural: 'About Statement Blocks',
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
        description: 'Pernyataan identitas utama untuk halaman Tentang.',
      },
    },
  ],
}
