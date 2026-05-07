import React from 'react'

import type { HomeIdentityBlock as HomeIdentityBlockProps } from '@/payload-types'

import { SectionShell } from '@/components/layout/SectionShell'
import { SectionHeader } from '@/components/SectionHeader'

type Props = HomeIdentityBlockProps & {
  id?: string
}

export const HomeIdentityBlock: React.FC<Props> = ({ body, id, title }) => {
  return (
    <SectionShell
      className="home-identity overflow-hidden"
      containment="contained"
      id={id}
      spacing="default"
      variant="tinted"
    >
      <div className="home-identity__panel">
        <SectionHeader
          className="home-identity__header"
          headingSize="lg"
          title={title}
          titleClassName="home-identity__title"
        />
        <div className="home-identity__body">
          <p className="home-identity__copy">{body}</p>
        </div>
      </div>
    </SectionShell>
  )
}
