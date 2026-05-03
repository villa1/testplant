import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)
import { redirects } from './redirects'

const NEXT_PUBLIC_SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
const PAYLOAD_PUBLIC_SERVER_URL = process.env.PAYLOAD_PUBLIC_SERVER_URL || ''

const imageRemoteOrigins = Array.from(
  new Set(
    [
      NEXT_PUBLIC_SERVER_URL,
      PAYLOAD_PUBLIC_SERVER_URL,
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3001',
    ].filter(Boolean),
  ),
)

const imageRemotePatterns = imageRemoteOrigins.map((item) => {
  const url = new URL(item)

  return {
    hostname: url.hostname,
    pathname: '/**',
    port: url.port || undefined,
    protocol: url.protocol.replace(':', '') as 'http' | 'https',
  }
})

const nextConfig: NextConfig = {
  // Temporarily required on Windows until Next.js fixes Turbopack Sass resolution.
  // See: https://github.com/vercel/next.js/issues/86431
  sassOptions: {
    loadPaths: ['./node_modules/@payloadcms/ui/dist/scss/'],
  },
  images: {
    // Temporary dev-only allowance so Payload media served from localhost is not blocked
    // by Next.js private-IP protection during local development.
    dangerouslyAllowLocalIP: true,
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
      {
        pathname: '/api/media/**',
      },
      {
        pathname: '/media/**',
      },
    ],
    qualities: [90, 100],
    remotePatterns: imageRemotePatterns,
  },
  reactStrictMode: true,
  redirects,
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withPayload(nextConfig)
