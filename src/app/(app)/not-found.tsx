import Link from 'next/link'
import React from 'react'

import { PageFrame } from '@/components/layout/PageFrame'
import { SectionShell } from '@/components/layout/SectionShell'
import { Surface } from '@/components/layout/Surface'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <PageFrame family="utility">
      <SectionShell containment="narrow" spacing="compact" variant="plain">
        <Surface className="space-y-6" variant="elevated">
          <div className="prose max-w-none">
            <h1 style={{ marginBottom: 0 }}>404</h1>
            <p className="mb-4">This page could not be found.</p>
          </div>
          <Button asChild variant="default">
            <Link href="/">Go home</Link>
          </Button>
        </Surface>
      </SectionShell>
    </PageFrame>
  )
}
