import React from 'react'

import type { Page } from '@/payload-types'

import { getBlockLayoutClasses, type BlockLayoutSettings } from '@/fields/blockLayout'
import { ActivitiesDetailGridBlock } from '@/blocks/ActivitiesDetailGrid/Component'
import { ActivityChoiceCtaBlock } from '@/blocks/ActivityChoiceCta/Component'
import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { ArrowBlock } from '@/blocks/Arrow/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContactMessageBlock } from '@/blocks/ContactMessage/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { EventCalendarBlock } from '@/blocks/EventSuite/EventCalendar/Component'
import { EventFiltersBlock } from '@/blocks/EventFilters/Component'
import { EventGalleryBlock } from '@/blocks/EventGallery/Component'
import { EventListBlock } from '@/blocks/EventSuite/EventList/Component'
import { FaqAccordionBlock } from '@/blocks/FaqAccordion/Component'
import { FeaturedEventBlock } from '@/blocks/EventSuite/FeaturedEvent/Component'
import { FeatureGridBlock } from '@/blocks/FeatureGrid/Component'
import { FlexboxBlock } from '@/blocks/Flexbox/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { MembershipApplicationBlock } from '@/blocks/MembershipApplication/Component'
import { ProcessStepsBlock } from '@/blocks/ProcessSteps/Component'
import { PhotoGalleryStripBlock } from '@/blocks/PhotoGalleryStrip/Component'
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
  contactMessage: ContactMessageBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  eventCalendar: EventCalendarBlock,
  eventFilters: EventFiltersBlock,
  eventGallery: EventGalleryBlock,
  eventList: EventListBlock,
  faqAccordion: FaqAccordionBlock,
  featuredEvent: FeaturedEventBlock,
  featureGrid: FeatureGridBlock,
  flexbox: FlexboxBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  membershipApplication: MembershipApplicationBlock,
  processSteps: ProcessStepsBlock,
  photoGalleryStrip: PhotoGalleryStripBlock,
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
  'photoGalleryStrip',
  'quoteBanner',
  'threePanelShowcase',
  'tornCards',
])

const eventSidebarBlockTypes = new Set<keyof typeof blockComponents>([
  'eventCalendar',
  'featuredEvent',
])

const getEventBoardParts = (
  flexboxBlock: (Page['layout'][0] & { layout?: BlockLayoutSettings | null }) | null | undefined,
) => {
  if (flexboxBlock?.blockType !== 'flexbox' || !Array.isArray(flexboxBlock.blocks)) return null

  const [eventListBlock, sidebarBlock, maybeSecondSidebarBlock] = flexboxBlock.blocks

  if (eventListBlock?.blockType !== 'eventList' || !sidebarBlock) return null

  if (
    sidebarBlock.blockType !== 'flexbox' &&
    sidebarBlock.blockType !== 'featuredEvent' &&
    sidebarBlock.blockType !== 'eventCalendar'
  ) {
    return null
  }

  const sidebarBlocks =
    sidebarBlock.blockType === 'flexbox'
      ? [sidebarBlock]
      : [
          sidebarBlock,
          ...(maybeSecondSidebarBlock &&
          (maybeSecondSidebarBlock.blockType === 'featuredEvent' ||
            maybeSecondSidebarBlock.blockType === 'eventCalendar')
            ? [maybeSecondSidebarBlock]
            : []),
        ]

  return {
    eventListBlock,
    sidebarBlocks,
  }
}

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
  const lastRenderableIndex = hasBlocks
    ? blocks.reduce((lastIndex, { blockType }, index) => {
        return blockType && blockType in blockComponents ? index : lastIndex
      }, -1)
    : -1
  const firstRenderableIndex =
    hasBlocks && markFirstBlock
      ? blocks.findIndex(({ blockType }) => Boolean(blockType && blockType in blockComponents))
      : -1

  if (hasBlocks) {
    const groupedEventSidebarIndices = new Set<number>()
    const groupedEventBoardIndices = new Set<number>()

    return (
      <EventFiltersProvider>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (groupedEventBoardIndices.has(index)) return null
          if (groupedEventSidebarIndices.has(index)) return null

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              const BlockToRender = Block as React.ComponentType<RenderableBlockProps>
              const blockWrapperClassName = flushBlockTypes.has(blockType)
                ? undefined
                : wrapperClassName

              if (blockType === 'eventFilters') {
                const nextBlock = blocks[index + 1]
                const eventBoardParts = getEventBoardParts(nextBlock)

                if (eventBoardParts) {
                  groupedEventBoardIndices.add(index + 1)

                  const EventListBlockToRender =
                    blockComponents.eventList as unknown as React.ComponentType<RenderableBlockProps>

                  return (
                    <div
                      className={cn(
                        getBlockLayoutClasses(nextBlock.layout, blockWrapperClassName),
                        'grid min-w-0 grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,2.15fr)_minmax(18rem,0.85fr)]',
                        index === firstRenderableIndex && 'mt-0',
                      )}
                      key={index}
                    >
                      <div
                        className={cn(
                          getBlockLayoutClasses(block.layout, 'm-0 min-w-0'),
                          'order-2 xl:order-1 xl:col-span-2',
                          index === firstRenderableIndex && 'mt-0',
                        )}
                      >
                        <BlockToRender
                          {...block}
                          disableInnerContainer
                          isFirstPageBlock={index === firstRenderableIndex}
                        />
                      </div>
                      <div className="order-3 min-w-0 xl:order-2">
                        <EventListBlockToRender
                          {...eventBoardParts.eventListBlock}
                          disableInnerContainer
                          isFirstPageBlock={false}
                        />
                      </div>
                      <div className="order-1 flex min-w-0 flex-col items-stretch gap-5 xl:order-3">
                        {eventBoardParts.sidebarBlocks.map((sidebarBlock, sidebarIndex) => {
                          const SidebarBlock = blockComponents[
                            sidebarBlock.blockType as keyof typeof blockComponents
                          ] as unknown as React.ComponentType<RenderableBlockProps>

                          return (
                            <div
                              className="m-0 min-w-0"
                              key={`${index}-board-sidebar-${sidebarIndex}`}
                            >
                              <SidebarBlock
                                {...sidebarBlock}
                                disableInnerContainer
                                isFirstPageBlock={false}
                              />
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                }
              }

              if (blockType === 'eventList') {
                const sidebarBlocks: typeof blocks = []

                for (let nextIndex = index + 1; nextIndex < blocks.length; nextIndex += 1) {
                  const nextBlock = blocks[nextIndex]
                  const nextBlockType = nextBlock?.blockType

                  if (!nextBlockType || !eventSidebarBlockTypes.has(nextBlockType)) break

                  sidebarBlocks.push(nextBlock)
                  groupedEventSidebarIndices.add(nextIndex)

                  if (sidebarBlocks.length === 2) break
                }

                if (sidebarBlocks.length) {
                  return (
                    <div
                      className={cn(
                        getBlockLayoutClasses(block.layout, blockWrapperClassName),
                        'grid min-w-0 grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,2.15fr)_minmax(18rem,0.85fr)]',
                        index === firstRenderableIndex && 'mt-0',
                        index === lastRenderableIndex && 'mb-0',
                      )}
                      key={index}
                    >
                      <div className="min-w-0">
                        <BlockToRender
                          {...block}
                          disableInnerContainer
                          isFirstPageBlock={index === firstRenderableIndex}
                        />
                      </div>
                      <div className="flex min-w-0 flex-col items-stretch gap-5">
                        {sidebarBlocks.map((sidebarBlock, sidebarIndex) => {
                          const SidebarBlock = blockComponents[
                            sidebarBlock.blockType as keyof typeof blockComponents
                          ] as React.ComponentType<RenderableBlockProps>

                          return (
                            <div className="m-0 min-w-0" key={`${index}-sidebar-${sidebarIndex}`}>
                              <SidebarBlock
                                {...sidebarBlock}
                                disableInnerContainer
                                isFirstPageBlock={false}
                              />
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                }
              }

              return (
                <div
                  className={cn(
                    getBlockLayoutClasses(block.layout, blockWrapperClassName),
                    index === firstRenderableIndex && 'mt-0',
                    index === lastRenderableIndex && 'mb-0',
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
