import React from 'react'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import ShopLayout from '@/app/(app)/shop/layout'

vi.mock('@/components/Search', () => ({
  Search: ({ className }: { className?: string }) => <div className={className}>Search</div>,
}))

vi.mock('@/components/layout/search/Categories', () => ({
  Categories: () => <div>Categories</div>,
}))

vi.mock('@/components/layout/search/Attributes', () => ({
  Attributes: () => <div>Attributes</div>,
}))

vi.mock('@/components/layout/search/UseCases', () => ({
  UseCases: () => <div>Use cases</div>,
}))

vi.mock('@/components/layout/search/filter', () => ({
  FilterList: ({ title }: { title: string }) => <div>{title}</div>,
}))

afterEach(() => {
  cleanup()
})

describe('ShopLayout', () => {
  it('wraps commerce pages in the canonical route shell', () => {
    const { container } = render(
      <ShopLayout>
        <div>Shop results</div>
      </ShopLayout>,
    )

    const pageFrame = container.querySelector('[data-page-frame="true"]')
    const sectionShell = container.querySelector('[data-section-shell="true"]')
    const shellInner = container.querySelector('.section-shell__inner')

    expect(pageFrame?.getAttribute('data-page-family')).toBe('commerce')
    expect(sectionShell?.getAttribute('data-section-variant')).toBe('plain')
    expect(sectionShell?.getAttribute('data-section-spacing')).toBe('compact')
    expect(sectionShell?.getAttribute('data-section-containment')).toBe('wide')
    expect(shellInner?.className).toContain('section-shell__inner--wide')

    expect(screen.getByText('Search')).toBeTruthy()
    expect(screen.getByText('Categories')).toBeTruthy()
    expect(screen.getByText('Attributes')).toBeTruthy()
    expect(screen.getByText('Use cases')).toBeTruthy()
    expect(screen.getByText('Urutkan')).toBeTruthy()
    expect(screen.getByText('Shop results')).toBeTruthy()
  })
})
