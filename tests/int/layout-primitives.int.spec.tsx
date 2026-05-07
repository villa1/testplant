import React from 'react'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { PageFrame } from '@/components/layout/PageFrame'
import { SectionShell } from '@/components/layout/SectionShell'
import {
  isBaseSectionShellVariant,
  isDecorativeSectionShellVariant,
  isExpressivePageFrameFamily,
  isMinimalPageFrameFamily,
  isProsePageFrameFamily,
  isSurfaceShiftingSectionShellVariant,
  resolvePageFrameFamily,
  resolvePageFrameFamilyMeta,
  resolveSectionShellContainment,
  resolveSectionShellSpacing,
  resolveSectionShellVariant,
  resolveSectionShellVariantMeta,
} from '@/components/layout/layoutPrimitives.config'

afterEach(() => {
  cleanup()
})

describe('layout primitives config', () => {
  it('resolves canonical defaults', () => {
    expect(resolvePageFrameFamily()).toBe('marketing')
    expect(resolveSectionShellContainment()).toBe('contained')
    expect(resolveSectionShellContainment('wide')).toBe('wide')
    expect(resolveSectionShellContainment('reading')).toBe('reading')
    expect(resolveSectionShellSpacing()).toBe('compact')
    expect(resolveSectionShellVariant()).toBe('plain')
  })

  it('exposes family metadata helpers', () => {
    expect(resolvePageFrameFamilyMeta('homepage')).toEqual({
      expressive: true,
      tone: 'expressive',
    })
    expect(resolvePageFrameFamilyMeta('marketing')).toEqual({
      expressive: true,
      tone: 'expressive',
    })
    expect(isExpressivePageFrameFamily('marketing')).toBe(true)
    expect(isMinimalPageFrameFamily('utility')).toBe(true)
    expect(isProsePageFrameFamily('editorial')).toBe(true)
  })

  it('exposes shell metadata helpers', () => {
    expect(resolveSectionShellVariantMeta('patterned')).toEqual({
      decorative: true,
      role: 'surface-shift',
      surfaceShift: true,
    })
    expect(isDecorativeSectionShellVariant('image-band')).toBe(true)
    expect(isSurfaceShiftingSectionShellVariant('tinted')).toBe(true)
    expect(isBaseSectionShellVariant('plain')).toBe(true)
  })
})

describe('PageFrame', () => {
  it('renders canonical family metadata and classes', () => {
    render(
      <PageFrame family="editorial">
        <div>Editorial content</div>
      </PageFrame>,
    )

    const frame = screen.getByText('Editorial content').parentElement

    expect(frame).not.toBeNull()
    expect(frame?.getAttribute('data-page-frame')).toBe('true')
    expect(frame?.getAttribute('data-page-family')).toBe('editorial')
    expect(frame?.getAttribute('data-page-tone')).toBe('prose')
    expect(frame?.getAttribute('data-page-expressive')).toBe('false')
    expect(frame?.className).toContain('page-frame')
    expect(frame?.className).toContain('page-frame--editorial')
  })

  it('falls back to the canonical default family', () => {
    render(
      <PageFrame>
        <div>Default frame</div>
      </PageFrame>,
    )

    const frame = screen.getByText('Default frame').parentElement

    expect(frame?.getAttribute('data-page-family')).toBe('marketing')
    expect(frame?.getAttribute('data-page-tone')).toBe('expressive')
    expect(frame?.getAttribute('data-page-expressive')).toBe('true')
  })

  it('supports homepage as a first-class page family', () => {
    render(
      <PageFrame family="homepage">
        <div>Homepage frame</div>
      </PageFrame>,
    )

    const frame = screen.getByText('Homepage frame').parentElement

    expect(frame?.getAttribute('data-page-family')).toBe('homepage')
    expect(frame?.getAttribute('data-page-tone')).toBe('expressive')
    expect(frame?.getAttribute('data-page-expressive')).toBe('true')
    expect(frame?.className).toContain('page-frame--homepage')
  })

  it('supports hero-aware page opening contract', () => {
    render(
      <PageFrame family="marketing" hasHero>
        <div>Hero frame</div>
      </PageFrame>,
    )

    const frame = screen.getByText('Hero frame').parentElement

    expect(frame?.getAttribute('data-page-has-hero')).toBe('true')
    expect(frame?.className).toContain('page-frame--has-hero')
  })
})

describe('SectionShell', () => {
  it('renders canonical shell metadata and classes', () => {
    render(
      <SectionShell
        containment="wide"
        innerClassName="test-inner"
        spacing="compact"
        variant="patterned"
      >
        <div>Patterned section</div>
      </SectionShell>,
    )

    const inner = screen.getByText('Patterned section').parentElement
    const shell = inner?.parentElement

    expect(shell).not.toBeNull()
    expect(shell?.getAttribute('data-section-shell')).toBe('true')
    expect(shell?.getAttribute('data-section-variant')).toBe('patterned')
    expect(shell?.getAttribute('data-section-spacing')).toBe('compact')
    expect(shell?.getAttribute('data-section-containment')).toBe('wide')
    expect(shell?.getAttribute('data-section-role')).toBe('surface-shift')
    expect(shell?.getAttribute('data-section-decorative')).toBe('true')
    expect(shell?.getAttribute('data-section-surface-shift')).toBe('true')
    expect(shell?.className).toContain('section-shell')
    expect(shell?.className).toContain('section-shell--spacing-compact')
    expect(shell?.className).toContain('section-shell--variant-patterned')

    expect(inner?.className).toContain('test-inner')
    expect(inner?.className).toContain('section-shell__inner')
    expect(inner?.className).toContain('section-shell__inner--wide')
  })

  it('falls back to canonical defaults', () => {
    render(
      <SectionShell>
        <div>Default shell</div>
      </SectionShell>,
    )

    const inner = screen.getByText('Default shell').parentElement
    const shell = inner?.parentElement

    expect(shell?.getAttribute('data-section-variant')).toBe('plain')
    expect(shell?.getAttribute('data-section-spacing')).toBe('compact')
    expect(shell?.getAttribute('data-section-containment')).toBe('contained')
    expect(shell?.getAttribute('data-section-role')).toBe('base')
    expect(shell?.getAttribute('data-section-decorative')).toBe('false')
    expect(shell?.getAttribute('data-section-surface-shift')).toBe('false')
    expect(shell?.className).toContain('section-shell--spacing-compact')
    expect(shell?.className).toContain('section-shell--variant-plain')
    expect(inner?.className).toContain('section-shell__inner--contained')
  })
})
