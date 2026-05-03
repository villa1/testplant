import type { CollectionConfig } from 'payload'

import { ArticleArchive } from '@/blocks/ArticleArchive/config'
import { AboutStatement } from '@/blocks/AboutStatement/config'
import { Banner } from '@/blocks/Banner/config'
import { BusinessAdvantages } from '@/blocks/BusinessAdvantages/config'
import { Carousel } from '@/blocks/Carousel/config'
import { ClosingCTA } from '@/blocks/ClosingCTA/config'
import { ThreeItemGrid } from '@/blocks/ThreeItemGrid/config'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'
import { adminOnly } from '@/access/adminOnly'
import { Archive } from '@/blocks/ArchiveBlock/config'
import { CallToAction } from '@/blocks/CallToAction/config'
import { ContactDetails } from '@/blocks/ContactDetails/config'
import { Content } from '@/blocks/Content/config'
import { DeliveryCoverage } from '@/blocks/DeliveryCoverage/config'
import { FormBlock } from '@/blocks/Form/config'
import { HomeHero } from '@/blocks/HomeHero/config'
import { HomeIdentity } from '@/blocks/HomeIdentity/config'
import { LegalFacts } from '@/blocks/LegalFacts/config'
import { LegalIndex } from '@/blocks/LegalIndex/config'
import { MapEmbed } from '@/blocks/MapEmbed/config'
import { MediaBlock } from '@/blocks/MediaBlock/config'
import { PreparationChecklist } from '@/blocks/PreparationChecklist/config'
import { ProcessSteps } from '@/blocks/ProcessSteps/config'
import { ProofGallery } from '@/blocks/ProofGallery/config'
import { SupplyCapacity } from '@/blocks/SupplyCapacity/config'
import { SupplyCategories } from '@/blocks/SupplyCategories/config'
import { TrustSignals } from '@/blocks/TrustSignals/config'
import { ValueStatement } from '@/blocks/ValueStatement/config'
import { VisitNote } from '@/blocks/VisitNote/config'
import { hero } from '@/fields/hero'
import { slugField } from 'payload'
import { adminOrPublishedStatus } from '@/access/adminOrPublishedStatus'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { revalidatePage, revalidateDelete } from './hooks/revalidatePage'

export const Pages: CollectionConfig = {
  slug: 'pages',
  access: {
    create: adminOnly,
    delete: adminOnly,
    read: adminOrPublishedStatus,
    update: adminOnly,
  },
  admin: {
    group: 'Content',
    defaultColumns: ['title', 'slug', 'pageType', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'pages',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'pages',
        req,
      }),
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'publishedOn',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [hero],
          label: 'Hero',
        },
        {
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              blocks: [
                ArticleArchive,
                AboutStatement,
                CallToAction,
                BusinessAdvantages,
                ClosingCTA,
                Content,
                ContactDetails,
                DeliveryCoverage,
                HomeHero,
                HomeIdentity,
                LegalFacts,
                LegalIndex,
                MapEmbed,
                MediaBlock,
                PreparationChecklist,
                ProcessSteps,
                ProofGallery,
                SupplyCapacity,
                SupplyCategories,
                TrustSignals,
                ValueStatement,
                VisitNote,
                Archive,
                Carousel,
                ThreeItemGrid,
                Banner,
                FormBlock,
              ],
              required: true,
            },
          ],
          label: 'Content',
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
          ],
        },
      ],
    },
    {
      name: 'pageType',
      type: 'select',
      admin: {
        position: 'sidebar',
      },
      defaultValue: 'default',
      options: [
        {
          label: 'Default',
          value: 'default',
        },
        {
          label: 'Legal',
          value: 'legal',
        },
      ],
    },
    slugField(),
  ],
  hooks: {
    afterChange: [revalidatePage],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: true,
    },
    maxPerDoc: 50,
  },
}
