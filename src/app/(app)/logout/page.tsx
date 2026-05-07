import type { Metadata } from 'next'

import { PageFrame } from '@/components/layout/PageFrame'
import { SectionShell } from '@/components/layout/SectionShell'
import { Surface } from '@/components/layout/Surface'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import React from 'react'

import { LogoutPage } from './LogoutPage'

export default async function Logout() {
  return (
    <PageFrame family="utility">
      <SectionShell containment="narrow" spacing="compact" variant="plain">
        <Surface variant="elevated">
          <LogoutPage />
        </Surface>
      </SectionShell>
    </PageFrame>
  )
}

export const metadata: Metadata = {
  description: 'You have been logged out.',
  openGraph: mergeOpenGraph({
    title: 'Logout',
    url: '/logout',
  }),
  title: 'Logout',
}
