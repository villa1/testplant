import React from 'react'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { HeroShell } from '@/heros/HeroShell'

afterEach(() => {
  cleanup()
})

describe('HeroShell', () => {
  it('renders the canonical route hero contract', () => {
    render(<HeroShell>Hero shell content</HeroShell>)

    const content = screen.getByText('Hero shell content')
    const inner = content.closest('.section-shell__inner')
    const shell = content.closest('[data-section-shell="true"]')

    expect(shell?.getAttribute('data-section-shell')).toBe('true')
    expect(shell?.getAttribute('data-section-variant')).toBe('hero')
    expect(shell?.getAttribute('data-section-spacing')).toBe('none')
    expect(shell?.className).toContain('hero-shell')
    expect(inner?.className).toContain('hero-shell__inner')
  })

  it('supports containment overrides for full-bleed route heroes', () => {
    render(<HeroShell containment="full-bleed">Full bleed hero</HeroShell>)

    const content = screen.getByText('Full bleed hero')
    const inner = content.closest('.section-shell__inner')
    const shell = content.closest('[data-section-shell="true"]')

    expect(shell?.getAttribute('data-section-containment')).toBe('full-bleed')
    expect(inner?.className).not.toContain('section-shell__inner--contained')
  })
})
