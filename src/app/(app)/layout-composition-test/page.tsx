import type { Metadata } from 'next'

import { LayoutCompositionTestPage } from '@/components/layout/LayoutCompositionTestPage'

export const metadata: Metadata = {
  robots: {
    follow: false,
    index: false,
  },
  title: 'BMJ Layout Composition Test',
}

export default function LayoutCompositionPage() {
  return <LayoutCompositionTestPage />
}
