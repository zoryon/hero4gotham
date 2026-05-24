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
import { ContactMessage } from '@/blocks/ContactMessage/config'
import { Content } from '@/blocks/Content/config'
import { EventCalendar } from '@/blocks/EventSuite/EventCalendar/config'
import { EventFilters } from '@/blocks/EventFilters/config'
import { EventGallery } from '@/blocks/EventGallery/config'
import { EventList } from '@/blocks/EventSuite/EventList/config'
import { EventProposalCta } from '@/blocks/EventProposalCta/config'
import { FaqAccordion } from '@/blocks/FaqAccordion/config'
import { FeaturedEvent } from '@/blocks/EventSuite/FeaturedEvent/config'
import { FeatureGrid } from '@/blocks/FeatureGrid/config'
import { FormBlock } from '@/blocks/Form/config'
import { MediaBlock } from '@/blocks/MediaBlock/config'
import { MembershipApplication } from '@/blocks/MembershipApplication/config'
import { PhotoGalleryStrip } from '@/blocks/PhotoGalleryStrip/config'
import { ProcessSteps } from '@/blocks/ProcessSteps/config'
import { Subtitle } from '@/blocks/Subtitle/config'
import { Title } from '@/blocks/Title/config'
import { UpcomingEvents } from '@/blocks/UpcomingEvents/config'
import { UpcomingEventsCta } from '@/blocks/UpcomingEventsCta/config'
import { withBlockLayoutFields } from '@/fields/blockLayout'

const baseFlexChildBlocks = [
  ActivitiesDetailGrid,
  ActivityChoiceCta,
  Arrow,
  CallToAction,
  ContactMessage,
  Content,
  EventCalendar,
  EventFilters,
  EventGallery,
  EventList,
  EventProposalCta,
  FaqAccordion,
  FeaturedEvent,
  Title,
  Subtitle,
  FeatureGrid,
  UpcomingEvents,
  UpcomingEventsCta,
  PhotoGalleryStrip,
  MediaBlock,
  MembershipApplication,
  ProcessSteps,
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
    name: 'reverseOnNonDesktop',
    type: 'checkbox',
    defaultValue: false,
    label: 'Reverse order below desktop',
    admin: {
      description:
        'When the layout stacks on smaller screens, show the first flex item after the following items.',
    },
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
      components: {
        beforeInput: ['@/components/BlockClipboardControls#BlockClipboardControls'],
      },
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
