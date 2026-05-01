import type { Block } from 'payload'

import { ActivitiesDetailGrid } from '@/blocks/ActivitiesDetailGrid/config'
import { Arrow } from '@/blocks/Arrow/config'
import { CallToAction } from '@/blocks/CallToAction/config'
import { Content } from '@/blocks/Content/config'
import { FeatureGrid } from '@/blocks/FeatureGrid/config'
import { Flexbox } from '@/blocks/Flexbox/config'
import { MediaBlock } from '@/blocks/MediaBlock/config'
import { Subtitle } from '@/blocks/Subtitle/config'
import { Title } from '@/blocks/Title/config'
import { withBlockLayoutFields } from '@/fields/blockLayout'

export const TextBackdrop: Block = {
  slug: 'textBackdrop',
  interfaceName: 'TextBackdropBlock',
  fields: [
    {
      name: 'preset',
      type: 'select',
      defaultValue: 'leftFog',
      label: 'Effect shape',
      options: [
        {
          label: 'Left fog',
          value: 'leftFog',
        },
        {
          label: 'Centered fog',
          value: 'centerFog',
        },
        {
          label: 'Right fog',
          value: 'rightFog',
        },
        {
          label: 'Wide wash',
          value: 'wideWash',
        },
      ],
    },
    {
      name: 'intensity',
      type: 'select',
      defaultValue: 'strong',
      label: 'Darkness',
      options: [
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
        {
          label: 'Heavy',
          value: 'heavy',
        },
      ],
    },
    {
      name: 'width',
      type: 'select',
      defaultValue: 'content',
      label: 'Effect width',
      options: [
        {
          label: 'Content',
          value: 'content',
        },
        {
          label: 'Narrow',
          value: 'narrow',
        },
        {
          label: 'Container',
          value: 'container',
        },
        {
          label: 'Wide',
          value: 'wide',
        },
        {
          label: 'Extra wide',
          value: 'extraWide',
        },
        {
          label: 'Full width',
          value: 'full',
        },
      ],
    },
    {
      name: 'customMaxWidth',
      type: 'number',
      label: 'Custom max width',
      min: 280,
      max: 1600,
      admin: {
        description:
          'Optional width in px for this one backdrop. Useful when a title needs a specific two-line layout.',
        step: 1,
      },
    },
    {
      name: 'align',
      type: 'select',
      defaultValue: 'left',
      label: 'Align',
      options: [
        {
          label: 'Left',
          value: 'left',
        },
        {
          label: 'Center',
          value: 'center',
        },
        {
          label: 'Right',
          value: 'right',
        },
      ],
    },
    {
      name: 'padding',
      type: 'select',
      defaultValue: 'medium',
      label: 'Breathing room',
      options: [
        {
          label: 'Tight',
          value: 'tight',
        },
        {
          label: 'Medium',
          value: 'medium',
        },
        {
          label: 'Loose',
          value: 'loose',
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'offsetX',
          type: 'number',
          defaultValue: 0,
          label: 'Offset X',
          max: 400,
          min: -400,
          admin: {
            step: 1,
            width: '50%',
          },
        },
        {
          name: 'offsetY',
          type: 'number',
          defaultValue: 0,
          label: 'Offset Y',
          max: 400,
          min: -400,
          admin: {
            step: 1,
            width: '50%',
          },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Manual margin (px)',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'manualMargin',
          type: 'group',
          label: false,
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'top',
                  type: 'number',
                  defaultValue: 0,
                  label: 'Top',
                  max: 1000,
                  min: -1000,
                  admin: {
                    step: 1,
                    width: '25%',
                  },
                },
                {
                  name: 'right',
                  type: 'number',
                  defaultValue: 0,
                  label: 'Right',
                  max: 1000,
                  min: -1000,
                  admin: {
                    step: 1,
                    width: '25%',
                  },
                },
                {
                  name: 'bottom',
                  type: 'number',
                  defaultValue: 0,
                  label: 'Bottom',
                  max: 1000,
                  min: -1000,
                  admin: {
                    step: 1,
                    width: '25%',
                  },
                },
                {
                  name: 'left',
                  type: 'number',
                  defaultValue: 0,
                  label: 'Left',
                  max: 1000,
                  min: -1000,
                  admin: {
                    step: 1,
                    width: '25%',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'blocks',
      type: 'blocks',
      blocks: withBlockLayoutFields([
        ActivitiesDetailGrid,
        Title,
        Subtitle,
        Content,
        Arrow,
        CallToAction,
        Flexbox,
        FeatureGrid,
        MediaBlock,
      ]),
      required: true,
      admin: {
        initCollapsed: true,
      },
      labels: {
        plural: 'Backdrop content',
        singular: 'Backdrop content block',
      },
    },
  ],
  labels: {
    plural: 'Text Backdrops',
    singular: 'Text Backdrop',
  },
}
