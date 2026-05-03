import type { Field } from 'payload'

export const footerLink = (): Field => ({
  name: 'link',
  type: 'group',
  admin: {
    hideGutter: true,
  },
  fields: [
    {
      name: 'type',
      type: 'text',
      defaultValue: 'reference',
      required: true,
      admin: {
        description: 'Gunakan `reference` untuk halaman internal atau `custom` untuk URL langsung.',
      },
      validate: (value: unknown) =>
        ['reference', 'custom'].includes(String(value))
          ? true
          : 'Gunakan salah satu nilai: reference atau custom.',
    },
    {
      name: 'newTab',
      type: 'checkbox',
      label: 'Open in new tab',
    },
    {
      name: 'reference',
      type: 'relationship',
      relationTo: 'pages',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'reference',
      },
      label: 'Document to link to',
      maxDepth: 1,
      required: true,
    },
    {
      name: 'url',
      type: 'text',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'custom',
      },
      label: 'Custom URL',
      required: true,
    },
    {
      name: 'label',
      type: 'text',
      label: 'Label',
      required: true,
    },
  ],
})
