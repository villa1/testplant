import config from '@payload-config'
import { headers } from 'next/headers'
import { getPayload } from 'payload'

import { checkRole } from '@/access/utilities'
import { revalidateStorefront } from '@/utilities/revalidateStorefront'

type RevalidateRequestBody = {
  globals?: unknown
  paths?: unknown
}

const toStringArray = (value: unknown) =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []

export async function POST(request: Request): Promise<Response> {
  const payload = await getPayload({ config })
  const requestHeaders = await headers()
  const body = ((await request.json().catch(() => ({}))) || {}) as RevalidateRequestBody

  const { user } = await payload.auth({ headers: requestHeaders })
  const secret = requestHeaders.get('x-revalidate-secret')
  const expectedSecret = process.env.PAYLOAD_SECRET

  const isAdmin = Boolean(user && checkRole(['admin'], user))
  const hasValidSecret = Boolean(expectedSecret && secret === expectedSecret)

  if (!isAdmin && !hasValidSecret) {
    return new Response('Action forbidden.', { status: 403 })
  }

  const globals = toStringArray(body.globals)
  const paths = toStringArray(body.paths)

  revalidateStorefront({
    globals: globals as Array<'footer' | 'header'>,
    paths,
  })

  return Response.json({
    globals,
    paths,
    revalidated: true,
  })
}
