import type { Metadata } from 'next'

import { PageFrame } from '@/components/layout/PageFrame'
import { SectionShell } from '@/components/layout/SectionShell'
import { Surface } from '@/components/layout/Surface'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import React from 'react'

import { ForgotPasswordForm } from '@/components/forms/ForgotPasswordForm'

export default async function ForgotPasswordPage() {
  return (
    <PageFrame family="utility">
      <SectionShell containment="narrow" spacing="compact" variant="plain">
        <div>
          <Surface variant="elevated">
            <ForgotPasswordForm />
          </Surface>
        </div>
      </SectionShell>
    </PageFrame>
  )
}

export const metadata: Metadata = {
  description: 'Enter your email address to recover your password.',
  openGraph: mergeOpenGraph({
    title: 'Forgot Password',
    url: '/forgot-password',
  }),
  title: 'Forgot Password',
}
