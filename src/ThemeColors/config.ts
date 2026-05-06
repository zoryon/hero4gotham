import type { Field, GlobalConfig } from 'payload'

import { adminOnly, hideFromNonAdmins } from '@/access/roles'
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
    update: adminOnly,
  },
  admin: {
    hidden: hideFromNonAdmins,
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
        colorField('green', 'Text green', '#90a434'),
        colorField('purple', 'Text purple', '#9b5098'),
      ],
    },
    {
      name: 'background',
      type: 'group',
      label: 'Background colors',
      fields: [
        colorField(
          'backgroundContainerOverflow',
          'Background container overflow',
          '#050505',
        ),
      ],
    },
    {
      name: 'vintageBorderImage',
      type: 'upload',
      label: 'Vintage border image',
      relationTo: 'media',
      admin: {
        description: 'Image used by the optional Scribble border / cornice vintage style.',
      },
    },
  ],
  hooks: {
    afterChange: [revalidateThemeColors],
  },
}
