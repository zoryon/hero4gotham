import React from 'react'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const { onItemClick, onItemKeyPress, state, handler } = vi.hoisted(() => ({
  onItemClick: vi.fn(),
  onItemKeyPress: vi.fn(),
  state: { disabled: false },
  handler: vi.fn(),
}))

vi.mock('@payloadcms/ui', () => ({
  useFolder: () => ({
    checkIfItemIsDisabled: () => state.disabled,
    focusedRowIndex: -1,
    onItemClick,
    onItemKeyPress,
    selectedItemKeys: new Set(),
  }),
}))
vi.mock('@payloadcms/ui/utilities/getFolderResultsComponentAndData', () => ({
  getFolderResultsComponentAndDataHandler: handler,
}))

import { FolderPickerCards } from '@/components/FolderPickerCards'
import { getTouchSafeFolderResults } from '@/components/FolderPickerCards/server'

const folder = {
  itemKey: 'payload-folders-1' as const,
  relationTo: 'payload-folders' as const,
  value: { id: 1, _folderOrDocumentTitle: 'Eventi', folderType: [] },
}

afterEach(cleanup)
beforeEach(() => {
  vi.clearAllMocks()
  state.disabled = false
})

describe('folder picker touch interactions', () => {
  it('does not select or start dragging on a swipe or cancelled pointer', () => {
    render(React.createElement(FolderPickerCards, { items: [folder] }))
    const card = screen.getByRole('button', { name: 'Eventi' })
    fireEvent.pointerDown(card, { pointerType: 'touch', clientY: 100 })
    fireEvent.pointerMove(window, { pointerType: 'touch', clientY: 150 })
    fireEvent.pointerCancel(card, { pointerType: 'touch' })
    fireEvent.pointerUp(window)
    expect(onItemClick).not.toHaveBeenCalled()
    expect(card.getAttribute('draggable')).not.toBe('true')
  })

  it('forwards taps and double taps to the existing folder selection/navigation', () => {
    render(React.createElement(FolderPickerCards, { items: [folder] }))
    const card = screen.getByRole('button', { name: 'Eventi' })
    fireEvent.click(card)
    fireEvent.click(card)
    expect(onItemClick).toHaveBeenCalledTimes(2)
    expect(onItemClick).toHaveBeenLastCalledWith(
      expect.objectContaining({ item: folder, index: 0 }),
    )
  })

  it('respects disabled folders', () => {
    state.disabled = true
    render(React.createElement(FolderPickerCards, { items: [folder] }))
    fireEvent.click(screen.getByRole('button', { name: 'Eventi' }))
    expect(onItemClick).not.toHaveBeenCalled()
  })
})

describe('folder picker server integration', () => {
  const args = {
    browseByFolder: false,
    displayAs: 'grid',
    collectionsToDisplay: ['payload-folders'],
    req: { payload: { config: { folders: { slug: 'payload-folders' } } } },
  } as unknown as Parameters<typeof getTouchSafeFolderResults>[0]

  it('preserves authorized results and breadcrumbs while replacing picker cards', async () => {
    const result = {
      subfolders: [folder],
      documents: [],
      breadcrumbs: [],
      FolderResultsComponent: 'old',
    }
    handler.mockResolvedValue(result)
    const response = await getTouchSafeFolderResults(args)
    expect(handler).toHaveBeenCalledWith(args)
    expect(response).toMatchObject({
      subfolders: result.subfolders,
      breadcrumbs: result.breadcrumbs,
    })
    expect(response.FolderResultsComponent).not.toBe('old')
  })

  it('preserves the regular media browser and errors', async () => {
    const result = { FolderResultsComponent: 'original' }
    handler.mockResolvedValue(result)
    expect(await getTouchSafeFolderResults({ ...args, browseByFolder: true })).toBe(result)
    const error = { message: 'Forbidden' }
    handler.mockResolvedValue(error)
    expect(await getTouchSafeFolderResults(args)).toBe(error)
  })
})
