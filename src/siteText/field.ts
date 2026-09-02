import type { Field } from 'payload'

import type { SiteTextFieldOptions } from './types'

export const siteTextField = <T extends Field>(field: T, options: SiteTextFieldOptions): T => {
  const fieldWithCustom = field as T & { custom?: Record<string, unknown> }

  return {
    ...field,
    custom: {
      ...fieldWithCustom.custom,
      siteText: options,
    },
  } as T
}
