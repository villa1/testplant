import type { Block } from 'payload'

export const PreparationChecklist: Block = {
  slug: 'preparationChecklist',
  interfaceName: 'PreparationChecklistBlock',
  labels: {
    singular: 'Preparation Checklist',
    plural: 'Preparation Checklist Blocks',
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
          name: 'text',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}
