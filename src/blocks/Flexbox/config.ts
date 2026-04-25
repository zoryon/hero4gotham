import type { Block } from 'payload'

import { Archive } from '@/blocks/ArchiveBlock/config'
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
      label: 'Direzione',
      options: [
        {
          label: 'Riga',
          value: 'row',
        },
        {
          label: 'Colonna',
          value: 'column',
        },
        {
          label: 'Riga su desktop, colonna su mobile',
          value: 'responsiveRow',
        },
      ],
    },
    {
      name: 'wrap',
      type: 'select',
      defaultValue: 'wrap',
      label: 'Wrap',
      options: [
        {
          label: 'Wrap',
          value: 'wrap',
        },
        {
          label: 'No wrap',
          value: 'nowrap',
        },
      ],
    },
    {
      name: 'justify',
      type: 'select',
      defaultValue: 'center',
      label: 'Justify content',
      options: [
        {
          label: 'Start',
          value: 'start',
        },
        {
          label: 'Center',
          value: 'center',
        },
        {
          label: 'End',
          value: 'end',
        },
        {
          label: 'Space between',
          value: 'between',
        },
        {
          label: 'Space around',
          value: 'around',
        },
        {
          label: 'Space evenly',
          value: 'evenly',
        },
      ],
    },
    {
      name: 'align',
      type: 'select',
      defaultValue: 'center',
      label: 'Align items',
      options: [
        {
          label: 'Start',
          value: 'start',
        },
        {
          label: 'Center',
          value: 'center',
        },
        {
          label: 'End',
          value: 'end',
        },
        {
          label: 'Stretch',
          value: 'stretch',
        },
        {
          label: 'Baseline',
          value: 'baseline',
        },
      ],
    },
    {
      name: 'gap',
      type: 'select',
      defaultValue: 'md',
      label: 'Gap',
      options: [
        {
          label: 'Nessuno',
          value: 'none',
        },
        {
          label: 'XS',
          value: 'xs',
        },
        {
          label: 'SM',
          value: 'sm',
        },
        {
          label: 'MD',
          value: 'md',
        },
        {
          label: 'LG',
          value: 'lg',
        },
        {
          label: 'XL',
          value: 'xl',
        },
      ],
    },
    {
      name: 'minHeight',
      type: 'select',
      defaultValue: 'none',
      label: 'Altezza minima',
      options: [
        {
          label: 'Nessuna',
          value: 'none',
        },
        {
          label: 'Small',
          value: 'small',
        },
        {
          label: 'Medium',
          value: 'medium',
        },
        {
          label: 'Large',
          value: 'large',
        },
        {
          label: 'Viewport',
          value: 'screen',
        },
      ],
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
