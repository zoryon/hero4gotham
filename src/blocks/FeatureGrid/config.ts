import type { Block } from 'payload'

export const FeatureGrid: Block = {
  slug: 'featureGrid',
  interfaceName: 'FeatureGridBlock',
  fields: [
    {
      name: 'columns',
      type: 'select',
      defaultValue: 'four',
      options: [
        {
          label: '2 columns',
          value: 'two',
        },
        {
          label: '3 columns',
          value: 'three',
        },
        {
          label: '4 columns',
          value: 'four',
        },
      ],
      required: true,
    },
    {
      name: 'style',
      type: 'select',
      defaultValue: 'gothamDark',
      options: [
        {
          label: 'Gotham dark',
          value: 'gothamDark',
        },
        {
          label: 'Transparent',
          value: 'transparent',
        },
      ],
      required: true,
    },
    {
      name: 'items',
      type: 'array',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
        },
      ],
      labels: {
        plural: 'Features',
        singular: 'Feature',
      },
      minRows: 1,
      required: true,
    },
  ],
  labels: {
    plural: 'Feature Grids',
    singular: 'Feature Grid',
  },
}
