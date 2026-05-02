import type { Block } from 'payload'

import { ActivitiesDetailGrid } from '@/blocks/ActivitiesDetailGrid/config'
import { ActivityChoiceCta } from '@/blocks/ActivityChoiceCta/config'
import { Archive } from '@/blocks/ArchiveBlock/config'
import { Arrow } from '@/blocks/Arrow/config'
import { CallToAction } from '@/blocks/CallToAction/config'
import { Content } from '@/blocks/Content/config'
import { EventFilters } from '@/blocks/EventFilters/config'
import { FeatureGrid } from '@/blocks/FeatureGrid/config'
import { Flexbox } from '@/blocks/Flexbox/config'
import { FormBlock } from '@/blocks/Form/config'
import { MediaBlock } from '@/blocks/MediaBlock/config'
import { QuoteBanner } from '@/blocks/QuoteBanner/config'
import { Subtitle } from '@/blocks/Subtitle/config'
import { TextBackdrop } from '@/blocks/TextBackdrop/config'
import { Title } from '@/blocks/Title/config'
import { TornCards } from '@/blocks/TornCards/config'
import { ThreePanelShowcase } from '@/blocks/ThreePanelShowcase/config'
import { UpcomingEvents } from '@/blocks/UpcomingEvents/config'
import { withBlockLayoutFields } from '@/fields/blockLayout'

const imagePositionOptions = [
  {
    label: 'Center',
    value: 'center',
  },
  {
    label: 'Top',
    value: 'top',
  },
  {
    label: 'Bottom',
    value: 'bottom',
  },
  {
    label: 'Left',
    value: 'left',
  },
  {
    label: 'Right',
    value: 'right',
  },
  {
    label: 'Top left',
    value: 'topLeft',
  },
  {
    label: 'Top right',
    value: 'topRight',
  },
  {
    label: 'Bottom left',
    value: 'bottomLeft',
  },
  {
    label: 'Bottom right',
    value: 'bottomRight',
  },
] as const

export const BackgroundContainer: Block = {
  slug: 'backgroundContainer',
  interfaceName: 'BackgroundContainerBlock',
  fields: [
    {
      name: 'backgroundImage',
      type: 'upload',
      label: 'Desktop background image',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'bgTab',
      type: 'upload',
      label: 'Tablet background image',
      relationTo: 'media',
      admin: {
        description: 'Optional. Falls back to the desktop image if empty.',
      },
    },
    {
      name: 'bgMob',
      type: 'upload',
      label: 'Mobile background image',
      relationTo: 'media',
      admin: {
        description: 'Optional. Falls back to the tablet or desktop image if empty.',
      },
    },
    {
      type: 'collapsible',
      label: 'Background image rendering',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'imageQuality',
              type: 'number',
              defaultValue: 95,
              label: 'Image quality',
              min: 75,
              max: 100,
              admin: {
                description:
                  'Higher values reduce compression artifacts. Use 95-100 for full-screen textured backgrounds.',
                step: 1,
                width: '25%',
              },
            },
            {
              name: 'imagePositionMobile',
              type: 'select',
              dbName: 'img_pos_m',
              defaultValue: 'center',
              label: 'Mobile position',
              options: [...imagePositionOptions],
              admin: {
                width: '25%',
              },
            },
            {
              name: 'imagePositionTablet',
              type: 'select',
              dbName: 'img_pos_t',
              defaultValue: 'center',
              label: 'Tablet position',
              options: [...imagePositionOptions],
              admin: {
                width: '25%',
              },
            },
            {
              name: 'imagePositionDesktop',
              type: 'select',
              dbName: 'img_pos_d',
              defaultValue: 'center',
              label: 'Desktop position',
              options: [...imagePositionOptions],
              admin: {
                width: '25%',
              },
            },
          ],
        },
      ],
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
        ActivitiesDetailGrid,
        ActivityChoiceCta,
        Arrow,
        CallToAction,
        Content,
        EventFilters,
        Title,
        Subtitle,
        TextBackdrop,
        Flexbox,
        FeatureGrid,
        ThreePanelShowcase,
        QuoteBanner,
        TornCards,
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
