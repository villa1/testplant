import { AboutStatementBlock } from '@/blocks/AboutStatement/Component'
import { ArticleArchiveBlock } from '@/blocks/ArticleArchive/Component'
import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { BannerBlock } from '@/blocks/Banner/Component'
import { BusinessAdvantagesBlock } from '@/blocks/BusinessAdvantages/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { CarouselBlock } from '@/blocks/Carousel/Component'
import { ClosingCTABlock } from '@/blocks/ClosingCTA/Component'
import { ContactDetailsBlock } from '@/blocks/ContactDetails/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { DeliveryCoverageBlock } from '@/blocks/DeliveryCoverage/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { HomeHeroBlock } from '@/blocks/HomeHero/Component'
import { HomeIdentityBlock } from '@/blocks/HomeIdentity/Component'
import { LegalFactsBlock } from '@/blocks/LegalFacts/Component'
import { LegalIndexBlock } from '@/blocks/LegalIndex/Component'
import { MapEmbedBlock } from '@/blocks/MapEmbed/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { PreparationChecklistBlock } from '@/blocks/PreparationChecklist/Component'
import { ProcessStepsBlock } from '@/blocks/ProcessSteps/Component'
import { ProofGalleryBlock } from '@/blocks/ProofGallery/Component'
import { SupplyCapacityBlock } from '@/blocks/SupplyCapacity/Component'
import { SupplyCategoriesBlock } from '@/blocks/SupplyCategories/Component'
import { ThreeItemGridBlock } from '@/blocks/ThreeItemGrid/Component'
import { TrustSignalsBlock } from '@/blocks/TrustSignals/Component'
import { ValueStatementBlock } from '@/blocks/ValueStatement/Component'
import { VisitNoteBlock } from '@/blocks/VisitNote/Component'
import { toKebabCase } from '@/utilities/toKebabCase'
import React, { Fragment } from 'react'

import type { Page } from '../payload-types'

const blockComponents = {
  aboutStatement: AboutStatementBlock,
  articleArchive: ArticleArchiveBlock,
  archive: ArchiveBlock,
  banner: BannerBlock,
  businessAdvantages: BusinessAdvantagesBlock,
  carousel: CarouselBlock,
  closingCTA: ClosingCTABlock,
  contactDetails: ContactDetailsBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  deliveryCoverage: DeliveryCoverageBlock,
  formBlock: FormBlock,
  homeHero: HomeHeroBlock,
  homeIdentity: HomeIdentityBlock,
  legalFacts: LegalFactsBlock,
  legalIndex: LegalIndexBlock,
  mapEmbed: MapEmbedBlock,
  mediaBlock: MediaBlock,
  preparationChecklist: PreparationChecklistBlock,
  processSteps: ProcessStepsBlock,
  proofGallery: ProofGalleryBlock,
  supplyCapacity: SupplyCapacityBlock,
  supplyCategories: SupplyCategoriesBlock,
  threeItemGrid: ThreeItemGridBlock,
  trustSignals: TrustSignalsBlock,
  valueStatement: ValueStatementBlock,
  visitNote: VisitNoteBlock,
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockName, blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              return (
                <Fragment key={index}>
                  {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                  {/* @ts-ignore - weird type mismatch here */}
                  <Block id={toKebabCase(blockName!)} {...block} />
                </Fragment>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
