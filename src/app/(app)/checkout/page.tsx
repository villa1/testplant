import type { Metadata } from 'next'

import { PageFrame } from '@/components/layout/PageFrame'
import { SectionShell } from '@/components/layout/SectionShell'
import { Surface } from '@/components/layout/Surface'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import React, { Fragment } from 'react'

import { CheckoutPage } from '@/components/checkout/CheckoutPage'

export default function Checkout() {
  return (
    <PageFrame family="utility">
      <SectionShell containment="wide" spacing="compact" variant="plain">
        <div className="min-h-[70vh]">
          {!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && (
            <Surface className="mb-8 max-w-3xl" variant="flat">
              <p className="leading-7 text-primary/75">
                <Fragment>
                  {'To enable checkout, you must '}
                  <a
                    className="font-medium text-primary hover:underline"
                    href="https://dashboard.stripe.com/test/apikeys"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    obtain your Stripe API Keys
                  </a>
                  {' then set them as environment variables. See the '}
                  <a
                    className="font-medium text-primary hover:underline"
                    href="https://github.com/payloadcms/payload/blob/3.x/templates/ecommerce/README.md#stripe"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    README
                  </a>
                  {' for more details.'}
                </Fragment>
              </p>
            </Surface>
          )}

          <h1 className="sr-only">Checkout</h1>

          <CheckoutPage />
        </div>
      </SectionShell>
    </PageFrame>
  )
}

export const metadata: Metadata = {
  description: 'Checkout.',
  openGraph: mergeOpenGraph({
    title: 'Checkout',
    url: '/checkout',
  }),
  title: 'Checkout',
}
