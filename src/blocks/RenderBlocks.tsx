import React from 'react'

import type { Page } from '@/payload-types'

import { getBlockLayoutClasses, type BlockLayoutSettings } from '@/fields/blockLayout'
import { ActivitiesDetailGridBlock } from '@/blocks/ActivitiesDetailGrid/Component'
import { ActivityChoiceCtaBlock } from '@/blocks/ActivityChoiceCta/Component'
import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { ArrowBlock } from '@/blocks/Arrow/Component'
import { BackgroundContainerBlock } from '@/blocks/BackgroundContainer/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { EventCalendarBlock } from '@/blocks/EventSuite/EventCalendar/Component'
import { EventFiltersBlock } from '@/blocks/EventFilters/Component'
import { EventListBlock } from '@/blocks/EventSuite/EventList/Component'
import { FeaturedEventBlock } from '@/blocks/EventSuite/FeaturedEvent/Component'
import { FeatureGridBlock } from '@/blocks/FeatureGrid/Component'
import { FlexboxBlock } from '@/blocks/Flexbox/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { QuoteBannerBlock } from '@/blocks/QuoteBanner/Component'
import { SubtitleBlock } from '@/blocks/Subtitle/Component'
import { TextBackdropBlock } from '@/blocks/TextBackdrop/Component'
import { ThreePanelShowcaseBlock } from '@/blocks/ThreePanelShowcase/Component'
import { TitleBlock } from '@/blocks/Title/Component'
import { TornCardsBlock } from '@/blocks/TornCards/Component'
import { UpcomingEventsBlock } from '@/blocks/UpcomingEvents/Component'
import { EventFiltersProvider } from '@/providers/EventFilters'
import { cn } from '@/utilities/ui'

const blockComponents = {
  activitiesDetailGrid: ActivitiesDetailGridBlock,
  activityChoiceCta: ActivityChoiceCtaBlock,
  archive: ArchiveBlock,
  arrow: ArrowBlock,
  backgroundContainer: BackgroundContainerBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  eventCalendar: EventCalendarBlock,
  eventFilters: EventFiltersBlock,
  eventList: EventListBlock,
  featuredEvent: FeaturedEventBlock,
  featureGrid: FeatureGridBlock,
  flexbox: FlexboxBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  quoteBanner: QuoteBannerBlock,
  subtitle: SubtitleBlock,
  textBackdrop: TextBackdropBlock,
  threePanelShowcase: ThreePanelShowcaseBlock,
  title: TitleBlock,
  tornCards: TornCardsBlock,
  upcomingEvents: UpcomingEventsBlock,
}

const flushBlockTypes = new Set<keyof typeof blockComponents>([
  'activityChoiceCta',
  'quoteBanner',
  'threePanelShowcase',
  'tornCards',
])

type RenderableBlockProps = Page['layout'][0] & {
  disableInnerContainer?: boolean
  isFirstPageBlock?: boolean
}

export const RenderBlocks: React.FC<{
  blocks: (Page['layout'][0] & { layout?: BlockLayoutSettings | null })[]
  markFirstBlock?: boolean
  wrapperClassName?: string
}> = (props) => {
  const { blocks, markFirstBlock = false, wrapperClassName = 'my-16' } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0
  const firstRenderableIndex =
    hasBlocks && markFirstBlock
      ? blocks.findIndex(({ blockType }) => Boolean(blockType && blockType in blockComponents))
      : -1

  if (hasBlocks) {
    return (
      <EventFiltersProvider>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              const BlockToRender = Block as React.ComponentType<RenderableBlockProps>
              const blockWrapperClassName = flushBlockTypes.has(blockType)
                ? undefined
                : wrapperClassName

              return (
                <div
                  className={cn(
                    getBlockLayoutClasses(block.layout, blockWrapperClassName),
                    index === firstRenderableIndex && 'mt-0',
                  )}
                  key={index}
                >
                  <BlockToRender
                    {...block}
                    disableInnerContainer
                    isFirstPageBlock={index === firstRenderableIndex}
                  />
                </div>
              )
            }
          }
          return null
        })}
      </EventFiltersProvider>
    )
  }

  return null
}
