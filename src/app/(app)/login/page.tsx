import type { Metadata } from 'next'

import { RenderParams } from '@/components/RenderParams'
import { PageFrame } from '@/components/layout/PageFrame'
import { SectionShell } from '@/components/layout/SectionShell'
import { Surface } from '@/components/layout/Surface'
import Link from 'next/link'
import React from 'react'

import { headers as getHeaders } from 'next/headers'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { LoginForm } from '@/components/forms/LoginForm'
import { redirect } from 'next/navigation'

export default async function Login() {
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
              <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Log in</h1>
              <p className="max-w-2xl text-base leading-7 text-primary/70">
                {`This is where your customers will login to manage their account, review their order history, and more. To manage all users, `}
                <Link className="font-medium text-primary hover:underline" href="/admin/collections/users">
                  login to the admin dashboard
                </Link>
                .
              </p>
            </div>

            <LoginForm />
          </Surface>
        </div>
      </SectionShell>
    </PageFrame>
  )
}

export const metadata: Metadata = {
  description: 'Login or create an account to get started.',
  openGraph: {
    title: 'Login',
    url: '/login',
  },
  title: 'Login',
}
