import 'dotenv/config'

import { fileURLToPath } from 'node:url'

import { getPayload } from 'payload'

type DocID = number

type NamedSeed = {
  slug: string
  title: string
  description?: string
}

type ProductSeed = {
  attributes: string[]
  category: string
  color: string
  description: string
  family?: string
  growthRate?: 'cepat' | 'lambat' | 'sedang'
  idealSoil?: string
  inventory: number
  nameLatin?: string
  metaDescription: string
  nativeRegion?: string
  orderType?: 'keduanya' | 'langsung' | 'rfq'
  originLocation?: string
  plantCondition?: 'bibit' | 'remaja' | 'siap-tanam'
  plantHeight?: string
  plantSpread?: string
  priceInUSD: number
  productNote?: string
  qualityNote?: string
  slug: string
  specialFeature?: string
  availabilityStatus?: 'habis' | 'konsultasikan' | 'tersedia'
  supplyNote?: string
  sunRequirement?: 'full-shade' | 'full-sun' | 'partial-shade'
  title: string
  useCases: string[]
  waterRequirement?: 'rendah' | 'sedang' | 'tinggi'
}

const categorySeeds: NamedSeed[] = [
  { slug: 'tanaman-pelindung', title: 'Tanaman Pelindung', description: 'Tanaman pelindung untuk proyek, boulevard, dan penghijauan kawasan.' },
  { slug: 'palem', title: 'Tanaman Palem', description: 'Kelompok palem untuk aksen lanskap dan kebutuhan proyek.' },
  { slug: 'semak-perdu', title: 'Tanaman Semak & Perdu', description: 'Semak dan perdu untuk pagar hidup, border, dan elemen massa hijau.' },
  { slug: 'rambat', title: 'Tanaman Rambat', description: 'Tanaman rambat untuk pagar, dinding hijau, dan kebutuhan visual proyek.' },
  { slug: 'ground-cover', title: 'Ground Cover / Tanaman Penutup Tanah', description: 'Tanaman penutup tanah untuk median, lereng, taman, dan penghijauan.' },
]

const attributeSeeds: NamedSeed[] = [
  { slug: 'berbunga', title: 'Berbunga' },
  { slug: 'indoor', title: 'Indoor' },
  { slug: 'outdoor', title: 'Outdoor' },
  { slug: 'tahan-panas', title: 'Tahan Panas' },
  { slug: 'gantung', title: 'Gantung' },
  { slug: 'low-maintenance', title: 'Low Maintenance' },
]

const useCaseSeeds: NamedSeed[] = [
  { slug: 'pagar-hidup', title: 'Pagar Hidup' },
  { slug: 'border', title: 'Border' },
  { slug: 'median-penghijauan', title: 'Median & Penghijauan' },
  { slug: 'focal-point', title: 'Focal Point' },
]

const productSeeds: ProductSeed[] = [
  {
    title: 'Pule',
    slug: 'pule',
    nameLatin: 'Alstonia scholaris',
    category: 'tanaman-pelindung',
    attributes: ['outdoor'],
    useCases: ['focal-point'],
    priceInUSD: 8500,
    inventory: 24,
    color: '#1F5D3A',
    availabilityStatus: 'konsultasikan',
    orderType: 'rfq',
    sunRequirement: 'full-sun',
    waterRequirement: 'sedang',
    growthRate: 'sedang',
    plantCondition: 'siap-tanam',
    family: 'Apocynaceae',
    nativeRegion: 'Asia Tropis',
    plantHeight: 'Hingga 10 meter',
    plantSpread: '3-6 meter',
    idealSoil: 'Tanah gembur dengan drainase baik',
    specialFeature: 'Tajuk rindang dan kuat untuk aksen lanskap',
    originLocation: 'Kebun anggota Cipanas, Cianjur',
    supplyNote:
      'Pule disupply dari jaringan kebun anggota BMJ dan biasanya perlu konfirmasi ukuran aktual sebelum penawaran.',
    qualityNote:
      'Tanaman diperiksa kesehatan batang, akar, dan daun sebelum diproses untuk pengiriman.',
    productNote:
      'Produk ini umumnya membutuhkan konsultasi ukuran dan kesiapan supply sebelum transaksi final.',
    description:
      'Pule adalah contoh tanaman pelindung untuk kebutuhan lanskap proyek. Produk sample ini dipakai untuk menguji category, attribute, dan use case BMJ di shop.',
    metaDescription:
      'Contoh produk BMJ untuk category Tanaman Pelindung. Cocok dipakai menguji taxonomy dan filtering shop.',
  },
  {
    title: 'Palem Raja',
    slug: 'palem-raja',
    nameLatin: 'Roystonea regia',
    category: 'palem',
    attributes: ['outdoor'],
    useCases: ['focal-point'],
    priceInUSD: 9600,
    inventory: 18,
    color: '#2E7D32',
    availabilityStatus: 'tersedia',
    orderType: 'rfq',
    sunRequirement: 'full-sun',
    waterRequirement: 'sedang',
    growthRate: 'sedang',
    plantCondition: 'siap-tanam',
    family: 'Arecaceae',
    nativeRegion: 'Karibia',
    plantHeight: '8-15 meter',
    plantSpread: '2-4 meter',
    idealSoil: 'Tanah subur dengan drainase baik',
    specialFeature: 'Siluet vertikal kuat untuk focal point dan boulevard',
    originLocation: 'Kawasan Pacet-Cipanas, Cianjur',
    supplyNote:
      'Palem raja tersedia dari beberapa kebun anggota, namun ukuran besar biasanya memerlukan penjadwalan.',
    qualityNote:
      'Setiap tanaman diseleksi berdasarkan kerapian batang dan kondisi pelepah.',
    description:
      'Palem Raja digunakan sebagai produk sample untuk category Tanaman Palem. Dipakai untuk menguji listing, filter attribute, dan use case proyek.',
    metaDescription:
      'Contoh produk BMJ untuk category Tanaman Palem. Dipakai sebagai sample data shop project.',
  },
  {
    title: 'Teh-Tehan',
    slug: 'teh-tehan',
    nameLatin: 'Acalypha siamensis',
    category: 'semak-perdu',
    attributes: ['outdoor', 'low-maintenance'],
    useCases: ['pagar-hidup', 'border'],
    priceInUSD: 2100,
    inventory: 120,
    color: '#507D2A',
    availabilityStatus: 'tersedia',
    orderType: 'keduanya',
    sunRequirement: 'full-sun',
    waterRequirement: 'sedang',
    growthRate: 'cepat',
    plantCondition: 'siap-tanam',
    family: 'Euphorbiaceae',
    nativeRegion: 'Asia Tenggara',
    plantHeight: '1-3 meter',
    plantSpread: '0.5-1.5 meter',
    idealSoil: 'Tanah liat berpasir dengan drainase baik',
    specialFeature: 'Tumbuh cepat dan mudah dibentuk untuk pagar hidup',
    originLocation: 'Kebun anggota Cipanas, Cianjur',
    supplyNote:
      'Teh-tehan merupakan salah satu tanaman dengan supply paling stabil di jaringan BMJ untuk kebutuhan proyek skala besar.',
    qualityNote:
      'Tanaman diperiksa kerapatan daun dan kesehatan akar sebelum dikirim.',
    description:
      'Teh-Tehan adalah sample untuk category Tanaman Semak & Perdu. Cocok dipakai menguji kombinasi use case pagar hidup dan border.',
    metaDescription:
      'Contoh produk BMJ untuk category Tanaman Semak & Perdu dengan use case pagar hidup dan border.',
  },
  {
    title: 'Air Mata Pengantin',
    slug: 'air-mata-pengantin',
    nameLatin: 'Antigonon leptopus',
    category: 'rambat',
    attributes: ['berbunga', 'gantung'],
    useCases: ['pagar-hidup', 'border'],
    priceInUSD: 1800,
    inventory: 90,
    color: '#A23B72',
    availabilityStatus: 'tersedia',
    orderType: 'keduanya',
    sunRequirement: 'full-sun',
    waterRequirement: 'sedang',
    growthRate: 'cepat',
    plantCondition: 'siap-tanam',
    family: 'Polygonaceae',
    nativeRegion: 'Amerika Tengah',
    plantHeight: 'Sulur 1-3 meter',
    plantSpread: 'Menyebar mengikuti penyangga',
    idealSoil: 'Tanah gembur dan cukup lembap',
    specialFeature: 'Bunga menarik dan pertumbuhan cepat pada pagar atau trellis',
    originLocation: 'Kebun anggota Cipanas, Cianjur',
    supplyNote:
      'Air Mata Pengantin tersedia dari beberapa kebun anggota dan cocok untuk supply retail maupun proyek kecil-menengah.',
    qualityNote:
      'Setiap tanaman dicek kekuatan sulur dan kondisi media tanam sebelum pengiriman.',
    description:
      'Air Mata Pengantin adalah sample untuk category Tanaman Rambat. Produk ini dipakai untuk menguji attribute berbunga dan gantung.',
    metaDescription:
      'Contoh produk BMJ untuk category Tanaman Rambat dengan attribute berbunga dan use case pagar hidup.',
  },
  {
    title: 'Wedelia',
    slug: 'wedelia',
    nameLatin: 'Sphagneticola trilobata',
    category: 'ground-cover',
    attributes: ['outdoor', 'low-maintenance', 'tahan-panas'],
    useCases: ['border', 'median-penghijauan'],
    priceInUSD: 1300,
    inventory: 300,
    color: '#D9B310',
    availabilityStatus: 'tersedia',
    orderType: 'langsung',
    sunRequirement: 'full-sun',
    waterRequirement: 'rendah',
    growthRate: 'cepat',
    plantCondition: 'siap-tanam',
    family: 'Asteraceae',
    nativeRegion: 'Amerika Tropis',
    plantHeight: '15-30 cm',
    plantSpread: 'Menyebar cepat',
    idealSoil: 'Toleran berbagai jenis tanah dengan drainase cukup',
    specialFeature: 'Tahan panas dan cepat menutup area terbuka',
    originLocation: 'Kawasan Cipanas, Cianjur',
    supplyNote:
      'Wedelia merupakan salah satu tanaman ground cover yang paling siap untuk kebutuhan supply volume besar.',
    qualityNote:
      'Tanaman dipilih dari batch yang sehat dan seragam untuk menjaga kualitas hamparan saat tanam.',
    description:
      'Wedelia adalah sample untuk category Ground Cover / Tanaman Penutup Tanah. Dipakai untuk menguji kombinasi filtering pada area median dan penghijauan.',
    metaDescription:
      'Contoh produk BMJ untuk category Ground Cover / Tanaman Penutup Tanah dengan use case median dan penghijauan.',
  },
]

const richText = (text: string): any => ({
  root: {
    children: [
      {
        children: [
          {
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text,
            type: 'text',
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'paragraph',
        version: 1,
        textFormat: 0,
        textStyle: '',
      },
    ],
    direction: 'ltr',
    format: '',
    indent: 0,
    type: 'root',
    version: 1,
  },
})

const escapeXml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')

const createSvgBuffer = (label: string, color: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 1200 1200">
  <rect width="1200" height="1200" fill="${color}" />
  <rect x="80" y="80" width="1040" height="1040" rx="48" fill="rgba(255,255,255,0.12)" />
  <text x="100" y="560" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="88" font-weight="700">${escapeXml(
    label,
  )}</text>
  <text x="100" y="660" fill="rgba(255,255,255,0.8)" font-family="Arial, Helvetica, sans-serif" font-size="36">BMJ Sample Product</text>
</svg>`

  return Buffer.from(svg, 'utf8')
}

async function upsertNamedDoc(
  payload: Awaited<ReturnType<typeof getPayload>>,
  collection: 'categories' | 'productAttributes' | 'productUseCases',
  seed: NamedSeed,
) {
  const existing = await payload.find({
    collection,
    depth: 0,
    limit: 1,
    overrideAccess: true,
    pagination: false,
    where: {
      slug: {
        equals: seed.slug,
      },
    },
  })

  const existingDoc = existing.docs[0]

  if (existingDoc) {
    return payload.update({
      collection,
      id: existingDoc.id,
      data: {
        title: seed.title,
        ...(seed.description ? { description: seed.description } : {}),
        slug: seed.slug,
      },
      overrideAccess: true,
    })
  }

  return payload.create({
    collection,
    data: {
      title: seed.title,
      ...(seed.description ? { description: seed.description } : {}),
      slug: seed.slug,
    },
    overrideAccess: true,
  })
}

async function upsertMedia(
  payload: Awaited<ReturnType<typeof getPayload>>,
  args: {
    alt: string
    color: string
    filename: string
    label: string
  },
) {
  const existing = await payload.find({
    collection: 'media',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    pagination: false,
    where: {
      filename: {
        equals: args.filename,
      },
    },
  })

  const existingDoc = existing.docs[0]

  if (existingDoc) {
    return existingDoc
  }

  const data = createSvgBuffer(args.label, args.color)

  return payload.create({
    collection: 'media',
    data: {
      alt: args.alt,
    },
    file: {
      name: args.filename,
      data,
      mimetype: 'image/svg+xml',
      size: data.byteLength,
    },
    overrideAccess: true,
  })
}

async function upsertProduct(
  payload: Awaited<ReturnType<typeof getPayload>>,
  args: {
    attributeIDs: DocID[]
    categoryID: DocID
    mediaID: DocID
    product: ProductSeed
    useCaseIDs: DocID[]
  },
) {
  const existing = await payload.find({
    collection: 'products',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    pagination: false,
    where: {
      slug: {
        equals: args.product.slug,
      },
    },
  })

  const data: any = {
    _status: 'published' as const,
    attributes: args.attributeIDs,
    categories: [args.categoryID],
    description: richText(args.product.description),
    family: args.product.family,
    enableVariants: false,
    gallery: [{ image: args.mediaID }],
    growthRate: args.product.growthRate,
    idealSoil: args.product.idealSoil,
    inventory: args.product.inventory,
    layout: [],
    meta: {
      title: `${args.product.title} | BMJ Sample Product`,
      image: args.mediaID,
      description: args.product.metaDescription,
    },
    nameLatin: args.product.nameLatin,
    nativeRegion: args.product.nativeRegion,
    orderType: args.product.orderType || 'keduanya',
    originLocation: args.product.originLocation,
    plantCondition: args.product.plantCondition,
    plantHeight: args.product.plantHeight,
    plantSpread: args.product.plantSpread,
    priceInUSD: args.product.priceInUSD,
    priceInUSDEnabled: true,
    productNote: args.product.productNote,
    qualityNote: args.product.qualityNote,
    relatedProducts: [],
    slug: args.product.slug,
    specialFeature: args.product.specialFeature,
    availabilityStatus: args.product.availabilityStatus || 'tersedia',
    supplyNote: args.product.supplyNote,
    sunRequirement: args.product.sunRequirement,
    title: args.product.title,
    useCases: args.useCaseIDs,
    waterRequirement: args.product.waterRequirement,
  }

  const existingDoc = existing.docs[0]

  if (existingDoc) {
    return payload.update({
      collection: 'products',
      id: existingDoc.id,
      data,
      overrideAccess: true,
    })
  }

  return payload.create({
    collection: 'products',
    data,
    overrideAccess: true,
  })
}

export async function run() {
  console.log('[bmj-shop-samples] loading payload config')
  const { default: config } = await import('../src/payload.config')
  const payload = await getPayload({ config: await config })
  console.log('[bmj-shop-samples] payload initialized')

  const categories = new Map<string, DocID>()
  const attributes = new Map<string, DocID>()
  const useCases = new Map<string, DocID>()

  for (const seed of categorySeeds) {
    const doc = await upsertNamedDoc(payload, 'categories', seed)
    categories.set(seed.slug, doc.id as DocID)
    console.log(`[category] upserted ${seed.slug}`)
  }

  for (const seed of attributeSeeds) {
    const doc = await upsertNamedDoc(payload, 'productAttributes', seed)
    attributes.set(seed.slug, doc.id as DocID)
    console.log(`[attribute] upserted ${seed.slug}`)
  }

  for (const seed of useCaseSeeds) {
    const doc = await upsertNamedDoc(payload, 'productUseCases', seed)
    useCases.set(seed.slug, doc.id as DocID)
    console.log(`[usecase] upserted ${seed.slug}`)
  }

  for (const product of productSeeds) {
    const media = await upsertMedia(payload, {
      alt: `${product.title} sample image`,
      color: product.color,
      filename: `bmj-sample-${product.slug}.svg`,
      label: product.title,
    })

    const categoryID = categories.get(product.category)
    if (!categoryID) {
      throw new Error(`Missing category seed for ${product.category}`)
    }

    const attributeIDs = product.attributes.map((slug) => {
      const id = attributes.get(slug)
      if (!id) throw new Error(`Missing attribute seed for ${slug}`)
      return id
    })

    const useCaseIDs = product.useCases.map((slug) => {
      const id = useCases.get(slug)
      if (!id) throw new Error(`Missing use case seed for ${slug}`)
      return id
    })

    await upsertProduct(payload, {
      attributeIDs,
      categoryID,
      mediaID: media.id as DocID,
      product,
      useCaseIDs,
    })

    console.log(`[product] upserted ${product.slug}`)
  }

  console.log('[bmj-shop-samples] done')
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  run()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('[bmj-shop-samples] failed')
      console.error(error)
      process.exit(1)
    })
}
