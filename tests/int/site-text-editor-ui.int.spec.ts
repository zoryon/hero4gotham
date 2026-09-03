import React from 'react'

import { SiteTextEditor } from '@/components/SiteTextEditor/Editor.client'
import type { SiteTextDocument, SiteTextDocumentSummary } from '@/siteText/types'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

const index: SiteTextDocumentSummary[] = [
  { area: 'Pagine', sourceID: 'collection:pages:1', title: 'Home', version: 'v1' },
]

const siteDocument: SiteTextDocument = {
  area: 'Pagine',
  controls: [
    {
      control: 'text',
      id: 'title-id',
      label: 'Titolo',
      required: true,
      section: 'Hero',
      value: 'Titolo originale',
    },
    {
      control: 'textarea',
      id: 'body-id',
      label: 'Descrizione',
      required: false,
      section: 'Contenuto',
      value: 'Testo lungo',
    },
  ],
  sourceID: 'collection:pages:1',
  title: 'Home',
  version: 'v1',
}

const selectHome = async () => {
  fireEvent.change(screen.getByLabelText('Area'), { target: { value: 'Pagine' } })
  fireEvent.change(screen.getByLabelText('Contenuto'), {
    target: { value: 'collection:pages:1' },
  })
  await screen.findByRole('textbox', { name: 'Titolo' })
}

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

describe('site text editor', () => {
  it('renders compact selectors, sections, and text-only controls', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => Response.json({ document: siteDocument })),
    )
    render(React.createElement(SiteTextEditor, { initialIndex: index }))

    await selectHome()

    expect((screen.getByRole('button', { name: 'Salva' }) as HTMLButtonElement).disabled).toBe(true)
    expect(document.body.contains(screen.getByRole('textbox', { name: 'Titolo' }))).toBe(true)
    expect(document.body.contains(screen.getByRole('textbox', { name: 'Descrizione' }))).toBe(true)
    expect(screen.queryByLabelText(/colore/i)).toBeNull()
    expect(screen.queryByLabelText(/immagine/i)).toBeNull()
  })

  it('sends only changed text and warns before leaving', async () => {
    const fetchMock = vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
      if (init?.method === 'PATCH') {
        return Response.json({
          document: { ...siteDocument, version: 'v2' },
          message: 'Testi pubblicati.',
        })
      }
      return Response.json({ document: siteDocument })
    })
    vi.stubGlobal('fetch', fetchMock)
    render(React.createElement(SiteTextEditor, { initialIndex: index }))
    await selectHome()

    fireEvent.change(screen.getByRole('textbox', { name: 'Titolo' }), {
      target: { value: 'Titolo nuovo' },
    })
    const unload = new Event('beforeunload', { cancelable: true })
    window.dispatchEvent(unload)
    expect(unload.defaultPrevented).toBe(true)

    fireEvent.click(screen.getByRole('button', { name: 'Salva' }))
    await screen.findByText('Testi pubblicati.')

    const patchCall = fetchMock.mock.calls.find(([, init]) => init?.method === 'PATCH')
    expect(JSON.parse(String(patchCall?.[1]?.body))).toEqual({
      changes: [{ id: 'title-id', value: 'Titolo nuovo' }],
      sourceID: 'collection:pages:1',
      version: 'v1',
    })
    await waitFor(() =>
      expect((screen.getByRole('button', { name: 'Salva' }) as HTMLButtonElement).disabled).toBe(
        true,
      ),
    )
  })
})
