'use client'

import type { BlocksFieldClientProps } from 'payload'
import type { FormState } from 'payload'

import { Button, toast, useField, useForm } from '@payloadcms/ui'
import React, { useCallback, useMemo } from 'react'

const clipboardKey = '_payloadClipboard'

type ClipboardBlock = {
  fields?: unknown[]
  slug?: string
}

type ClipboardData = {
  blocks?: ClipboardBlock[]
  data?: FormState
  path?: string
  rowIndex?: number
  type?: string
}

type FieldStateValue = NonNullable<FormState[string]>

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T

const createRowID = () => {
  const bytes = new Uint8Array(12)
  window.crypto.getRandomValues(bytes)

  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

const getClipboardData = (): ClipboardData | null => {
  const raw = window.localStorage.getItem(clipboardKey)

  if (!raw) return null

  try {
    return JSON.parse(raw) as ClipboardData
  } catch (_error) {
    return null
  }
}

const reduceFormStateByPath = ({
  formState,
  path,
}: {
  formState: FormState
  path: string
}): FormState => {
  const reducedState: FormState = {}

  Object.entries(formState).forEach(([fieldPath, fieldState]) => {
    if (!fieldPath.startsWith(path)) return

    const { customComponents: _customComponents, validate: _validate, ...serializableField } =
      fieldState

    reducedState[fieldPath] = {
      ...serializableField,
      rows: Array.isArray(serializableField.rows)
        ? serializableField.rows.map((row) => {
            if (!row || typeof row !== 'object') return row

            const { customComponents: _rowCustomComponents, ...serializableRow } = row
            return serializableRow
          })
        : serializableField.rows,
    }
  })

  return reducedState
}

const getSourceRowPaths = (clipboardData: ClipboardData): string[] => {
  const { data, path, rowIndex } = clipboardData

  if (!data || !path) return []

  if (typeof rowIndex === 'number') return [`${path}.${rowIndex}`]

  const parentRows = data[path]?.rows

  if (Array.isArray(parentRows) && parentRows.length) {
    return parentRows.map((_row, index) => `${path}.${index}`)
  }

  const rowIndexes = new Set<number>()
  const rowPathPattern = new RegExp(`^${path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\.(\\d+)(\\.|$)`)

  Object.keys(data).forEach((fieldPath) => {
    const match = fieldPath.match(rowPathPattern)
    const index = match?.[1] ? Number(match[1]) : NaN

    if (Number.isInteger(index)) rowIndexes.add(index)
  })

  return Array.from(rowIndexes)
    .sort((left, right) => left - right)
    .map((index) => `${path}.${index}`)
}

const getBlockType = ({
  clipboardData,
  sourceRowPath,
}: {
  clipboardData: ClipboardData
  sourceRowPath: string
}) => {
  const fromFieldState = clipboardData.data?.[`${sourceRowPath}.blockType`]?.value

  if (typeof fromFieldState === 'string') return fromFieldState

  const rowIndex = Number(sourceRowPath.split('.').at(-1))
  const row = clipboardData.path ? clipboardData.data?.[clipboardData.path]?.rows?.[rowIndex] : null

  return typeof row?.blockType === 'string' ? row.blockType : null
}

const syncNestedRowIDs = (subFieldState: FormState) => {
  Object.entries(subFieldState).forEach(([relativePath, fieldState]) => {
    if (!relativePath.endsWith('.id') && relativePath !== 'id') return

    const newID = createRowID()
    const idFieldState = fieldState as FieldStateValue

    idFieldState.initialValue = newID
    idFieldState.value = newID

    if (relativePath === 'id') return

    const segments = relativePath.split('.')
    const rowIndex = Number(segments.at(-2))
    const parentPath = segments.slice(0, -2).join('.')
    const parentRows = subFieldState[parentPath]?.rows

    if (Array.isArray(parentRows) && Number.isInteger(rowIndex) && parentRows[rowIndex]) {
      parentRows[rowIndex] = {
        ...parentRows[rowIndex],
        id: newID,
      }
    }
  })
}

const buildSubFieldState = ({
  blockType,
  clipboardData,
  sourceRowPath,
}: {
  blockType: string
  clipboardData: ClipboardData
  sourceRowPath: string
}): FormState => {
  const subFieldState: FormState = {}
  const prefix = `${sourceRowPath}.`

  Object.entries(clipboardData.data || {}).forEach(([fieldPath, fieldState]) => {
    if (!fieldPath.startsWith(prefix)) return

    const relativePath = fieldPath.slice(prefix.length)
    subFieldState[relativePath] = clone(fieldState)
  })

  subFieldState.blockType = {
    initialValue: blockType,
    valid: true,
    value: blockType,
  }

  if (!subFieldState.id) {
    const id = createRowID()
    subFieldState.id = {
      initialValue: id,
      valid: true,
      value: id,
    }
  }

  syncNestedRowIDs(subFieldState)

  return subFieldState
}

export const BlockClipboardControls: React.FC<BlocksFieldClientProps> = ({ field, schemaPath }) => {
  const { addFieldRow, getFields, setModified } = useForm()
  const { path, rows = [] } = useField({ hasRows: true })
  const resolvedSchemaPath = schemaPath ?? field.name
  const allowedBlockSlugs = useMemo(
    () =>
      new Set(
        field.blocks
          ?.map((block) => (typeof block === 'string' ? block : block.slug))
          .filter((slug): slug is string => Boolean(slug)),
      ),
    [field.blocks],
  )

  const copyAllBlocks = useCallback(() => {
    if (!rows.length) {
      toast.error('Non ci sono blocchi da copiare in questa lista.')
      return
    }

    window.localStorage.setItem(
      clipboardKey,
      JSON.stringify({
        blocks: field.blocks,
        data: reduceFormStateByPath({
          formState: getFields(),
          path,
        }),
        path,
        type: 'blocks',
      }),
    )

    toast.success('Lista blocchi copiata.')
  }, [field.blocks, getFields, path, rows.length])

  const appendFromClipboard = useCallback(() => {
    const clipboardData = getClipboardData()

    if (!clipboardData || clipboardData.type !== 'blocks' || !clipboardData.data || !clipboardData.path) {
      toast.error('Clipboard blocchi vuoto o non valido.')
      return
    }

    const sourceRowPaths = getSourceRowPaths(clipboardData)

    if (!sourceRowPaths.length) {
      toast.error('Non ho trovato blocchi nel clipboard.')
      return
    }

    const rowsToAppend = sourceRowPaths.map((sourceRowPath) => {
      const blockType = getBlockType({ clipboardData, sourceRowPath })

      if (!blockType) {
        throw new Error('Un blocco copiato non ha blockType.')
      }

      if (allowedBlockSlugs.size && !allowedBlockSlugs.has(blockType)) {
        throw new Error(`Il blocco "${blockType}" non e consentito in questa posizione.`)
      }

      return {
        blockType,
        subFieldState: buildSubFieldState({
          blockType,
          clipboardData,
          sourceRowPath,
        }),
      }
    })

    rowsToAppend.forEach(({ blockType, subFieldState }, index) => {
      addFieldRow({
        blockType,
        path,
        rowIndex: rows.length + index,
        schemaPath: resolvedSchemaPath,
        subFieldState,
      })
    })

    setModified(true)
    toast.success(`${rowsToAppend.length} blocchi aggiunti in fondo.`)
  }, [addFieldRow, allowedBlockSlugs, path, resolvedSchemaPath, rows.length, setModified])

  return (
    <div
      style={{
        alignItems: 'center',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem',
        margin: '0.75rem 0',
      }}
    >
      <Button buttonStyle="secondary" onClick={copyAllBlocks} size="small" type="button">
        Copia lista
      </Button>
      <Button buttonStyle="secondary" onClick={appendFromClipboard} size="small" type="button">
        Incolla in fondo
      </Button>
      <span style={{ color: 'var(--theme-elevation-500)', fontSize: '0.78rem' }}>
        Incolla aggiunge senza sovrascrivere.
      </span>
    </div>
  )
}
