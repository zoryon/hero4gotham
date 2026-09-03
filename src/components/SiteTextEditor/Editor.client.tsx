'use client'

import React, { useEffect, useMemo, useState } from 'react'

import type { SiteTextDocument, SiteTextDocumentSummary } from '@/siteText/types'
import './index.scss'

type Props = { initialIndex?: SiteTextDocumentSummary[] }
type Notice = { kind: 'error' | 'success'; message: string } | null

const responseMessage = async (response: Response) => {
  const body = (await response.json().catch(() => ({}))) as { message?: string }
  return body.message || 'Operazione non riuscita.'
}

export function SiteTextEditor({ initialIndex }: Props) {
  const [documents, setDocuments] = useState<SiteTextDocumentSummary[]>(initialIndex || [])
  const [area, setArea] = useState('')
  const [sourceID, setSourceID] = useState('')
  const [document, setDocument] = useState<SiteTextDocument | null>(null)
  const [drafts, setDrafts] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(!initialIndex)
  const [saving, setSaving] = useState(false)
  const [conflict, setConflict] = useState(false)
  const [notice, setNotice] = useState<Notice>(null)

  const areas = useMemo(() => [...new Set(documents.map((item) => item.area))], [documents])
  const areaDocuments = useMemo(
    () => documents.filter((item) => item.area === area),
    [area, documents],
  )
  const dirty = Boolean(document?.controls.some((control) => drafts[control.id] !== control.value))

  const installDocument = (next: SiteTextDocument) => {
    setDocument(next)
    setDrafts(Object.fromEntries(next.controls.map((control) => [control.id, control.value])))
    setConflict(false)
  }

  useEffect(() => {
    if (initialIndex) return
    void (async () => {
      try {
        const response = await fetch('/api/site-texts')
        if (!response.ok) throw new Error(await responseMessage(response))
        const body = (await response.json()) as { documents: SiteTextDocumentSummary[] }
        setDocuments(body.documents)
      } catch (error) {
        setNotice({ kind: 'error', message: error instanceof Error ? error.message : 'Errore.' })
      } finally {
        setLoading(false)
      }
    })()
  }, [initialIndex])

  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (!dirty) return
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  const mayNavigate = () => !dirty || window.confirm('Vuoi uscire senza salvare le modifiche?')

  const chooseArea = (nextArea: string) => {
    if (!mayNavigate()) return
    setArea(nextArea)
    setSourceID('')
    setDocument(null)
    setNotice(null)
  }

  const loadDocument = async (nextSourceID: string, force = false) => {
    if (!force && !mayNavigate()) return
    setSourceID(nextSourceID)
    setNotice(null)
    if (!nextSourceID) {
      setDocument(null)
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/site-texts?sourceID=${encodeURIComponent(nextSourceID)}`)
      if (!response.ok) throw new Error(await responseMessage(response))
      const body = (await response.json()) as { document: SiteTextDocument }
      installDocument(body.document)
    } catch (error) {
      setNotice({ kind: 'error', message: error instanceof Error ? error.message : 'Errore.' })
    } finally {
      setLoading(false)
    }
  }

  const save = async () => {
    if (!document || !dirty || saving) return
    setSaving(true)
    setNotice(null)
    setConflict(false)
    try {
      const changes = document.controls
        .filter((control) => drafts[control.id] !== control.value)
        .map((control) => ({ id: control.id, value: drafts[control.id] ?? '' }))
      const response = await fetch('/api/site-texts', {
        body: JSON.stringify({ changes, sourceID: document.sourceID, version: document.version }),
        headers: { 'Content-Type': 'application/json' },
        method: 'PATCH',
      })
      if (!response.ok) {
        const message = await responseMessage(response)
        if (response.status === 409) setConflict(true)
        throw new Error(message)
      }
      const body = (await response.json()) as { document: SiteTextDocument; message?: string }
      installDocument(body.document)
      setNotice({ kind: 'success', message: body.message || 'Testi pubblicati.' })
    } catch (error) {
      setNotice({ kind: 'error', message: error instanceof Error ? error.message : 'Errore.' })
    } finally {
      setSaving(false)
    }
  }

  const sections = document ? [...new Set(document.controls.map((control) => control.section))] : []

  return (
    <main className="site-text-editor">
      <header className="site-text-editor__header">
        <div>
          <h1>Testi del sito</h1>
          <p>Modifica le parole senza cambiare grafica, colori o layout.</p>
        </div>
        <button
          className="site-text-editor__save"
          disabled={!dirty || saving}
          onClick={save}
          type="button"
        >
          {saving ? 'Salvataggio…' : 'Salva'}
        </button>
      </header>

      <div className="site-text-editor__selectors">
        <label>
          <span>Area</span>
          <select onChange={(event) => chooseArea(event.target.value)} value={area}>
            <option value="">Scegli un’area</option>
            {areas.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Contenuto</span>
          <select
            disabled={!area}
            onChange={(event) => void loadDocument(event.target.value)}
            value={sourceID}
          >
            <option value="">Scegli un contenuto</option>
            {areaDocuments.map((item) => (
              <option key={item.sourceID} value={item.sourceID}>
                {item.title}
              </option>
            ))}
          </select>
        </label>
      </div>

      {notice ? (
        <p
          className={`site-text-editor__notice site-text-editor__notice--${notice.kind}`}
          role="status"
        >
          {notice.message}
        </p>
      ) : null}
      {conflict ? (
        <button
          className="site-text-editor__reload"
          onClick={() => void loadDocument(sourceID, true)}
          type="button"
        >
          Ricarica
        </button>
      ) : null}
      {loading ? <p className="site-text-editor__empty">Caricamento…</p> : null}
      {!loading && !document ? (
        <p className="site-text-editor__empty">Scegli un contenuto da modificare.</p>
      ) : null}

      {document ? (
        <div className="site-text-editor__sections">
          {sections.map((section, sectionIndex) => (
            <details key={section} open={sectionIndex === 0}>
              <summary>{section}</summary>
              <div className="site-text-editor__fields">
                {document.controls
                  .filter((control) => control.section === section)
                  .map((control) => (
                    <label key={control.id}>
                      <span>
                        {control.label}
                        {control.required ? ' *' : ''}
                      </span>
                      {control.description ? <small>{control.description}</small> : null}
                      {control.control === 'textarea' ? (
                        <textarea
                          aria-label={control.label}
                          required={control.required}
                          rows={4}
                          value={drafts[control.id] ?? ''}
                          onChange={(event) =>
                            setDrafts((current) => ({
                              ...current,
                              [control.id]: event.target.value,
                            }))
                          }
                        />
                      ) : (
                        <input
                          aria-label={control.label}
                          required={control.required}
                          type="text"
                          value={drafts[control.id] ?? ''}
                          onChange={(event) =>
                            setDrafts((current) => ({
                              ...current,
                              [control.id]: event.target.value,
                            }))
                          }
                        />
                      )}
                    </label>
                  ))}
              </div>
            </details>
          ))}
        </div>
      ) : null}
    </main>
  )
}
