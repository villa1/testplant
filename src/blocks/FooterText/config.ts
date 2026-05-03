import type { Block } from 'payload'

export const FooterText: Block = {
  slug: 'text',
  interfaceName: 'FooterTextBlock',
  labels: {
    singular: 'Footer Text',
    plural: 'Footer Text Blocks',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'content',
      type: 'textarea',
      required: true,
    },
  ],
}
