import type { GlobalConfig } from 'payload'

import {
  adminFieldOnly,
  adminOrEventsManagerField,
  adminOnly,
  hideFromNonAdmins,
  showToAdmins,
} from '@/access/roles'
import { link } from '@/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
    update: adminOnly,
  },
  admin: {
    group: 'Struttura e design',
    hidden: hideFromNonAdmins,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          admin: {
            condition: showToAdmins,
          },
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'eyebrow',
                  type: 'text',
                  access: {
                    update: adminFieldOnly,
                  },
                  defaultValue: 'ASSOCIAZIONE CULTURALE',
                  admin: {
                    width: '50%',
                  },
                },
                {
                  name: 'brandName',
                  type: 'text',
                  access: {
                    update: adminFieldOnly,
                  },
                  defaultValue: 'IL SORRISO STORTO',
                  required: true,
                  admin: {
                    width: '50%',
                  },
                },
              ],
            },
            {
              name: 'description',
              type: 'textarea',
              access: {
                update: adminFieldOnly,
              },
              defaultValue:
                'Un luogo storto al punto giusto per arte, incontri, giochi e idee fuori asse.',
            },
            {
              name: 'legalNote',
              type: 'text',
              access: {
                update: adminFieldOnly,
              },
              defaultValue: 'Associazione culturale. Tutti i diritti riservati.',
            },
          ],
        },
        {
          label: 'Links',
          fields: [
            {
              name: 'navItems',
              type: 'array',
              access: {
                update: adminOrEventsManagerField,
              },
              fields: [
                link({
                  appearances: false,
                }),
                {
                  name: 'openCookiePreferences',
                  type: 'checkbox',
                  defaultValue: false,
                  label: 'Open cookie preferences instead of link',
                },
              ],
              label: 'Right / social links',
              maxRows: 6,
              admin: {
                description: 'Small links shown on the bottom-right side of the footer.',
                initCollapsed: true,
                components: {
                  RowLabel: '@/Footer/RowLabel#RowLabel',
                },
              },
            },
            {
              name: 'legalLinks',
              type: 'array',
              access: {
                update: adminFieldOnly,
              },
              fields: [
                link({
                  appearances: false,
                }),
                {
                  name: 'openCookiePreferences',
                  type: 'checkbox',
                  defaultValue: false,
                  label: 'Open cookie preferences instead of link',
                },
              ],
              label: 'Legal links',
              maxRows: 4,
              admin: {
                condition: showToAdmins,
                description:
                  'Use custom URLs now, then switch to internal pages after creating the legal pages.',
                initCollapsed: true,
                components: {
                  RowLabel: '@/Footer/RowLabel#RowLabel',
                },
              },
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
