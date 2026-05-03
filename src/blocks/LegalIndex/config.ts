import type { Block } from 'payload'

export const LegalIndex: Block = {
  slug: 'legalIndex',
  interfaceName: 'LegalIndexBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Dokumen Legal',
    },
    {
      name: 'emptyMessage',
      type: 'text',
      defaultValue: 'Halaman legal akan tampil otomatis di sini setelah dibuat dan diberi tipe legal.',
    },
  ],
  labels: {
    singular: 'Legal Index',
    plural: 'Legal Index Blocks',
  },
}
