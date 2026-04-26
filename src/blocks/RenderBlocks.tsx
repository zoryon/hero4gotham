import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { getBlockLayoutClasses, type BlockLayoutSettings } from '@/fields/blockLayout'
import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { ArrowBlock } from '@/blocks/Arrow/Component'
import { BackgroundContainerBlock } from '@/blocks/BackgroundContainer/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FeatureGridBlock } from '@/blocks/FeatureGrid/Component'
import { FlexboxBlock } from '@/blocks/Flexbox/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { SubtitleBlock } from '@/blocks/Subtitle/Component'
import { TitleBlock } from '@/blocks/Title/Component'
import { TornCardsBlock } from '@/blocks/TornCards/Component'
import { UpcomingEventsBlock } from '@/blocks/UpcomingEvents/Component'
import { cn } from '@/utilities/ui'

const blockComponents = {
  archive: ArchiveBlock,
  arrow: ArrowBlock,
  backgroundContainer: BackgroundContainerBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  featureGrid: FeatureGridBlock,
  flexbox: FlexboxBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  subtitle: SubtitleBlock,
  title: TitleBlock,
  tornCards: TornCardsBlock,
  upcomingEvents: UpcomingEventsBlock,
}

export const RenderBlocks: React.FC<{
  blocks: (Page['layout'][0] & { layout?: BlockLayoutSettings | null })[]
  wrapperClassName?: string
}> = (props) => {
  const { blocks, wrapperClassName = 'my-16' } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              return (
                <div
                  className={cn(getBlockLayoutClasses(block.layout, wrapperClassName))}
                  key={index}
                >
                  {/* @ts-expect-error there may be some mismatch between the expected types here */}
                  <Block {...block} disableInnerContainer />
                </div>
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
