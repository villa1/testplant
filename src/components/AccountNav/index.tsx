'use client'

import { Button } from '@/components/ui/button'
import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type Props = {
  className?: string
}

export const AccountNav: React.FC<Props> = ({ className }) => {
  const pathname = usePathname()
  const itemClassName =
    'inline-flex w-full rounded-full px-4 py-2 text-sm font-medium transition-colors hover:bg-primary/8 hover:text-primary'

  return (
    <div className={clsx(className)}>
      <ul className="flex flex-col gap-2">
        <li>
          <Button asChild className="h-auto justify-start px-0" variant="link">
            <Link
              href="/account"
              className={clsx(itemClassName, 'text-primary/60 hover:no-underline', {
                'bg-primary/10 text-primary': pathname === '/account',
              })}
            >
              Account settings
            </Link>
          </Button>
        </li>

        <li>
          <Button asChild className="h-auto justify-start px-0" variant="link">
            <Link
              href="/account/addresses"
              className={clsx(itemClassName, 'text-primary/60 hover:no-underline', {
                'bg-primary/10 text-primary': pathname === '/account/addresses',
              })}
            >
              Addresses
            </Link>
          </Button>
        </li>

        <li>
          <Button
            asChild
            variant="link"
            className="h-auto justify-start px-0"
          >
            <Link
              href="/orders"
              className={clsx(itemClassName, 'text-primary/60 hover:no-underline', {
                'bg-primary/10 text-primary': pathname === '/orders' || pathname.includes('/orders'),
              })}
            >
              Orders
            </Link>
          </Button>
        </li>
      </ul>

      <hr className="w-full border-border/60" />

      <Button
        asChild
        variant="link"
        className="h-auto justify-start px-0"
      >
        <Link
          href="/logout"
          className={clsx(itemClassName, 'text-primary/60 hover:no-underline', {
            'bg-primary/10 text-primary': pathname === '/logout',
          })}
        >
          Log out
        </Link>
      </Button>
    </div>
  )
}
