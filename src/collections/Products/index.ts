import { CallToAction } from '@/blocks/CallToAction/config'
import { Content } from '@/blocks/Content/config'
import { MediaBlock } from '@/blocks/MediaBlock/config'
import { slugField } from 'payload'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'
import { CollectionOverride } from '@payloadcms/plugin-ecommerce/types'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import {
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { DefaultDocumentIDType, Where } from 'payload'

const sunRequirementOptions = [
  { label: 'Full Sun', value: 'full-sun' },
  { label: 'Partial Shade', value: 'partial-shade' },
  { label: 'Full Shade', value: 'full-shade' },
]

const waterRequirementOptions = [
  { label: 'Rendah', value: 'rendah' },
  { label: 'Sedang', value: 'sedang' },
  { label: 'Tinggi', value: 'tinggi' },
]

const growthRateOptions = [
  { label: 'Lambat', value: 'lambat' },
  { label: 'Sedang', value: 'sedang' },
  { label: 'Cepat', value: 'cepat' },
]

const plantConditionOptions = [
  { label: 'Bibit', value: 'bibit' },
  { label: 'Remaja', value: 'remaja' },
  { label: 'Siap Tanam', value: 'siap-tanam' },
]

const productAvailabilityStatusOptions = [
  { label: 'Tersedia', value: 'tersedia' },
  { label: 'Stok Habis', value: 'habis' },
  { label: 'Konsultasikan Dulu', value: 'konsultasikan' },
]

const orderTypeOptions = [
  { label: 'Beli Langsung', value: 'langsung' },
  { label: 'Request Quotation', value: 'rfq' },
  { label: 'Keduanya', value: 'keduanya' },
]

export const ProductsCollection: CollectionOverride = ({ defaultCollection }) => ({
  ...defaultCollection,
  admin: {
    ...defaultCollection?.admin,
    defaultColumns: ['title', 'enableVariants', '_status', 'variants.variants'],
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'products',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'products',
        req,
      }),
    useAsTitle: 'title',
  },
  defaultPopulate: {
    ...defaultCollection?.defaultPopulate,
    title: true,
    slug: true,
    variantOptions: true,
    variants: true,
    enableVariants: true,
    gallery: true,
    priceInUSD: true,
    inventory: true,
    meta: true,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'nameLatin',
      type: 'text',
      admin: {
        description: 'Nama ilmiah tanaman. Opsional, tetapi kuat untuk sinyal expertise.',
      },
      label: 'Nama Latin / Ilmiah',
    },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [
            {
              name: 'description',
              type: 'richText',
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                    FixedToolbarFeature(),
                    InlineToolbarFeature(),
                    HorizontalRuleFeature(),
                  ]
                },
              }),
              label: false,
              required: false,
            },
            {
              name: 'gallery',
              type: 'array',
              minRows: 1,
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
                {
                  name: 'variantOption',
                  type: 'relationship',
                  relationTo: 'variantOptions',
                  admin: {
                    condition: (data) => {
                      return data?.enableVariants === true && data?.variantTypes?.length > 0
                    },
                  },
                  filterOptions: ({ data }) => {
                    if (data?.enableVariants && data?.variantTypes?.length) {
                      const variantTypeIDs = data.variantTypes.map((item: any) => {
                        if (typeof item === 'object' && item?.id) {
                          return item.id
                        }
                        return item
                      }) as DefaultDocumentIDType[]

                      if (variantTypeIDs.length === 0)
                        return {
                          variantType: {
                            in: [],
                          },
                        }

                      const query: Where = {
                        variantType: {
                          in: variantTypeIDs,
                        },
                      }

                      return query
                    }

                    return {
                      variantType: {
                        in: [],
                      },
                    }
                  },
                },
              ],
            },

            {
              name: 'layout',
              type: 'blocks',
              blocks: [CallToAction, Content, MediaBlock],
            },
          ],
          label: 'Content',
        },
        {
          fields: [
            ...defaultCollection.fields,
            {
              name: 'relatedProducts',
              type: 'relationship',
              filterOptions: ({ id }) => {
                if (id) {
                  return {
                    id: {
                      not_in: [id],
                    },
                  }
                }

                // ID comes back as undefined during seeding so we need to handle that case
                return {
                  id: {
                    exists: true,
                  },
                }
              },
              hasMany: true,
              relationTo: 'products',
            },
            {
              name: 'relatedArticles',
              type: 'relationship',
              admin: {
                description: 'Hubungkan artikel yang relevan untuk memperkuat topical authority.',
              },
              hasMany: true,
              relationTo: 'posts',
            },
            {
              type: 'collapsible',
              label: 'Karakteristik Fisik',
              fields: [
                {
                  name: 'sunRequirement',
                  type: 'select',
                  label: 'Kebutuhan Sinar Matahari',
                  options: sunRequirementOptions,
                },
                {
                  name: 'waterRequirement',
                  type: 'select',
                  label: 'Kebutuhan Air',
                  options: waterRequirementOptions,
                },
                {
                  name: 'growthRate',
                  type: 'select',
                  label: 'Kecepatan Tumbuh',
                  options: growthRateOptions,
                },
                {
                  name: 'plantCondition',
                  type: 'select',
                  label: 'Kondisi Tanaman',
                  options: plantConditionOptions,
                },
              ],
            },
            {
              type: 'collapsible',
              label: 'Botanical & Expertise',
              fields: [
                {
                  name: 'family',
                  type: 'text',
                  label: 'Famili Tanaman',
                },
                {
                  name: 'nativeRegion',
                  type: 'text',
                  label: 'Asal Geografis',
                },
                {
                  name: 'plantHeight',
                  type: 'text',
                  admin: {
                    placeholder: 'contoh: 2-5 meter',
                  },
                  label: 'Tinggi Dewasa',
                },
                {
                  name: 'plantSpread',
                  type: 'text',
                  admin: {
                    placeholder: 'contoh: 1-3 meter',
                  },
                  label: 'Lebar Tajuk Dewasa',
                },
                {
                  name: 'idealSoil',
                  type: 'text',
                  label: 'Tanah Ideal',
                },
                {
                  name: 'specialFeature',
                  type: 'text',
                  label: 'Keunikan / Fitur Khusus',
                },
              ],
            },
            {
              type: 'collapsible',
              label: 'Supply & Trust',
              fields: [
                {
                  name: 'originLocation',
                  type: 'text',
                  admin: {
                    placeholder: 'contoh: Kebun anggota Cipanas, Cianjur',
                  },
                  label: 'Asal Kebun',
                },
                {
                  name: 'supplyNote',
                  type: 'textarea',
                  label: 'Catatan Supply',
                },
                {
                  name: 'qualityNote',
                  type: 'textarea',
                  label: 'Standar Kualitas',
                },
                {
                  name: 'productNote',
                  type: 'textarea',
                  admin: {
                    description: 'Catatan penting yang perlu diketahui buyer sebelum membeli.',
                  },
                  label: 'Catatan untuk Buyer',
                },
              ],
            },
            {
              type: 'collapsible',
              label: 'Media Kontekstual',
              fields: [
                {
                  name: 'productGallery',
                  type: 'array',
                  label: 'Foto Kebun / Kontekstual',
                  fields: [
                    {
                      name: 'image',
                      type: 'upload',
                      relationTo: 'media',
                      required: true,
                    },
                  ],
                },
                {
                  name: 'videoUrl',
                  type: 'text',
                  admin: {
                    placeholder: 'https://www.youtube.com/watch?v=...',
                  },
                  label: 'URL Video',
                },
              ],
            },
          ],
          label: 'Product Details',
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),

            MetaDescriptionField({}),
            PreviewField({
              // if the `generateUrl` function is configured
              hasGenerateFn: true,

              // field paths to match the target field for data
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
            {
              name: 'canonicalUrl',
              type: 'text',
              admin: {
                description:
                  'Opsional. Isi hanya jika perlu canonical khusus untuk produk ini.',
                placeholder: 'https://example.com/products/nama-produk',
              },
              label: 'Canonical URL',
            },
          ],
        },
      ],
    },
    {
      name: 'categories',
      type: 'relationship',
      admin: {
        description: 'BMJ products should use one primary category only.',
        position: 'sidebar',
        sortOptions: 'title',
      },
      hasMany: true,
      required: true,
      relationTo: 'categories',
      validate: (value) => {
        if (Array.isArray(value) && value.length > 1) {
          return 'Select only one primary category.'
        }

        return true
      },
    },
    {
      name: 'attributes',
      type: 'relationship',
      admin: {
        position: 'sidebar',
        sortOptions: 'title',
      },
      hasMany: true,
      relationTo: 'productAttributes',
    },
    {
      name: 'useCases',
      type: 'relationship',
      admin: {
        position: 'sidebar',
        sortOptions: 'title',
      },
      hasMany: true,
      relationTo: 'productUseCases',
    },
    {
      name: 'availabilityStatus',
      type: 'select',
      admin: {
        position: 'sidebar',
      },
      defaultValue: 'tersedia',
      label: 'Status Produk',
      options: productAvailabilityStatusOptions,
      required: true,
    },
    {
      name: 'orderType',
      type: 'select',
      admin: {
        position: 'sidebar',
      },
      defaultValue: 'keduanya',
      label: 'Mekanisme Pembelian',
      options: orderTypeOptions,
      required: true,
    },
    slugField(),
  ],
})
