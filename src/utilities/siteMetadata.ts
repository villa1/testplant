const baseUrl =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  process.env.PAYLOAD_PUBLIC_SERVER_URL ||
  'http://localhost:3000'

export const siteMetadata = {
  baseUrl,
  defaultDescription:
    'PT Bumi Mekarsari Jaya adalah koordinator jaringan petani tanaman hias Cipanas untuk kebutuhan retail, proyek, dan supply tanaman skala besar.',
  locale: 'id_ID',
  siteName: 'PT Bumi Mekarsari Jaya',
}
