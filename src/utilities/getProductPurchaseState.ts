import type { Product } from '@/payload-types'

type ProductAvailabilityStatus = NonNullable<Product['availabilityStatus']>
type ProductOrderType = NonNullable<Product['orderType']>

const fallbackAvailabilityStatus: ProductAvailabilityStatus = 'tersedia'
const fallbackOrderType: ProductOrderType = 'keduanya'

export const getProductPurchaseState = (
  product: {
    availabilityStatus?: Product['availabilityStatus']
    orderType?: Product['orderType']
  },
) => {
  const availabilityStatus = product.availabilityStatus || fallbackAvailabilityStatus
  const orderType = product.orderType || fallbackOrderType

  const isAvailable = availabilityStatus === 'tersedia'
  const isOutOfStock = availabilityStatus === 'habis'
  const needsConsultation = availabilityStatus === 'konsultasikan'

  const canDirectPurchase =
    isAvailable && (orderType === 'langsung' || orderType === 'keduanya')
  const canRequestQuote =
    orderType === 'rfq' ||
    orderType === 'keduanya' ||
    isOutOfStock ||
    needsConsultation

  const shouldShowPrice = isAvailable
  const shouldShowStock = canDirectPurchase

  let statusLabel: string | null = null

  if (isOutOfStock) {
    statusLabel = 'Stok Sedang Kosong'
  } else if (needsConsultation) {
    statusLabel = 'Ketersediaan Terbatas - Konsultasikan'
  } else if (orderType === 'rfq') {
    statusLabel = 'Tersedia untuk Request Quotation'
  } else if (orderType === 'keduanya') {
    statusLabel = 'Tersedia untuk Beli atau Request Quotation'
  }

  return {
    canDirectPurchase,
    canRequestQuote,
    isAvailable,
    isOutOfStock,
    needsConsultation,
    availabilityStatus,
    orderType,
    shouldShowPrice,
    shouldShowStock,
    statusLabel,
  }
}
