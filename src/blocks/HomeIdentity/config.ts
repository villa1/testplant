import type { Block } from 'payload'

export const HomeIdentity: Block = {
  slug: 'homeIdentity',
  interfaceName: 'HomeIdentityBlock',
  labels: {
    singular: 'Home Identity',
    plural: 'Home Identity Blocks',
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
        description: '2-3 kalimat yang menjelaskan PT BMJ sebagai koordinator jaringan petani di Cipanas.',
      },
    },
  ],
}
