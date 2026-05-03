import React from 'react'

type SectionHeaderProps = {
  title: string
  intro?: string | null
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, intro }) => {
  return (
    <div className="space-y-3">
      <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
      {intro ? <p className="max-w-3xl text-base leading-7 text-muted-foreground">{intro}</p> : null}
    </div>
  )
}
