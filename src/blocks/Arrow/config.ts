import type { Block } from 'payload'

import { link } from '@/fields/link'

const variantOptions = [
  {
    label: 'Chevron',
    value: 'chevron',
  },
  {
    label: 'Arrow',
    value: 'arrow',
  },
  {
    label: 'Double chevron',
    value: 'doubleChevron',
  },
] as const

const directionOptions = [
  {
    label: 'Down',
    value: 'down',
  },
  {
    label: 'Up',
    value: 'up',
  },
  {
    label: 'Left',
    value: 'left',
  },
  {
    label: 'Right',
    value: 'right',
  },
] as const

const alignOptions = [
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
] as const

const sizeOptions = [
  {
    label: 'Small',
    value: 'sm',
  },
  {
    label: 'Medium',
    value: 'md',
  },
  {
    label: 'Large',
    value: 'lg',
  },
  {
    label: 'Extra large',
    value: 'xl',
  },
  {
    label: 'Custom',
    value: 'custom',
  },
] as const

const themeColorOptions = [
  {
    label: 'Primary text',
    value: 'primary',
  },
  {
    label: 'Secondary text',
    value: 'secondary',
  },
  {
    label: 'Accent text',
    value: 'accent',
  },
  {
    label: 'Muted text',
    value: 'muted',
  },
  {
    label: 'White',
    value: 'white',
  },
  {
    label: 'Black',
    value: 'black',
  },
  {
    label: 'Success green',
    value: 'success',
  },
] as const

const animationOptions = [
  {
    label: 'None',
    value: 'none',
  },
  {
    label: 'Bounce',
    value: 'bounce',
  },
  {
    label: 'Pulse',
    value: 'pulse',
  },
] as const

const backgroundStyleOptions = [
  {
    label: 'None',
    value: 'none',
  },
  {
    label: 'Soft',
    value: 'soft',
  },
  {
    label: 'Solid',
    value: 'solid',
  },
] as const

export const Arrow: Block = {
  slug: 'arrow',
  interfaceName: 'ArrowBlock',
  fields: [
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'chevron',
      required: true,
      options: [...variantOptions],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'direction',
          type: 'select',
          defaultValue: 'down',
          required: true,
          options: [...directionOptions],
          admin: {
            width: '33%',
          },
        },
        {
          name: 'align',
          type: 'select',
          defaultValue: 'center',
          required: true,
          options: [...alignOptions],
          admin: {
            width: '33%',
          },
        },
        {
          name: 'animation',
          type: 'select',
          defaultValue: 'none',
          required: true,
          options: [...animationOptions],
          admin: {
            width: '34%',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'size',
          type: 'select',
          defaultValue: 'md',
          required: true,
          options: [...sizeOptions],
          admin: {
            width: '33%',
          },
        },
        {
          name: 'strokeWidth',
          type: 'number',
          defaultValue: 8,
          min: 1,
          max: 24,
          required: true,
          admin: {
            width: '33%',
          },
        },
        {
          name: 'roundedEnds',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            width: '34%',
            description: 'Use rounded line endings and joins.',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'customWidth',
          type: 'number',
          defaultValue: 88,
          min: 8,
          max: 1000,
          admin: {
            width: '50%',
            condition: (_, siblingData) => siblingData?.size === 'custom',
          },
        },
        {
          name: 'customHeight',
          type: 'number',
          defaultValue: 88,
          min: 8,
          max: 1000,
          admin: {
            width: '50%',
            condition: (_, siblingData) => siblingData?.size === 'custom',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'colorMode',
          type: 'radio',
          defaultValue: 'theme',
          required: true,
          options: [
            {
              label: 'Theme color',
              value: 'theme',
            },
            {
              label: 'Custom color',
              value: 'custom',
            },
          ],
          admin: {
            width: '50%',
            layout: 'horizontal',
          },
        },
        {
          name: 'themeColor',
          type: 'select',
          defaultValue: 'accent',
          options: [...themeColorOptions],
          admin: {
            width: '50%',
            condition: (_, siblingData) => siblingData?.colorMode !== 'custom',
          },
        },
        {
          name: 'customColor',
          type: 'text',
          defaultValue: '#7dff2a',
          admin: {
            width: '50%',
            condition: (_, siblingData) => siblingData?.colorMode === 'custom',
            description: 'Any valid CSS color, e.g. #7dff2a or rgb(125 255 42).',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'backgroundStyle',
          type: 'select',
          defaultValue: 'none',
          required: true,
          options: [...backgroundStyleOptions],
          admin: {
            width: '50%',
          },
        },
        {
          name: 'backgroundColor',
          type: 'text',
          defaultValue: 'rgba(125, 255, 42, 0.1)',
          admin: {
            width: '50%',
            condition: (_, siblingData) => siblingData?.backgroundStyle !== 'none',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'showGlow',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'glowColor',
          type: 'text',
          defaultValue: 'rgba(125, 255, 42, 0.7)',
          admin: {
            width: '50%',
            condition: (_, siblingData) => Boolean(siblingData?.showGlow),
          },
        },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Custom image (optional)',
    },
    {
      name: 'label',
      type: 'text',
      required: false,
      admin: {
        description: 'Optional text rendered near the arrow.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: false,
    },
    {
      name: 'ariaLabel',
      type: 'text',
      defaultValue: 'Decorative arrow',
      admin: {
        description: 'Used for accessibility when the arrow is interactive.',
      },
    },
    {
      name: 'enableLink',
      type: 'checkbox',
      defaultValue: false,
    },
    link({
      appearances: false,
      disableLabel: true,
      overrides: {
        admin: {
          condition: (_, siblingData) => Boolean(siblingData?.enableLink),
          description: 'Optional target for the arrow. Use internal or custom URL.',
        },
      },
    }),
  ],
  labels: {
    singular: 'Arrow',
    plural: 'Arrows',
  },
}
