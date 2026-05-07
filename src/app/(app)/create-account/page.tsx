import type { Metadata } from 'next'

import { PageFrame } from '@/components/layout/PageFrame'
import { SectionShell } from '@/components/layout/SectionShell'
import { Surface } from '@/components/layout/Surface'
import { RenderParams } from '@/components/RenderParams'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import React from 'react'
import { headers as getHeaders } from 'next/headers'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { CreateAccountForm } from '@/components/forms/CreateAccountForm'
import { redirect } from 'next/navigation'

export default async function CreateAccount() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  if (user) {
    redirect(`/account?warning=${encodeURIComponent('You are already logged in.')}`)
  }

  return (
    <PageFrame family="utility">
      <SectionShell containment="narrow" spacing="compact" variant="plain">
        <div>
          <Surface className="space-y-8" variant="elevated">
            <RenderParams />
            <div className="space-y-4">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-primary/50">
                Akun BMJ
              </p>
              <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Create Account</h1>
              <p className="max-w-2xl text-base leading-7 text-primary/70">
                Buat akun untuk menyimpan alamat, melacak order, dan mempercepat proses checkout berikutnya.
              </p>
            </div>
            <CreateAccountForm />
          </Surface>
        </div>
      </SectionShell>
    </PageFrame>
  )
}

export const metadata: Metadata = {
  description: 'Create an account or log in to your existing account.',
  openGraph: mergeOpenGraph({
    title: 'Account',
    url: '/account',
  }),
  title: 'Account',
}
