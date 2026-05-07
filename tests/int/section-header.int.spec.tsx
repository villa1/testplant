import React from 'react'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { SectionHeader } from '@/components/SectionHeader'

afterEach(() => {
  cleanup()
})

describe('SectionHeader', () => {
  it('renders the canonical default typography contract', () => {
    render(<SectionHeader intro="Intro copy" title="Section title" />)

    const header = screen.getByText('Section title').parentElement
    const title = screen.getByRole('heading', { level: 2, name: 'Section title' })
    const intro = screen.getByText('Intro copy')

    expect(header?.getAttribute('data-section-header')).toBe('true')
    expect(header?.className).toContain('section-header')
    expect(header?.className).toContain('section-header--left')
    expect(title.className).toContain('section-header__title')
    expect(title.className).toContain('section-header__title--md')
    expect(intro.className).toContain('section-header__intro')
  })

  it('supports eyebrow and alignment variants', () => {
    render(
      <SectionHeader
        align="center"
        eyebrow="Featured"
        headingSize="lg"
        intro="Aligned intro"
        title="Centered title"
      />,
    )

    const header = screen.getByText('Centered title').parentElement
    const eyebrow = screen.getByText('Featured')
    const title = screen.getByRole('heading', { level: 2, name: 'Centered title' })

    expect(header?.className).toContain('section-header--center')
    expect(eyebrow.className).toContain('section-header__eyebrow')
    expect(title.className).toContain('section-header__title--lg')
  })
})
