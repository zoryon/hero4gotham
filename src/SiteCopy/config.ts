import type { Field, GlobalConfig } from 'payload'

import { adminOnly, hideFromNonAdmins } from '@/access/roles'
import { siteTextField } from '@/siteText/field'
import { siteCopyDefaults } from './defaults'
import { revalidateSiteCopy } from './hooks/revalidateSiteCopy'

const groupLabels: Record<keyof typeof siteCopyDefaults, string> = {
  accessibility: 'Accessibilità',
  common: 'Testi comuni',
  cookie: 'Cookie',
  eventDetail: 'Dettaglio evento',
  eventSuite: 'Componenti eventi',
  footer: 'Footer',
  forms: 'Moduli',
  notFound: 'Pagina non trovata',
  pagination: 'Paginazione',
  posts: 'Articoli',
  privacy: 'Privacy',
  search: 'Ricerca',
  seo: 'SEO',
}

const humanize = (value: string) => {
  const words = value.replace(/([a-z0-9])([A-Z])/g, '$1 $2').trim()
  return `${words.charAt(0).toUpperCase()}${words.slice(1)}`
}

const copyField = (name: string, defaultValue: string, section: string): Field => {
  const common = {
    defaultValue,
    label: humanize(name),
    name,
    required: true,
  }
  const field: Field =
    defaultValue.length > 100 ? { ...common, type: 'textarea' } : { ...common, type: 'text' }

  return siteTextField(field, {
    label: humanize(name),
    section,
  })
}

const fields: Field[] = Object.entries(siteCopyDefaults).map(([groupName, values]) => {
  const section = groupLabels[groupName as keyof typeof siteCopyDefaults]

  return {
    name: groupName,
    type: 'group',
    fields: Object.entries(values).map(([name, defaultValue]) =>
      copyField(name, defaultValue, section),
    ),
    label: section,
  }
})

export const SiteCopy: GlobalConfig = {
  slug: 'siteCopy',
  access: {
    read: () => true,
    update: adminOnly,
  },
  admin: {
    hidden: hideFromNonAdmins,
  },
  fields,
  hooks: {
    afterChange: [revalidateSiteCopy],
  },
  label: 'Testi comuni',
}
