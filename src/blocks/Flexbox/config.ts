import {
  flexDirectionOptions,
  flexWrapOptions,
  justifyOptions,
  alignOptions,
  paddingOptions,
  minHeightOptions,
} from '@/fields/uiOptions'
import type { Block } from 'payload'

import { ActivitiesDetailGrid } from '@/blocks/ActivitiesDetailGrid/config'
import { Archive } from '@/blocks/ArchiveBlock/config'
import { Arrow } from '@/blocks/Arrow/config'
import { CallToAction } from '@/blocks/CallToAction/config'
import { Content } from '@/blocks/Content/config'
import { FeatureGrid } from '@/blocks/FeatureGrid/config'
import { FormBlock } from '@/blocks/Form/config'
import { MediaBlock } from '@/blocks/MediaBlock/config'
import { Subtitle } from '@/blocks/Subtitle/config'
import { Title } from '@/blocks/Title/config'
import { UpcomingEvents } from '@/blocks/UpcomingEvents/config'
import { withBlockLayoutFields } from '@/fields/blockLayout'

const flexChildBlocks = withBlockLayoutFields([
  ActivitiesDetailGrid,
  Arrow,
  CallToAction,
  Content,
  Title,
  Subtitle,
  FeatureGrid,
  UpcomingEvents,
  MediaBlock,
  Archive,
  FormBlock,
])

export const Flexbox: Block = {
  slug: 'flexbox',
  interfaceName: 'FlexboxBlock',
  fields: [
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
      name: 'blocks',
      type: 'blocks',
      blocks: flexChildBlocks,
      required: true,
      admin: {
        initCollapsed: true,
      },
      labels: {
        plural: 'Flex items',
        singular: 'Flex item',
      },
    },
  ],
  labels: {
    singular: 'Flexbox',
    plural: 'Flexboxes',
  },
}
