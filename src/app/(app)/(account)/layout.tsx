import type { ReactNode } from 'react'

import { headers as getHeaders } from 'next/headers.js'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { RenderParams } from '@/components/RenderParams'
import { AccountNav } from '@/components/AccountNav'
import { PageFrame } from '@/components/layout/PageFrame'
import { SectionShell } from '@/components/layout/SectionShell'
import { Surface } from '@/components/layout/Surface'

export default async function RootLayout({ children }: { children: ReactNode }) {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  return (
    <PageFrame family="utility">
      <SectionShell containment="wide" spacing="compact" variant="plain">
        <div className="space-y-8">
          <RenderParams className="" />

          <div className="grid items-start gap-8 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-10">
            {user ? (
              <Surface as="aside" className="lg:sticky lg:top-28" variant="flat">
                <AccountNav className="flex flex-col gap-4" />
              </Surface>
            ) : null}

            <div className="flex min-w-0 flex-col gap-8">{children}</div>
          </div>
        </div>
      </SectionShell>
    </PageFrame>
  )
}
