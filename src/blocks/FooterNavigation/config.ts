import type { Block } from 'payload'

import { footerLink } from '@/fields/footerLink'

export const FooterNavigation: Block = {
  slug: 'navigation',
  interfaceName: 'FooterNavigationBlock',
  labels: {
    singular: 'Footer Navigation',
    plural: 'Footer Navigation Blocks',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Navigasi',
    },
    {
      name: 'links',
      type: 'array',
      minRows: 1,
      fields: [footerLink()],
      admin: {
        initCollapsed: true,
      },
    },
  ],
}
