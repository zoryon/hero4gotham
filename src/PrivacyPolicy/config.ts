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
