import type { GlobalConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'
import { FooterBottomBar } from '@/blocks/FooterBottomBar/config'
import { FooterContact } from '@/blocks/FooterContact/config'
import { FooterIdentity } from '@/blocks/FooterIdentity/config'
import { FooterNavigation } from '@/blocks/FooterNavigation/config'
import { FooterText } from '@/blocks/FooterText/config'
import { revalidateFooter } from '@/Footer/hooks/revalidateFooter'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
    update: adminOnly,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              blocks: [
                FooterIdentity,
                FooterNavigation,
                FooterContact,
                FooterText,
                FooterBottomBar,
              ],
              required: true,
              maxRows: 6,
              admin: {
                initCollapsed: true,
              },
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
