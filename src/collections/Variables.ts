import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  CollectionBeforeChangeHook,
  CollectionConfig,
} from 'payload'

import { adminOrEventsManager } from '@/access/roles'
import { revalidatePath, revalidateTag } from 'next/cache'

const lockedTextField = '@/components/LockedVariableFields#LockedVariableTextField'
const lockedTextareaField = '@/components/LockedVariableFields#LockedVariableTextareaField'
const lockedSelectField = '@/components/LockedVariableFields#LockedVariableSelectField'

const lockAfterSave: CollectionBeforeChangeHook = ({ data }) => {
  if (data) data.unlockEditing = false
  return data
}

const revalidateVariables = () => {
  revalidateTag('cms-variables', 'max')
  revalidatePath('/', 'layout')
}

const revalidateVariablesAfterChange: CollectionAfterChangeHook = ({ doc, req }) => {
  if (!req.context.disableRevalidate) revalidateVariables()
  return doc
}

const revalidateVariablesAfterDelete: CollectionAfterDeleteHook = ({ doc, req }) => {
  if (!req.context.disableRevalidate) revalidateVariables()
  return doc
}

const isValidDate = (value: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const date = new Date(`${value}T00:00:00Z`)
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
}

export const Variables: CollectionConfig = {
  slug: 'variables',
  access: {
    create: adminOrEventsManager,
    delete: adminOrEventsManager,
    read: () => true,
    update: adminOrEventsManager,
  },
  admin: {
    defaultColumns: ['name', 'type', 'value', 'updatedAt'],
    group: 'Content',
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'unlockEditing',
      type: 'checkbox',
      defaultValue: false,
      label: 'Sblocca modifiche',
      admin: {
        description:
          'Attiva per modificare nome, tipo o valore. Dopo il salvataggio i campi verranno bloccati di nuovo.',
        position: 'sidebar',
      },
    },
    {
      name: 'name',
      type: 'text',
      index: true,
      label: 'Nome variabile',
      required: true,
      unique: true,
      admin: {
        components: {
          Field: lockedTextField,
        },
        description:
          'Usa lettere minuscole, numeri e underscore. Esempio: quota_annuale. Nel testo scrivi {{quota_annuale}}.',
      },
      validate: (value: unknown) =>
        typeof value === 'string' && /^[a-z][a-z0-9_]*$/.test(value)
          ? true
          : 'Usa solo lettere minuscole, numeri e underscore; il nome deve iniziare con una lettera.',
    },
    {
      name: 'type',
      type: 'select',
      defaultValue: 'text',
      label: 'Tipo',
      options: [
        { label: 'Testo', value: 'text' },
        { label: 'Numero', value: 'number' },
        { label: 'Data', value: 'date' },
        { label: 'Sì / No', value: 'boolean' },
      ],
      required: true,
      admin: {
        components: {
          Field: lockedSelectField,
        },
      },
    },
    {
      name: 'value',
      type: 'textarea',
      label: 'Valore',
      required: true,
      admin: {
        components: {
          Field: lockedTextareaField,
        },
        description: 'Per le date usa AAAA-MM-GG. Per Sì / No usa sì, no, true, false, 1 oppure 0.',
      },
      validate: (value: unknown, { siblingData }: { siblingData: Record<string, unknown> }) => {
        if (typeof value !== 'string' || !value.trim()) return 'Inserisci un valore.'

        const normalizedValue = value.trim()

        if (siblingData.type === 'number' && !Number.isFinite(Number(normalizedValue))) {
          return 'Inserisci un numero valido.'
        }

        if (siblingData.type === 'date' && !isValidDate(normalizedValue)) {
          return 'Inserisci una data valida nel formato AAAA-MM-GG.'
        }

        if (
          siblingData.type === 'boolean' &&
          !['sì', 'si', 'no', 'true', 'false', '1', '0'].includes(normalizedValue.toLowerCase())
        ) {
          return 'Per il tipo Sì / No usa sì, no, true, false, 1 oppure 0.'
        }

        return true
      },
    },
  ],
  hooks: {
    afterChange: [revalidateVariablesAfterChange],
    afterDelete: [revalidateVariablesAfterDelete],
    beforeChange: [lockAfterSave],
  },
  labels: {
    plural: 'Variabili',
    singular: 'Variabile',
  },
}
