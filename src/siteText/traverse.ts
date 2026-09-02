import type { Block, Field } from 'payload'

import { extractLexicalTextLeaves, type SiteTextPath } from './richText'
import type {
  SiteTextChange,
  SiteTextControl,
  SiteTextControlType,
  SiteTextFieldOptions,
} from './types'

type DataRecord = Record<string, unknown>

type InternalControl = SiteTextControl & {
  fromDefault: boolean
  path: SiteTextPath
}

type TraversableField = Field & {
  blocks?: Block[]
  custom?: Record<string, unknown>
  defaultValue?: unknown
  fields?: Field[]
  label?: unknown
  name?: string
  required?: boolean
  tabs?: Array<{ fields: Field[]; name?: string }>
}

const isRecord = (value: unknown): value is DataRecord =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value)

const humanize = (value: string) => {
  const words = value
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .trim()

  return words ? `${words.charAt(0).toUpperCase()}${words.slice(1)}` : 'Testo'
}

const fieldLabel = (field: TraversableField, options: SiteTextFieldOptions) => {
  if (options.label) return options.label
  if (typeof field.label === 'string') return field.label
  return humanize(field.name || 'testo')
}

const getSiteTextOptions = (field: TraversableField): SiteTextFieldOptions | null => {
  const value = field.custom?.siteText

  if (!isRecord(value) || typeof value.section !== 'string') return null

  return {
    description: typeof value.description === 'string' ? value.description : undefined,
    label: typeof value.label === 'string' ? value.label : undefined,
    section: value.section,
  }
}

const getAtPath = (value: unknown, path: SiteTextPath): unknown =>
  path.reduce<unknown>((current, segment) => {
    if (Array.isArray(current) && typeof segment === 'number') return current[segment]
    if (isRecord(current) && typeof segment === 'string') return current[segment]
    return undefined
  }, value)

const setAtPath = (value: unknown, path: SiteTextPath, nextValue: string) => {
  if (path.length === 0) throw new Error('Percorso di testo non valido')

  let current = value

  for (const [index, segment] of path.slice(0, -1).entries()) {
    const nextSegment = path[index + 1]

    if (Array.isArray(current) && typeof segment === 'number') {
      current = current[segment]
    } else if (isRecord(current) && typeof segment === 'string') {
      if (current[segment] === undefined && typeof nextSegment === 'string') {
        current[segment] = {}
      }
      current = current[segment]
    } else {
      throw new Error('Struttura del testo non valida')
    }
  }

  const finalSegment = path[path.length - 1]

  if (Array.isArray(current) && typeof finalSegment === 'number') {
    current[finalSegment] = nextValue
    return
  }

  if (isRecord(current) && typeof finalSegment === 'string') {
    current[finalSegment] = nextValue
    return
  }

  throw new Error('Struttura del testo non valida')
}

const pathID = (path: SiteTextPath) => Buffer.from(JSON.stringify(path)).toString('base64url')

const simpleControl = (
  field: TraversableField,
  value: unknown,
  path: SiteTextPath,
  idPath: SiteTextPath,
  options: SiteTextFieldOptions,
  control: SiteTextControlType,
): InternalControl | null => {
  const fromDefault = typeof value !== 'string' && typeof field.defaultValue === 'string'
  const resolvedValue = typeof value === 'string' ? value : field.defaultValue
  if (typeof resolvedValue !== 'string') return null

  return {
    ...options,
    control,
    fromDefault,
    id: pathID(idPath),
    label: fieldLabel(field, options),
    path,
    required: field.required === true,
    value: resolvedValue,
  }
}

const collectFields = (
  fields: Field[],
  data: unknown,
  basePath: SiteTextPath = [],
  baseIDPath: SiteTextPath = basePath,
): InternalControl[] => {
  if (!isRecord(data)) return []

  return fields.flatMap((rawField) => {
    const field = rawField as TraversableField

    if (field.type === 'tabs' && Array.isArray(field.tabs)) {
      return field.tabs.flatMap((tab) => {
        const tabName = 'name' in tab && typeof tab.name === 'string' ? tab.name : null

        if (tabName) {
          return collectFields(
            tab.fields,
            data[tabName],
            [...basePath, tabName],
            [...baseIDPath, tabName],
          )
        }

        return collectFields(tab.fields, data, basePath, baseIDPath)
      })
    }

    if ((field.type === 'row' || field.type === 'collapsible') && Array.isArray(field.fields)) {
      return collectFields(field.fields, data, basePath, baseIDPath)
    }

    if (!field.name) return []

    const fieldPath = [...basePath, field.name]
    const fieldIDPath = [...baseIDPath, field.name]
    const fieldValue = data[field.name]

    if (field.type === 'group' && Array.isArray(field.fields)) {
      return collectFields(
        field.fields,
        isRecord(fieldValue) ? fieldValue : {},
        fieldPath,
        fieldIDPath,
      )
    }

    if (field.type === 'array' && Array.isArray(field.fields) && Array.isArray(fieldValue)) {
      return fieldValue.flatMap((row, index) => {
        const rowID =
          isRecord(row) && ['string', 'number'].includes(typeof row.id)
            ? `row:${String(row.id)}`
            : index

        return collectFields(
          field.fields || [],
          row,
          [...fieldPath, index],
          [...fieldIDPath, rowID],
        )
      })
    }

    if (field.type === 'blocks' && Array.isArray(field.blocks) && Array.isArray(fieldValue)) {
      return fieldValue.flatMap((row, index) => {
        if (!isRecord(row) || typeof row.blockType !== 'string') return []
        const block = field.blocks?.find(({ slug }) => slug === row.blockType)
        const rowID = ['string', 'number'].includes(typeof row.id)
          ? `block:${String(row.id)}`
          : `block:${row.blockType}:${index}`
        return block
          ? collectFields(block.fields, row, [...fieldPath, index], [...fieldIDPath, rowID])
          : []
      })
    }

    const options = getSiteTextOptions(field)
    if (!options) return []

    if (field.type === 'text') {
      const control = simpleControl(field, fieldValue, fieldPath, fieldIDPath, options, 'text')
      return control ? [control] : []
    }

    if (field.type === 'textarea') {
      const control = simpleControl(field, fieldValue, fieldPath, fieldIDPath, options, 'textarea')
      return control ? [control] : []
    }

    if (field.type === 'richText') {
      const label = fieldLabel(field, options)
      return extractLexicalTextLeaves(fieldValue, fieldPath).map((leaf, index) => ({
        ...options,
        control: 'textarea' as const,
        fromDefault: false,
        id: pathID([...fieldIDPath, ...leaf.path.slice(fieldPath.length)]),
        label: `${label} ${index + 1}`,
        path: leaf.path,
        required: field.required === true,
        value: leaf.value,
      }))
    }

    return []
  })
}

export const extractSiteTextControls = (fields: Field[], data: unknown): SiteTextControl[] =>
  collectFields(fields, data).map(
    ({ fromDefault: _fromDefault, path: _path, ...control }) => control,
  )

export const applySiteTextChanges = <T>(fields: Field[], data: T, changes: SiteTextChange[]): T => {
  const controls = collectFields(fields, data)
  const allowed = new Map(controls.map((control) => [control.id, control]))
  const seen = new Set<string>()
  const updated = structuredClone(data)

  for (const change of changes) {
    if (seen.has(change.id)) throw new Error('Campo di testo duplicato')
    seen.add(change.id)

    const control = allowed.get(change.id)
    if (!control) throw new Error('Campo di testo non valido')
    if (typeof change.value !== 'string') throw new Error('Valore di testo non valido')
    if (typeof getAtPath(updated, control.path) !== 'string' && !control.fromDefault)
      throw new Error('Struttura del testo non valida')

    setAtPath(updated, control.path, change.value)
  }

  return updated
}
