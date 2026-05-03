import type { Block } from 'payload'

import { footerLink } from '@/fields/footerLink'

const currentYear = new Date().getFullYear()

export const FooterBottomBar: Block = {
  slug: 'bottomBar',
  interfaceName: 'FooterBottomBarBlock',
  labels: {
    singular: 'Footer Bottom Bar',
    plural: 'Footer Bottom Bar Blocks',
  },
  fields: [
    {
      name: 'copyrightText',
      type: 'text',
      defaultValue: `\u00A9 ${currentYear} PT Bumi Mekarsari Jaya`,
      required: true,
    },
    {
      name: 'items',
      type: 'array',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'links',
      type: 'array',
      admin: {
        initCollapsed: true,
      },
      fields: [footerLink()],
    },
  ],
}
