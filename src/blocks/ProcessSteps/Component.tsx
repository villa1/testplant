import React from 'react'
import { PhoneCall } from 'lucide-react'

import { SectionShell } from '@/components/layout/SectionShell'
import { Media } from '@/components/Media'
import { SectionHeader } from '@/components/SectionHeader'
import type { ProcessStepsBlock as ProcessStepsBlockProps } from '@/payload-types'
import { wordpressSectionNumber, wordpressSectionSans } from '@/fonts/wordpressSectionFonts'
import { cn } from '@/utilities/ui'

const PROCESS_STEP_ICON = '/leaf.svg'
const PROCESS_STEP_TRUCK_ICON = '/delivery-truck-fast-svgrepo-com.svg'

type Props = ProcessStepsBlockProps & {
  id?: string
}

type ProcessStepCardProps = {
  className?: string
  description: string
  stepNumber: string
  title: string
}

const isContactStep = (title: string, description: string) => {
  const text = `${title} ${description}`.toLowerCase()
  return /(hubungi|telepon|telpon|whatsapp|kontak|chat)/.test(text)
}

const isDeliveryStep = (title: string, description: string) => {
  const text = `${title} ${description}`.toLowerCase()
  return /(pengiriman|delivery|antar|transaksi|pengambilan|ambil|pickup|kirim)/.test(text)
}

const ProcessStepCard: React.FC<ProcessStepCardProps> = ({
  className,
  description,
  stepNumber,
  title,
}) => {
  const usePhoneIcon = isContactStep(title, description)
  const useTruckIcon = isDeliveryStep(title, description)

  return (
    <article
      className={cn(
        'relative flex h-full flex-col rounded-[8px] bg-[#354E33] px-7 pb-7 pt-6 text-white [font-family:var(--font-wordpress-section-sans)] max-[1280px]:px-[15px] max-[1280px]:pb-[15px] max-[1280px]:pt-[15px]',
        className,
      )}
    >
      <div className="mb-[18px] w-[50px] min-w-[50px]">
        {usePhoneIcon ? (
          <PhoneCall className="h-[44px] w-[44px] text-white" strokeWidth={1.8} />
        ) : useTruckIcon ? (
          <Media
            alt=""
            height={176}
            htmlElement={null}
            imgClassName="h-auto w-[52px]"
            src={PROCESS_STEP_TRUCK_ICON}
            width={349}
          />
        ) : (
          <Media
            alt=""
            height={807}
            htmlElement={null}
            imgClassName="h-auto w-[50px]"
            src={PROCESS_STEP_ICON}
            width={1000}
          />
        )}
      </div>

      <div className="absolute right-[23px] top-[23px] text-[16px] font-normal text-white [font-family:var(--font-wordpress-section-number)] max-[1280px]:right-[15px] max-[1280px]:top-[15px]">
        {stepNumber}
      </div>

      <div>
        <h3 className="mb-[14px] text-[20px] font-semibold leading-[1.35] tracking-[0.5px] text-white">
          {title}
        </h3>
        <p className="text-[16px] leading-[1.6] text-[rgba(255,255,255,0.75)]">{description}</p>
      </div>
    </article>
  )
}

export const ProcessStepsBlock: React.FC<Props> = ({ id, intro, steps, title }) => {
  const gridClassName =
    steps?.length === 4 ? 'md:grid-cols-2 xl:grid-cols-4' : 'md:grid-cols-2 xl:grid-cols-3'
  const hasThreeSteps = steps?.length === 3

  return (
    <SectionShell
      className="overflow-hidden"
      id={id}
      innerClassName={cn(wordpressSectionSans.variable, wordpressSectionNumber.variable)}
      spacing="compact"
      variant="plain"
    >
      <div className="space-y-10">
        <SectionHeader
          className="[font-family:var(--font-wordpress-section-sans)]"
          intro={intro}
          introClassName="max-w-3xl [font-family:var(--font-wordpress-section-sans)]"
          title={title}
          titleClassName="[font-family:var(--font-wordpress-section-sans)] font-medium"
        />

        <div className={cn('grid gap-[30px] max-[1280px]:gap-4', gridClassName)}>
          {steps?.map((step, index) => (
            <ProcessStepCard
              className={hasThreeSteps && index === steps.length - 1 ? 'md:col-span-2 xl:col-span-1' : undefined}
              description={step.description}
              key={index}
              stepNumber={String(index + 1).padStart(2, '0')}
              title={step.title}
            />
          ))}
        </div>
      </div>
    </SectionShell>
  )
}
