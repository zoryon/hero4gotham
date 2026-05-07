import {
  flexDirectionOptions,
  flexWrapOptions,
  justifyOptions,
  alignOptions,
  paddingOptions,
  minHeightOptions,
} from '@/fields/uiOptions'
import type { Block, Field } from 'payload'

import { ActivitiesDetailGrid } from '@/blocks/ActivitiesDetailGrid/config'
import { ActivityChoiceCta } from '@/blocks/ActivityChoiceCta/config'
import { Archive } from '@/blocks/ArchiveBlock/config'
import { Arrow } from '@/blocks/Arrow/config'
import { CallToAction } from '@/blocks/CallToAction/config'
import { Content } from '@/blocks/Content/config'
import { EventCalendar } from '@/blocks/EventSuite/EventCalendar/config'
import { EventFilters } from '@/blocks/EventFilters/config'
import { EventList } from '@/blocks/EventSuite/EventList/config'
import { FeaturedEvent } from '@/blocks/EventSuite/FeaturedEvent/config'
import { FeatureGrid } from '@/blocks/FeatureGrid/config'
import { FormBlock } from '@/blocks/Form/config'
import { MediaBlock } from '@/blocks/MediaBlock/config'
import { Subtitle } from '@/blocks/Subtitle/config'
import { Title } from '@/blocks/Title/config'
import { UpcomingEvents } from '@/blocks/UpcomingEvents/config'
import { withBlockLayoutFields } from '@/fields/blockLayout'

const baseFlexChildBlocks = [
  ActivitiesDetailGrid,
  ActivityChoiceCta,
  Arrow,
  CallToAction,
  Content,
  EventCalendar,
  EventFilters,
  EventList,
  FeaturedEvent,
  Title,
  Subtitle,
  FeatureGrid,
  UpcomingEvents,
  MediaBlock,
  Archive,
  FormBlock,
] satisfies Block[]

const createFlexboxFields = (blocks: Block[]): Field[] => [
  {
    name: 'direction',
    type: 'select',
    defaultValue: 'row',
    label: 'Direction',
    options: [...flexDirectionOptions],
  },
  {
    name: 'wrap',
    type: 'select',
    defaultValue: 'wrap',
    label: 'Wrap',
    options: [...flexWrapOptions],
  },
  {
    name: 'justify',
    type: 'select',
    defaultValue: 'center',
    label: 'Justify content',
    options: [...justifyOptions],
  },
  {
    name: 'align',
    type: 'select',
    defaultValue: 'center',
    label: 'Align items',
    options: [...alignOptions],
  },
  {
    name: 'gap',
    type: 'select',
    defaultValue: 'md',
    label: 'Gap',
    options: [...paddingOptions],
  },
  {
    name: 'minHeight',
    type: 'select',
    defaultValue: 'none',
    label: 'Minimum height',
    options: [...minHeightOptions],
  },
  {
    name: 'itemSizing',
    type: 'select',
    defaultValue: 'auto',
    label: 'Item sizing',
    options: [
      {
        label: 'Auto',
        value: 'auto',
      },
      {
        label: 'Event board columns',
        value: 'eventBoardColumns',
      },
    ],
    admin: {
      description:
        'Use for the event board: first child wide on the left, second child narrow on the right.',
    },
  },
  {
    name: 'blocks',
    type: 'blocks',
    blocks,
    required: true,
    admin: {
      initCollapsed: true,
    },
    labels: {
      plural: 'Flex items',
      singular: 'Flex item',
    },
  },
]

const NestedFlexbox: Block = {
  slug: 'flexbox',
  interfaceName: 'FlexboxBlock',
  fields: createFlexboxFields(withBlockLayoutFields(baseFlexChildBlocks)),
  labels: {
    singular: 'Flexbox',
    plural: 'Flexboxes',
  },
}

const flexChildBlocks = withBlockLayoutFields([...baseFlexChildBlocks, NestedFlexbox])

export const Flexbox: Block = {
  slug: 'flexbox',
  interfaceName: 'FlexboxBlock',
  fields: createFlexboxFields(flexChildBlocks),
  labels: {
    singular: 'Flexbox',
    plural: 'Flexboxes',
  },
}
