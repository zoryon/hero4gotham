import type { Field, GlobalConfig } from 'payload'

import { revalidateThemeColors } from './hooks/revalidateThemeColors'

const colorField = (name: string, label: string, defaultValue: string): Field => ({
  name,
  type: 'text',
  defaultValue,
  label,
  admin: {
    description: 'Usa un valore CSS valido, ad esempio #f5f5f4, rgb(245 245 244) o oklch(...).',
  },
})

export const ThemeColors: GlobalConfig = {
  slug: 'themeColors',
  label: 'Theme Colors',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'text',
      type: 'group',
      label: 'Text colors',
      fields: [
        colorField('primary', 'Text primary', '#f4f4f5'),
        colorField('secondary', 'Text secondary', '#fde68a'),
        colorField('muted', 'Text muted', 'rgb(253 230 138 / 0.85)'),
        colorField('accent', 'Text accent', '#a3e635'),
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateThemeColors],
  },
}
