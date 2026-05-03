import type { Block } from 'payload'

export const MapEmbed: Block = {
  slug: 'mapEmbed',
  interfaceName: 'MapEmbedBlock',
  labels: {
    singular: 'Map Embed',
    plural: 'Map Embed Blocks',
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
      name: 'embedUrl',
      type: 'text',
      required: true,
      admin: {
        description: 'Gunakan Google Maps embed URL, bukan link share biasa.',
      },
    },
  ],
}
