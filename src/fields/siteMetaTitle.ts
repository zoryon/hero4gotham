import { MetaTitleField } from '@payloadcms/plugin-seo/fields'

import { getSiteTitle } from '@/utilities/siteMetadata'

const normalizeMetaTitle = ({ value }: { value?: null | string }) => getSiteTitle(value)

export const siteMetaTitleField = () =>
  MetaTitleField({
    hasGenerateFn: true,
    overrides: {
      hooks: {
        afterRead: [normalizeMetaTitle],
        beforeValidate: [normalizeMetaTitle],
      },
    },
  })
