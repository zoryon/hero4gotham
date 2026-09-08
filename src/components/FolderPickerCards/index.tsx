'use client'

import { useFolder } from '@payloadcms/ui'
import { Folder } from 'lucide-react'
import type { FolderOrDocument } from 'payload/shared'
import React, { useEffect, useRef } from 'react'

export function FolderPickerCards({ items }: { items: FolderOrDocument[] }) {
  const { checkIfItemIsDisabled, focusedRowIndex, onItemClick, onItemKeyPress, selectedItemKeys } =
    useFolder()
  const buttons = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    buttons.current[focusedRowIndex]?.focus({ preventScroll: true })
  }, [focusedRowIndex])

  return (
    <div className="h4g-folder-picker">
      {items.map((item, index) => (
        <button
          aria-pressed={selectedItemKeys.has(item.itemKey)}
          className="h4g-folder-picker__item"
          disabled={checkIfItemIsDisabled(item)}
          key={item.itemKey}
          onClick={(event) => onItemClick({ event, index, item })}
          onKeyDown={(event) => {
            if (
              event.code.startsWith('Arrow') ||
              event.code === 'Escape' ||
              (event.code === 'Enter' && selectedItemKeys.has(item.itemKey))
            ) {
              event.preventDefault()
              onItemKeyPress({ event, index, item })
            }
          }}
          ref={(button) => {
            buttons.current[index] = button
          }}
          type="button"
        >
          <Folder aria-hidden="true" size={22} />
          <span>{item.value._folderOrDocumentTitle}</span>
        </button>
      ))}
    </div>
  )
}
