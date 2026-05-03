import { getCachedGlobal } from '@/utilities/getGlobals'
import { normalizeStorefrontHeader } from './normalize'

import './index.css'
import { HeaderClient } from './index.client'

export async function Header() {
  const header = normalizeStorefrontHeader(await getCachedGlobal('header', 1)())

  return <HeaderClient header={header} />
}
