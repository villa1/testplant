import React from 'react'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import NotFound from '@/app/(app)/not-found'

afterEach(() => {
  cleanup()
})

describe('NotFound route shell', () => {
  it('uses the canonical utility page shell with narrow containment', () => {
    const { container } = render(<NotFound />)

    const pageFrame = container.querySelector('[data-page-frame="true"]')
    const sectionShell = container.querySelector('[data-section-shell="true"]')
    const shellInner = container.querySelector('.section-shell__inner')

    expect(pageFrame?.getAttribute('data-page-family')).toBe('utility')
    expect(sectionShell?.getAttribute('data-section-variant')).toBe('plain')
    expect(sectionShell?.getAttribute('data-section-spacing')).toBe('compact')
    expect(sectionShell?.getAttribute('data-section-containment')).toBe('narrow')
    expect(shellInner?.className).toContain('section-shell__inner--narrow')

    expect(screen.getByRole('heading', { level: 1, name: '404' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Go home' })).toBeTruthy()
  })
})
