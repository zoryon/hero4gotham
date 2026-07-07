import type { GlobalConfig } from 'payload'

import { adminOnly, hideFromNonAdmins } from '@/access/roles'
import { revalidateSiteBackground } from './hooks/revalidateSiteBackground'

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

export const SiteBackground: GlobalConfig = {
  slug: 'siteBackground',
  label: 'Site Background',
  access: {
    read: () => true,
    update: adminOnly,
  },
  admin: {
    hidden: hideFromNonAdmins,
  },
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
  ],
  hooks: {
    afterChange: [revalidateSiteBackground],
  },
}
