'use client'

import type { CheckboxFieldClientComponent } from 'payload'

import { CheckboxField, useAllFormFields } from '@payloadcms/ui'
import { useCallback } from 'react'

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export const AlbumCoverField: CheckboxFieldClientComponent = (props) => {
  const [fields, dispatchFields] = useAllFormFields()
  const { onChange, path } = props

  const handleChange = useCallback(
    (isSelected: boolean) => {
      onChange?.(isSelected)

      if (!isSelected) return

      const pathParts = path.split('.')
      pathParts.splice(-2)
      const galleryPath = pathParts.join('.')
      const coverPathPattern = new RegExp(`^${escapeRegExp(galleryPath)}\\.\\d+\\.isCover$`)

      Object.keys(fields).forEach((fieldPath) => {
        if (fieldPath === path || !coverPathPattern.test(fieldPath)) return
        if (fields[fieldPath]?.value !== true) return

        dispatchFields({
          path: fieldPath,
          type: 'UPDATE',
          value: false,
        })
      })
    },
    [dispatchFields, fields, onChange, path],
  )

  return <CheckboxField {...props} onChange={handleChange} />
}
