'use client'

import { Cart } from '@/components/Cart'
import { OpenCartButton } from '@/components/Cart/OpenCart'
import { Logo } from '@/components/Logo/Logo'
import { cn } from '@/utilities/cn'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { Suspense } from 'react'

import { MobileMenu } from './MobileMenu'
import type { NormalizedStorefrontHeader } from './normalize'

type Props = {
  header: NormalizedStorefrontHeader
}

const getLinkProps = (isExternal: boolean, newTab: boolean) =>
  isExternal || newTab ? { rel: 'noopener noreferrer', target: '_blank' as const } : {}

export function HeaderClient({ header }: Props) {
  const pathname = usePathname()
  const { identity, navItems } = header

  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/92 backdrop-blur">
      <nav className="container flex items-center justify-between gap-4 py-4">
        <div className="block flex-none md:hidden">
          <Suspense fallback={null}>
            <MobileMenu
              brandDescription={identity.brandDescription}
              brandName={identity.brandName}
              menu={navItems}
            />
          </Suspense>
        </div>

        <div className="flex min-w-0 flex-1 items-center justify-between gap-6">
          <Link className="min-w-0" href="/">
            <Logo
              brandDescription={identity.brandDescription}
              brandName={identity.brandName}
              brandingMode={identity.effectiveMode}
              className="text-foreground"
              logo={identity.logo}
              priority
            />
          </Link>

          {navItems.length ? (
            <ul className="hidden flex-1 justify-center gap-2 md:flex md:items-center">
              {navItems.map((item) => {
                const isActive =
                  !item.isExternal &&
                  (item.href === '/'
                    ? pathname === '/'
                    : pathname === item.href || pathname.startsWith(`${item.href}/`))

                return (
                  <li key={item.id}>
                    <Link
                      className={cn(
                        'rounded-full px-3 py-2 text-sm font-medium text-foreground/78 transition-colors hover:text-foreground',
                        isActive ? 'bg-foreground/6 text-foreground' : null,
                      )}
                      href={item.href}
                      {...getLinkProps(item.isExternal, item.newTab)}
                    >
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          ) : (
            <div className="hidden flex-1 md:block" />
          )}

          <div className="flex justify-end gap-4">
            <Suspense fallback={<OpenCartButton />}>
              <Cart />
            </Suspense>
          </div>
        </div>
      </nav>
    </header>
  )
}
