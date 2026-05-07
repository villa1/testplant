'use client'

import { AccountPanel } from '@/components/Header/AccountPanel'
import { Cart } from '@/components/Cart'
import { OpenCartButton } from '@/components/Cart/OpenCart'
import { Logo } from '@/components/Logo/Logo'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/utilities/cn'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { Suspense, useEffect, useState } from 'react'

import { MobileMenu } from './MobileMenu'
import type { NormalizedStorefrontHeader } from './normalize'

type Props = {
  header: NormalizedStorefrontHeader
}

const getLinkProps = (isExternal: boolean, newTab: boolean) =>
  isExternal || newTab ? { rel: 'noopener noreferrer', target: '_blank' as const } : {}

const utilityButtonClass = 'site-header__utility-button flex h-10 w-10 items-center justify-center'

export function HeaderClient({ header }: Props) {
  const pathname = usePathname()
  const { identity, navItems } = header
  const prefersLogoWordmark = identity.effectiveMode === 'logo' || identity.effectiveMode === 'logoText'
  const displayBrandName = identity.brandName.replace(/^PT\s+/i, '')
  const [isScrolled, setIsScrolled] = useState(false)
  const isHome = pathname === '/'

  useEffect(() => {
    const syncScrollState = () => {
      setIsScrolled(window.scrollY > 10)
    }

    syncScrollState()
    window.addEventListener('scroll', syncScrollState, { passive: true })

    return () => {
      window.removeEventListener('scroll', syncScrollState)
    }
  }, [])

  return (
    <header
      className={cn('site-header', isHome && !isScrolled ? 'site-header--overlay' : 'site-header--solid')}
    >
      <nav className="site-header__inner container flex items-center justify-between gap-3 md:gap-6">
        <div className="block flex-none lg:hidden">
          <Suspense fallback={<Skeleton className="h-10 w-10 rounded-full" />}>
            <MobileMenu
              brandDescription={identity.brandDescription}
              brandName={identity.brandName}
              menu={navItems}
            />
          </Suspense>
        </div>

        <div className="flex min-w-0 flex-1 items-center justify-between gap-3 md:gap-6">
          <Link className="min-w-0 flex-shrink-0" href="/">
            <div className="flex items-center gap-3">
              <Logo
                brandDescription={identity.brandDescription}
                brandName={identity.brandName}
                brandingMode={prefersLogoWordmark ? 'logo' : identity.effectiveMode}
                className="text-foreground"
                logo={identity.logo}
                priority
              />

              {prefersLogoWordmark ? (
                <div className="site-header__wordmark hidden xl:flex xl:min-w-0 xl:flex-col">
                  <span className="site-header__wordmark-name max-w-[14ch] whitespace-normal">
                    {displayBrandName}
                  </span>
                  {identity.brandDescription ? (
                    <span className="site-header__wordmark-tagline">{identity.brandDescription}</span>
                  ) : null}
                </div>
              ) : null}
            </div>
          </Link>

          {navItems.length ? (
            <ul className="hidden flex-1 justify-center gap-1 lg:flex lg:items-center xl:gap-2">
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
                        'site-header__nav-link',
                        isActive && 'site-header__nav-link--active',
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
            <div className="hidden flex-1 lg:block" />
          )}

          <div className="flex items-center justify-end gap-2 md:gap-3">
            <AccountPanel className={utilityButtonClass} />

            <Suspense fallback={<OpenCartButton />}>
              <Cart />
            </Suspense>
          </div>
        </div>
      </nav>
    </header>
  )
}
