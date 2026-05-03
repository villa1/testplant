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
        'relative h-10 w-10 rounded-full border-black/8 bg-white text-foreground/72 shadow-[0_8px_18px_rgba(15,23,42,0.06)] hover:border-[#1ca336]/30 hover:bg-white hover:text-[#11942b]',
        className,
      )}
      {...rest}
    >
      <ShoppingCart className="h-[18px] w-[18px]" />

      {quantity ? (
        <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-[#12992d] px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white">
          {quantity}
        </span>
      ) : null}
    </Button>
  )
}
