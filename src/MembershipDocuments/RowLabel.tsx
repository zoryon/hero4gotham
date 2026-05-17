'use client'

import type { RowLabelProps } from '@payloadcms/ui'

import { useRowLabel } from '@payloadcms/ui'

export const RowLabel: React.FC<RowLabelProps> = () => {
  const row = useRowLabel<{ title?: string }>()

  const label =
    row.data?.title || `Documento privacy ${String((row.rowNumber || 0) + 1).padStart(2, '0')}`

  return <span>{label}</span>
}
