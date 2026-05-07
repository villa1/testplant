import React from 'react'

import { SectionShell } from '@/components/layout/SectionShell'
import { Surface } from '@/components/layout/Surface'
import type { ContactDetailsBlock as ContactDetailsBlockProps } from '@/payload-types'

import { SectionHeader } from '@/components/SectionHeader'

const detailItems = (
  phoneNumber: string,
  email: string,
  address: string,
  businessHours: string,
) => [
  {
    label: 'Telepon / WhatsApp',
    value: phoneNumber,
  },
  {
    label: 'Email',
    value: email,
  },
  {
    label: 'Alamat',
    value: address,
  },
  {
    label: 'Jam Operasional',
    value: businessHours,
  },
]

type Props = ContactDetailsBlockProps & {
  id?: string
}

export const ContactDetailsBlock: React.FC<Props> = ({
  address,
  businessHours,
  email,
  id,
  intro,
  phoneNumber,
  title,
}) => {
  return (
    <SectionShell id={id} spacing="compact" variant="plain">
      <SectionHeader intro={intro} title={title} />

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {detailItems(phoneNumber, email, address, businessHours).map((item) => (
          <Surface key={item.label}>
            <div className="text-sm font-medium text-muted-foreground">{item.label}</div>
            <div className="mt-3 text-base leading-7">{item.value}</div>
          </Surface>
        ))}
      </div>
    </SectionShell>
  )
}
