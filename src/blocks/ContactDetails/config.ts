import type { Block } from 'payload'

export const ContactDetails: Block = {
  slug: 'contactDetails',
  interfaceName: 'ContactDetailsBlock',
  labels: {
    singular: 'Contact Details',
    plural: 'Contact Details Blocks',
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
      name: 'phoneNumber',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'address',
      type: 'textarea',
      required: true,
    },
    {
      name: 'businessHours',
      type: 'text',
      required: true,
    },
  ],
}
