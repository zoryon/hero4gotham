import React from 'react'

import type { Page } from '@/payload-types'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import type { BlockLayoutSettings } from '@/fields/blockLayout'
import { cn } from '@/utilities/ui'

type FlexboxItem = Page['layout'][0]
type FlexboxItemWithLayout = FlexboxItem & { layout?: BlockLayoutSettings | null }

export type FlexboxProps = {
  blocks?: FlexboxItem[] | null
  direction?: 'row' | 'column' | 'responsiveRow' | null
  wrap?: 'wrap' | 'nowrap' | null
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly' | null
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline' | null
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | null
  itemSizing?: 'auto' | 'eventBoardColumns' | null
  minHeight?: 'none' | 'small' | 'medium' | 'large' | 'screen' | null
}

const directionClasses = {
  column: 'flex-col',
  responsiveRow: 'flex-col md:flex-row',
  row: 'flex-row',
}

const wrapClasses = {
  nowrap: 'flex-nowrap',
  wrap: 'flex-wrap',
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
    '[&>*:first-child]:w-full [&>*:first-child]:min-w-0 md:[&>*:first-child]:flex-[1_1_38rem] md:[&>*:first-child]:max-w-[calc(68%-1rem)] [&>*:nth-child(2)]:w-full [&>*:nth-child(2)]:min-w-0 md:[&>*:nth-child(2)]:flex-[0_1_22rem] md:[&>*:nth-child(2)]:max-w-[calc(32%-1rem)]',
}

export const FlexboxBlock: React.FC<FlexboxProps> = ({
  align = 'center',
  blocks,
  direction = 'row',
  gap = 'md',
  itemSizing = 'auto',
  justify = 'center',
  minHeight = 'none',
  wrap = 'wrap',
}) => {
  if (!blocks?.length) return null

  return (
    <div
      className={cn(
        'flex w-full',
        directionClasses[direction ?? 'row'],
        wrapClasses[wrap ?? 'wrap'],
        justifyClasses[justify ?? 'center'],
        alignClasses[align ?? 'center'],
        gapClasses[gap ?? 'md'],
        itemSizingClasses[itemSizing ?? 'auto'],
        minHeightClasses[minHeight ?? 'none'],
      )}
    >
      <RenderBlocks blocks={blocks as FlexboxItemWithLayout[]} wrapperClassName="m-0" />
    </div>
  )
}
