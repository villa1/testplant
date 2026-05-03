import { Clock3, Mail, MapPin, MessageCircleMore, Phone } from 'lucide-react'
import React from 'react'

import type { FooterContactBlock } from '@/Footer/types'

const normalizePhoneForHref = (value: string) => value.replace(/[^\d+]/g, '')

const getWhatsAppHref = (value: string) => {
  const digitsOnly = value.replace(/\D/g, '')

  if (!digitsOnly) {
    return null
  }

  if (digitsOnly.startsWith('62')) {
    return `https://wa.me/${digitsOnly}`
  }

  if (digitsOnly.startsWith('0')) {
    return `https://wa.me/62${digitsOnly.slice(1)}`
  }

  if (digitsOnly.startsWith('8')) {
    return `https://wa.me/62${digitsOnly}`
  }

  return `https://wa.me/${digitsOnly}`
}

export const FooterContactBlockComponent: React.FC<FooterContactBlock> = ({
  title,
  whatsappNumber,
  phoneNumber,
  email,
  address,
  mapsLabel,
  mapsUrl,
  operatingHours,
}) => {
  const whatsappHref = whatsappNumber ? getWhatsAppHref(whatsappNumber) : null
  const phoneHref = phoneNumber ? normalizePhoneForHref(phoneNumber) : null

  return (
    <div className="space-y-3">
      {title ? (
        <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-white/64">{title}</h2>
      ) : null}

      <div className="space-y-3 text-sm leading-7 text-white/78">
        {whatsappNumber ? (
          <div className="flex items-start gap-3">
            <MessageCircleMore className="mt-1 size-4 shrink-0" />
            {whatsappHref ? (
              <a className="hover:text-white" href={whatsappHref} rel="noreferrer" target="_blank">
                {whatsappNumber}
              </a>
            ) : (
              <span>{whatsappNumber}</span>
            )}
          </div>
        ) : null}

        {phoneNumber && phoneHref ? (
          <div className="flex items-start gap-3">
            <Phone className="mt-1 size-4 shrink-0" />
            <a className="hover:text-white" href={`tel:${phoneHref}`}>
              {phoneNumber}
            </a>
          </div>
        ) : null}

        {email ? (
          <div className="flex items-start gap-3">
            <Mail className="mt-1 size-4 shrink-0" />
            <a className="hover:text-white" href={`mailto:${email}`}>
              {email}
            </a>
          </div>
        ) : null}

        {address || mapsUrl ? (
          <div className="flex items-start gap-3">
            <MapPin className="mt-1 size-4 shrink-0" />
            <div className="space-y-1">
              {address ? <div>{address}</div> : null}
              {mapsUrl ? (
                <a
                  className="inline-block text-white hover:text-white/78"
                  href={mapsUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  {mapsLabel || 'Buka Lokasi'}
                </a>
              ) : null}
            </div>
          </div>
        ) : null}

        {operatingHours ? (
          <div className="flex items-start gap-3">
            <Clock3 className="mt-1 size-4 shrink-0" />
            <span>{operatingHours}</span>
          </div>
        ) : null}
      </div>
    </div>
  )
}
