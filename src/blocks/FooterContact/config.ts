import type { Block } from 'payload'

export const FooterContact: Block = {
  slug: 'contact',
  interfaceName: 'FooterContactBlock',
  labels: {
    singular: 'Footer Contact',
    plural: 'Footer Contact Blocks',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Kontak Cepat',
    },
    {
      name: 'whatsappNumber',
      type: 'text',
    },
    {
      name: 'phoneNumber',
      type: 'text',
    },
    {
      name: 'email',
      type: 'email',
    },
    {
      name: 'address',
      type: 'textarea',
    },
    {
      name: 'mapsLabel',
      type: 'text',
      defaultValue: 'Buka Lokasi',
    },
    {
      name: 'mapsUrl',
      type: 'text',
    },
    {
      name: 'operatingHours',
      type: 'text',
    },
  ],
}
