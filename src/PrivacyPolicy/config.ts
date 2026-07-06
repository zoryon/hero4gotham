import type { GlobalConfig } from 'payload'

import { adminOrEventsManager } from '@/access/roles'
import { defaultPrivacyPolicyContent } from './defaultContent'
import { revalidatePrivacyPolicy } from './hooks/revalidatePrivacyPolicy'

export const PrivacyPolicy: GlobalConfig = {
  slug: 'privacyPolicy',
  label: 'Privacy Policy',
  access: {
    read: () => true,
    update: adminOrEventsManager,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'title',
              type: 'text',
              defaultValue: 'Privacy Policy',
              required: true,
            },
            {
              name: 'intro',
              type: 'textarea',
              defaultValue:
                'Informativa sul trattamento dei dati personali ai sensi del Regolamento (UE) 2016/679 e della normativa italiana applicabile.',
            },
            {
              name: 'lastUpdatedLabel',
              type: 'text',
              defaultValue: 'Ultimo aggiornamento',
              required: true,
            },
            {
              name: 'content',
              type: 'richText',
              defaultValue: defaultPrivacyPolicyContent,
              required: true,
            },
          ],
        },
        {
          label: 'Background',
          fields: [
            {
              name: 'backgroundImage',
              type: 'upload',
              label: 'Desktop background image',
              relationTo: 'media',
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
                      options: [
                        { label: 'Center', value: 'center' },
                        { label: 'Top', value: 'top' },
                        { label: 'Bottom', value: 'bottom' },
                        { label: 'Left', value: 'left' },
                        { label: 'Right', value: 'right' },
                        { label: 'Top left', value: 'topLeft' },
                        { label: 'Top right', value: 'topRight' },
                        { label: 'Bottom left', value: 'bottomLeft' },
                        { label: 'Bottom right', value: 'bottomRight' },
                      ],
                      admin: {
                        width: '25%',
                      },
                    },
                    {
                      name: 'imagePositionTablet',
                      type: 'select',
                      defaultValue: 'center',
                      label: 'Tablet position',
                      options: [
                        { label: 'Center', value: 'center' },
                        { label: 'Top', value: 'top' },
                        { label: 'Bottom', value: 'bottom' },
                        { label: 'Left', value: 'left' },
                        { label: 'Right', value: 'right' },
                        { label: 'Top left', value: 'topLeft' },
                        { label: 'Top right', value: 'topRight' },
                        { label: 'Bottom left', value: 'bottomLeft' },
                        { label: 'Bottom right', value: 'bottomRight' },
                      ],
                      admin: {
                        width: '25%',
                      },
                    },
                    {
                      name: 'imagePositionDesktop',
                      type: 'select',
                      defaultValue: 'center',
                      label: 'Desktop position',
                      options: [
                        { label: 'Center', value: 'center' },
                        { label: 'Top', value: 'top' },
                        { label: 'Bottom', value: 'bottom' },
                        { label: 'Left', value: 'left' },
                        { label: 'Right', value: 'right' },
                        { label: 'Top left', value: 'topLeft' },
                        { label: 'Top right', value: 'topRight' },
                        { label: 'Bottom left', value: 'bottomLeft' },
                        { label: 'Bottom right', value: 'bottomRight' },
                      ],
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
                { label: 'None', value: 'none' },
                { label: 'Light', value: 'light' },
                { label: 'Medium', value: 'medium' },
                { label: 'Strong', value: 'strong' },
              ],
            },
            {
              name: 'width',
              type: 'select',
              defaultValue: 'full',
              options: [
                { label: 'Full width', value: 'full' },
                { label: 'Contained', value: 'contained' },
              ],
            },
            {
              name: 'padding',
              type: 'select',
              defaultValue: 'medium',
              options: [
                { label: 'Small', value: 'small' },
                { label: 'Medium', value: 'medium' },
                { label: 'Large', value: 'large' },
              ],
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'metaTitle',
              type: 'text',
              defaultValue: 'Privacy Policy | Hero 4 Gotham',
            },
            {
              name: 'metaDescription',
              type: 'textarea',
              defaultValue:
                'Informativa privacy del sito Hero 4 Gotham sul trattamento dei dati personali, moduli di contatto, candidature, documenti, cookie e diritti GDPR.',
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidatePrivacyPolicy],
  },
}
