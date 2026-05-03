'use client'

import { AccountPanel } from '@/components/Header/AccountPanel'
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

const utilityButtonClass =
  'flex h-10 w-10 items-center justify-center rounded-full border border-black/8 bg-white text-foreground/72 shadow-[0_8px_18px_rgba(15,23,42,0.06)] transition-colors hover:border-[#1ca336]/30 hover:text-[#11942b]'

export function HeaderClient({ header }: Props) {
  const pathname = usePathname()
  const { identity, navItems } = header
  const prefersLogoWordmark = identity.effectiveMode === 'logo' || identity.effectiveMode === 'logoText'
  const displayBrandName = identity.brandName.replace(/^PT\s+/i, '')

  return (
    <header className="sticky top-0 z-30 border-b border-black/6 bg-white/96 shadow-[0_8px_28px_rgba(15,23,42,0.05)] backdrop-blur">
      <nav className="container flex items-center justify-between gap-3 py-3 md:gap-6 md:py-5">
        <div className="block flex-none lg:hidden">
          <Suspense fallback={null}>
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
                <div className="hidden xl:flex xl:min-w-0 xl:flex-col">
                  <span className="max-w-[11ch] whitespace-normal font-serif text-[1.22rem] font-semibold leading-[0.96] tracking-tight text-[#169a2f]">
                    {displayBrandName}
                  </span>
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
                        'rounded-full px-4 py-2.5 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-[#12992d] text-white shadow-[0_10px_18px_rgba(18,153,45,0.22)]'
                          : 'text-foreground/72 hover:bg-[#f3f8f1] hover:text-foreground',
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
