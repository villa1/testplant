import React from 'react'

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

export const ContactDetailsBlock: React.FC<ContactDetailsBlockProps> = ({
  address,
  businessHours,
  email,
  intro,
  phoneNumber,
  title,
}) => {
  return (
    <section className="container">
      <SectionHeader intro={intro} title={title} />

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {detailItems(phoneNumber, email, address, businessHours).map((item) => (
          <div className="rounded-xl border border-border bg-card p-6" key={item.label}>
            <div className="text-sm font-medium text-muted-foreground">{item.label}</div>
            <div className="mt-3 text-base leading-7">{item.value}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
