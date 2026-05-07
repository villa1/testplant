import React from 'react'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { Surface } from '@/components/layout/Surface'

afterEach(() => {
  cleanup()
})

describe('Surface', () => {
  it('renders the canonical default surface contract', () => {
    render(<Surface>Default surface</Surface>)

    const surface = screen.getByText('Default surface')

    expect(surface.getAttribute('data-surface')).toBe('true')
    expect(surface.getAttribute('data-surface-variant')).toBe('default')
    expect(surface.className).toContain('surface')
    expect(surface.className).not.toContain('surface--elevated')
  })

  it('supports semantic variants and element overrides', () => {
    render(
      <Surface as="article" variant="elevated">
        Elevated surface
      </Surface>,
    )

    const surface = screen.getByText('Elevated surface')

    expect(surface.tagName).toBe('ARTICLE')
    expect(surface.getAttribute('data-surface-variant')).toBe('elevated')
    expect(surface.className).toContain('surface')
    expect(surface.className).toContain('surface--elevated')
  })
})
