'use client'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useAuth } from '@/providers/Auth'
import { cn } from '@/utilities/cn'
import { UserRound } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

type Props = {
  className?: string
}

export function AccountPanel({ className }: Props) {
  const { user } = useAuth()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setIsOpen(false)
  }, [pathname, searchParams])

  return (
    <Sheet onOpenChange={setIsOpen} open={isOpen}>
      <SheetTrigger asChild>
        <button
          aria-label={user ? 'Buka menu akun' : 'Buka menu masuk'}
          className={cn(
            'site-header__utility-button flex h-10 w-10 items-center justify-center',
            className,
          )}
          type="button"
        >
          <UserRound className="h-[18px] w-[18px]" />
        </button>
      </SheetTrigger>

      <SheetContent className="w-full max-w-sm" side="right">
        <SheetHeader className="border-b border-black/6 pb-4">
          <SheetTitle>{user ? 'Akun Saya' : 'Masuk atau Daftar'}</SheetTitle>
          <SheetDescription>
            {user
              ? user.email || 'Kelola akun, alamat, dan pesanan Anda.'
              : 'Masuk untuk mengelola akun dan melanjutkan pembelian.'}
          </SheetDescription>
        </SheetHeader>

        {user ? (
          <div className="flex flex-col gap-3 px-4 pb-4">
            <Link
              className="rounded-full px-4 py-3 text-sm font-medium text-foreground/82 transition-colors hover:bg-[#f3f8f1] hover:text-foreground"
              href="/account"
            >
              Account settings
            </Link>
            <Link
              className="rounded-full px-4 py-3 text-sm font-medium text-foreground/82 transition-colors hover:bg-[#f3f8f1] hover:text-foreground"
              href="/account/addresses"
            >
              Addresses
            </Link>
            <Link
              className="rounded-full px-4 py-3 text-sm font-medium text-foreground/82 transition-colors hover:bg-[#f3f8f1] hover:text-foreground"
              href="/orders"
            >
              Orders
            </Link>
            <div className="pt-2">
              <Button asChild className="w-full rounded-full" variant="outline">
                <Link href="/logout">Log out</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3 px-4 pb-4">
            <Button asChild className="w-full rounded-full bg-[#617553] hover:bg-[#516347]">
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild className="w-full rounded-full" variant="outline">
              <Link href="/create-account">Create account</Link>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
