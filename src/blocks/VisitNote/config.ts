import type { Block } from 'payload'

export const VisitNote: Block = {
  slug: 'visitNote',
  interfaceName: 'VisitNoteBlock',
  labels: {
    singular: 'Visit Note',
    plural: 'Visit Note Blocks',
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
    },
  ],
}
