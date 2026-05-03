import React, { Fragment } from 'react'

import { FooterBottomBarBlockComponent } from '@/blocks/FooterBottomBar/Component'
import { FooterContactBlockComponent } from '@/blocks/FooterContact/Component'
import { FooterIdentityBlockComponent } from '@/blocks/FooterIdentity/Component'
import { FooterNavigationBlockComponent } from '@/blocks/FooterNavigation/Component'
import { FooterTextBlockComponent } from '@/blocks/FooterText/Component'

import type {
  FooterBlock,
  FooterBottomBarBlock,
  FooterColumnBlock,
  FooterLayout,
} from './types'

const isFooterColumnBlock = (block: FooterBlock): block is FooterColumnBlock =>
  ['contact', 'identity', 'navigation', 'text'].includes(block.blockType)

const isFooterBottomBarBlock = (block: FooterBlock): block is FooterBottomBarBlock =>
  block.blockType === 'bottomBar'

export const getFooterColumnBlocks = (blocks: FooterLayout | null | undefined) =>
  (blocks || []).filter(isFooterColumnBlock)

export const getFooterBottomBarBlocks = (blocks: FooterLayout | null | undefined) =>
  (blocks || []).filter(isFooterBottomBarBlock)

export const RenderFooterColumnBlocks: React.FC<{
  blocks: FooterLayout | null | undefined
}> = ({ blocks }) => {
  const columnBlocks = getFooterColumnBlocks(blocks)

  if (!columnBlocks.length) {
    return null
  }

  return (
    <Fragment>
      {columnBlocks.map((block, index) => {
        switch (block.blockType) {
          case 'identity':
            return <FooterIdentityBlockComponent key={block.id || index} {...block} />
          case 'navigation':
            return <FooterNavigationBlockComponent key={block.id || index} {...block} />
          case 'contact':
            return <FooterContactBlockComponent key={block.id || index} {...block} />
          case 'text':
            return <FooterTextBlockComponent key={block.id || index} {...block} />
          default:
            return null
        }
      })}
    </Fragment>
  )
}

export const RenderFooterBottomBarBlocks: React.FC<{
  blocks: FooterLayout | null | undefined
}> = ({ blocks }) => {
  const bottomBlocks = getFooterBottomBarBlocks(blocks)

  if (!bottomBlocks.length) {
    return null
  }

  return (
    <Fragment>
      {bottomBlocks.map((block, index) => (
        <FooterBottomBarBlockComponent key={block.id || index} {...block} />
      ))}
    </Fragment>
  )
}
