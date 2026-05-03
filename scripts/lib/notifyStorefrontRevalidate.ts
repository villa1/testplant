type NotifyStorefrontRevalidateArgs = {
  globals?: string[]
  paths?: string[]
}

const baseURL =
  process.env.NEXT_PUBLIC_SERVER_URL || process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000'

export async function notifyStorefrontRevalidate({
  globals = [],
  paths = [],
}: NotifyStorefrontRevalidateArgs) {
  const secret = process.env.PAYLOAD_SECRET

  if (!secret) {
    console.warn('[revalidate] PAYLOAD_SECRET is missing, skipping storefront revalidation')
    return
  }

  try {
    const response = await fetch(`${baseURL}/next/revalidate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-revalidate-secret': secret,
      },
      body: JSON.stringify({
        globals,
        paths,
      }),
    })

    if (!response.ok) {
      const message = await response.text()
      throw new Error(`[revalidate] ${response.status} ${message}`)
    }

    console.log(`[revalidate] storefront invalidated via ${baseURL}/next/revalidate`)
  } catch (error) {
    console.warn('[revalidate] unable to invalidate storefront cache automatically')
    console.warn(error)
  }
}
