import { Button } from '@/components/ui/button'
import clsx from 'clsx'
import { ShoppingCart } from 'lucide-react'
import React from 'react'

export function OpenCartButton({
  className,
  quantity,
  ...rest
}: React.ComponentProps<typeof Button> & {
  quantity?: number
}) {
  return (
    <Button
      aria-label={quantity ? `Cart with ${quantity} items` : 'Open cart'}
      variant="outline"
      size="icon"
      className={clsx(
        'site-header__utility-button relative h-10 w-10 hover:bg-white',
        className,
      )}
      {...rest}
    >
      <ShoppingCart className="h-[18px] w-[18px]" />

      {quantity ? (
        <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-[#617553] px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white">
          {quantity}
        </span>
      ) : null}
    </Button>
  )
}
