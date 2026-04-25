import type { Block } from 'payload'

import { Archive } from '@/blocks/ArchiveBlock/config'
import { CallToAction } from '@/blocks/CallToAction/config'
import { Content } from '@/blocks/Content/config'
import { FeatureGrid } from '@/blocks/FeatureGrid/config'
import { Flexbox } from '@/blocks/Flexbox/config'
import { FormBlock } from '@/blocks/Form/config'
import { MediaBlock } from '@/blocks/MediaBlock/config'
import { Subtitle } from '@/blocks/Subtitle/config'
import { Title } from '@/blocks/Title/config'
import { UpcomingEvents } from '@/blocks/UpcomingEvents/config'
import { withBlockLayoutFields } from '@/fields/blockLayout'

export const BackgroundContainer: Block = {
  slug: 'backgroundContainer',
  interfaceName: 'BackgroundContainerBlock',
  fields: [
    {
      name: 'backgroundImage',
      type: 'upload',
      label: 'Background image',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'overlay',
      type: 'select',
      defaultValue: 'medium',
      options: [
        {
          label: 'None',
          value: 'none',
        },
        {
          label: 'Light',
          value: 'light',
        },
        {
          label: 'Medium',
          value: 'medium',
        },
        {
          label: 'Strong',
          value: 'strong',
        },
      ],
    },
    {
      name: 'width',
      type: 'select',
      defaultValue: 'full',
      options: [
        {
          label: 'Full width',
          value: 'full',
        },
        {
          label: 'Contained',
          value: 'contained',
        },
      ],
    },
    {
      name: 'padding',
      type: 'select',
      defaultValue: 'medium',
      options: [
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
      ],
    },
    {
      name: 'blocks',
      type: 'blocks',
      blocks: withBlockLayoutFields([
        CallToAction,
        Content,
        Title,
        Subtitle,
        Flexbox,
        FeatureGrid,
        UpcomingEvents,
        MediaBlock,
        Archive,
        FormBlock,
      ]),
      required: true,
      admin: {
        initCollapsed: true,
      },
      labels: {
        plural: 'Contained blocks',
        singular: 'Contained block',
      },
    },
  ],
  labels: {
    plural: 'Background Containers',
    singular: 'Background Container',
  },
}
