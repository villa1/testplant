import React from 'react'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { LayoutCompositionTestPage } from '@/components/layout/LayoutCompositionTestPage'

afterEach(() => {
  cleanup()
})

describe('LayoutCompositionTestPage', () => {
  it('renders a deterministic composition proof page under canonical layout laws', () => {
    const { container } = render(<LayoutCompositionTestPage />)

    const pageFrame = container.querySelector('[data-page-frame="true"]')
    const sectionShells = Array.from(container.querySelectorAll('[data-section-shell="true"]'))
    const sectionVariants = sectionShells.map((section) => section.getAttribute('data-section-variant'))

    expect(pageFrame?.getAttribute('data-page-family')).toBe('homepage')
    expect(pageFrame?.getAttribute('data-page-has-hero')).toBe('true')
    expect(sectionShells).toHaveLength(7)
    expect(sectionVariants).toEqual([
      'hero',
      'plain',
      'panel',
      'tinted',
      'patterned',
      'image-band',
      'plain',
    ])
    expect(sectionShells.every((section) => section.getAttribute('data-section-spacing'))).toBe(true)

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'BMJ Layout Composition Proof Page',
      }),
    ).toBeTruthy()
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Jika halaman ini terasa rapi, hukum layout bekerja',
      }),
    ).toBeTruthy()
  })
})
