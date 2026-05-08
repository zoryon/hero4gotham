import React from 'react'

import type { Page } from '@/payload-types'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import type { BlockLayoutSettings } from '@/fields/blockLayout'
import { cn } from '@/utilities/ui'

type FlexboxItem = Page['layout'][0]
type FlexboxItemWithLayout = FlexboxItem & { layout?: BlockLayoutSettings | null }

export type FlexboxProps = {
  blocks?: FlexboxItem[] | null
  direction?: 'row' | 'column' | 'responsiveRow' | 'desktopColumnTabletRowMobileColumn' | null
  wrap?: 'wrap' | 'nowrap' | null
  reverseOnNonDesktop?: boolean | null
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly' | null
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline' | null
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | null
  itemSizing?: 'auto' | 'eventBoardColumns' | null
  minHeight?: 'none' | 'small' | 'medium' | 'large' | 'screen' | null
}

const getBlockType = (block: FlexboxItem | null | undefined) =>
  block && typeof block === 'object' && 'blockType' in block ? block.blockType : null

const directionClasses = {
  column: 'flex-col',
  desktopColumnTabletRowMobileColumn: 'flex-col min-[680px]:flex-row xl:flex-col',
  responsiveRow: 'flex-col md:flex-row',
  row: 'flex-row',
}

const wrapClasses = {
  nowrap: 'flex-nowrap',
  wrap: 'flex-wrap',
}

const customResponsiveWrapClasses = {
  nowrap: 'flex-nowrap',
  wrap: 'flex-wrap min-[680px]:flex-nowrap xl:flex-wrap',
}

const justifyClasses = {
  around: 'justify-around',
  between: 'justify-between',
  center: 'justify-center',
  end: 'justify-end',
  evenly: 'justify-evenly',
  start: 'justify-start',
}

const alignClasses = {
  baseline: 'items-baseline',
  center: 'items-center',
  end: 'items-end',
  start: 'items-start',
  stretch: 'items-stretch',
}

const gapClasses = {
  lg: 'gap-12',
  md: 'gap-8',
  none: 'gap-0',
  sm: 'gap-5',
  xl: 'gap-16',
  xs: 'gap-3',
}

const customResponsiveCompactGapClasses = {
  lg: 'min-[680px]:max-md:gap-5',
  md: 'min-[680px]:max-md:gap-4',
  none: 'min-[680px]:max-md:gap-0',
  sm: 'min-[680px]:max-md:gap-3',
  xl: 'min-[680px]:max-md:gap-6',
  xs: 'min-[680px]:max-md:gap-2',
}

const minHeightClasses = {
  large: 'min-h-[70vh]',
  medium: 'min-h-[50vh]',
  none: '',
  screen: 'min-h-screen',
  small: 'min-h-[30vh]',
}

const itemSizingClasses = {
  auto: '',
  eventBoardColumns:
    '[&>*:first-child]:w-full [&>*:first-child]:min-w-0 md:[&>*:first-child]:flex-[1_1_38rem] md:[&>*:first-child]:max-w-[calc(68%_-_1rem)] [&>*:nth-child(2)]:w-full [&>*:nth-child(2)]:min-w-0 md:[&>*:nth-child(2)]:flex-[0_1_22rem] md:[&>*:nth-child(2)]:max-w-[calc(32%_-_1rem)]',
}

const customResponsiveItemClasses =
  '[&>*]:min-w-0 [&>*]:w-full min-[680px]:[&>*]:w-auto min-[680px]:[&>*]:flex-[1_1_0] min-[680px]:max-md:[&>*>:first-child]:mx-0 xl:[&>*]:w-full xl:[&>*]:flex-none'

export const FlexboxBlock: React.FC<FlexboxProps> = ({
  align = 'center',
  blocks,
  direction = 'row',
  gap = 'md',
  itemSizing = 'auto',
  justify = 'center',
  minHeight = 'none',
  reverseOnNonDesktop = false,
  wrap = 'wrap',
}) => {
  if (!blocks?.length) return null

  const blockTypes = blocks.map(getBlockType)
  const usesCustomResponsiveDirection = direction === 'desktopColumnTabletRowMobileColumn'
  const isEventBoard =
    !usesCustomResponsiveDirection &&
    (itemSizing === 'eventBoardColumns' ||
      (blockTypes[0] === 'eventList' &&
        (blockTypes[1] === 'flexbox' ||
          blockTypes[1] === 'featuredEvent' ||
          blockTypes[1] === 'eventCalendar')))
  const isEventSidebar =
    !usesCustomResponsiveDirection &&
    blockTypes.length <= 2 &&
    blockTypes.includes('featuredEvent') &&
    blockTypes.includes('eventCalendar')
  const isContactFaqPair =
    !usesCustomResponsiveDirection &&
    blockTypes.length <= 2 &&
    blockTypes.includes('contactMessage') &&
    blockTypes.includes('faqAccordion')

  if (isEventBoard) {
    return (
      <div
        className={cn(
          'grid w-full min-w-0 grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,2.15fr)_minmax(18rem,0.85fr)]',
          reverseOnNonDesktop &&
            'max-xl:[&>*:first-child]:order-2 max-xl:[&>*:nth-child(2)]:order-1',
        )}
      >
        <RenderBlocks blocks={blocks as FlexboxItemWithLayout[]} wrapperClassName="m-0 min-w-0" />
      </div>
    )
  }

  if (isEventSidebar) {
    return (
      <div className="flex w-full min-w-0 flex-col items-stretch gap-5">
        <RenderBlocks blocks={blocks as FlexboxItemWithLayout[]} wrapperClassName="m-0 min-w-0" />
      </div>
    )
  }

  if (isContactFaqPair) {
    return (
      <div
        className={cn(
          'grid w-full min-w-0 grid-cols-1 items-start',
          'xl:grid-cols-[minmax(0,1.55fr)_minmax(20rem,0.9fr)]',
          gapClasses[gap ?? 'md'],
          reverseOnNonDesktop &&
            'max-xl:[&>*:first-child]:order-2 max-xl:[&>*:nth-child(2)]:order-1',
        )}
      >
        <RenderBlocks blocks={blocks as FlexboxItemWithLayout[]} wrapperClassName="m-0 min-w-0" />
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex w-full',
        reverseOnNonDesktop && direction === 'responsiveRow'
          ? 'flex-col-reverse md:flex-row'
          : reverseOnNonDesktop && direction === 'desktopColumnTabletRowMobileColumn'
            ? 'flex-col-reverse min-[680px]:flex-row xl:flex-col'
            : directionClasses[direction ?? 'row'],
        usesCustomResponsiveDirection
          ? customResponsiveWrapClasses[wrap ?? 'wrap']
          : wrapClasses[wrap ?? 'wrap'],
        justifyClasses[justify ?? 'center'],
        alignClasses[align ?? 'center'],
        gapClasses[gap ?? 'md'],
        usesCustomResponsiveDirection && customResponsiveCompactGapClasses[gap ?? 'md'],
        usesCustomResponsiveDirection && customResponsiveItemClasses,
        itemSizingClasses[usesCustomResponsiveDirection ? 'auto' : (itemSizing ?? 'auto')],
        minHeightClasses[minHeight ?? 'none'],
      )}
    >
      <RenderBlocks
        blocks={blocks as FlexboxItemWithLayout[]}
        wrapperClassName={usesCustomResponsiveDirection ? 'm-0 min-w-0' : 'm-0'}
      />
    </div>
  )
}
