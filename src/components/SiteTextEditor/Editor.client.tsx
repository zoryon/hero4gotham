'use client'

import {
  ExternalLink,
  Eye,
  Monitor,
  PanelRight,
  PencilLine,
  RotateCcw,
  Search,
  Smartphone,
  Tablet,
} from 'lucide-react'
import React, { useEffect, useMemo, useRef, useState } from 'react'

import type { SiteTextControl, SiteTextDocument, SiteTextDocumentSummary } from '@/siteText/types'
import './index.scss'

type Props = { initialIndex?: SiteTextDocumentSummary[] }
type Notice = { kind: 'error' | 'success'; message: string } | null
type Device = 'desktop' | 'mobile' | 'tablet'
type MobilePane = 'editor' | 'preview'

const deviceWidths: Record<Device, number | undefined> = {
  desktop: undefined,
  mobile: 390,
  tablet: 768,
}

const normalizeText = (value: string) => value.replace(/\s+/g, ' ').trim()

const responseMessage = async (response: Response) => {
  const body = (await response.json().catch(() => ({}))) as { message?: string }
  return body.message || 'Operazione non riuscita.'
}

export function SiteTextEditor({ initialIndex }: Props) {
  const [documents, setDocuments] = useState<SiteTextDocumentSummary[]>(initialIndex || [])
  const [sourceID, setSourceID] = useState('')
  const [document, setDocument] = useState<SiteTextDocument | null>(null)
  const [drafts, setDrafts] = useState<Record<string, string>>({})
  const [selectedID, setSelectedID] = useState('')
  const [device, setDevice] = useState<Device>('desktop')
  const [mobilePane, setMobilePane] = useState<MobilePane>('preview')
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(!initialIndex)
  const [saving, setSaving] = useState(false)
  const [previewLoading, setPreviewLoading] = useState(false)
  const [previewKey, setPreviewKey] = useState(0)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [conflict, setConflict] = useState(false)
  const [notice, setNotice] = useState<Notice>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const mappedNodes = useRef(new Map<string, Text[]>())
  const frameCleanup = useRef<null | (() => void)>(null)
  const loadSequence = useRef(0)

  const dirty = Boolean(document?.controls.some((control) => drafts[control.id] !== control.value))
  const selectedControl = document?.controls.find((control) => control.id === selectedID) || null
  const sections = useMemo(
    () => (document ? [...new Set(document.controls.map((control) => control.section))] : []),
    [document],
  )
  const visibleControls = useMemo(() => {
    if (!document) return []
    const normalizedQuery = normalizeText(query).toLocaleLowerCase('it')
    if (!normalizedQuery) return document.controls
    return document.controls.filter((control) =>
      `${control.label || ''} ${control.section} ${control.value}`
        .toLocaleLowerCase('it')
        .includes(normalizedQuery),
    )
  }, [document, query])

  const installDocument = (next: SiteTextDocument) => {
    setDocument(next)
    setDrafts(Object.fromEntries(next.controls.map((control) => [control.id, control.value])))
    setSelectedID(next.controls[0]?.id || '')
    setFieldErrors({})
    setConflict(false)
    setPreviewKey((current) => current + 1)
  }

  const loadDocument = async (nextSourceID: string, force = false) => {
    if (!force && dirty && !window.confirm('Vuoi cambiare pagina senza salvare le modifiche?'))
      return
    setSourceID(nextSourceID)
    setDocument(null)
    setNotice(null)
    if (!nextSourceID) return

    setLoading(true)
    const requestSequence = ++loadSequence.current
    try {
      const response = await fetch(`/api/site-texts?sourceID=${encodeURIComponent(nextSourceID)}`)
      if (!response.ok) throw new Error(await responseMessage(response))
      const body = (await response.json()) as { document: SiteTextDocument }
      if (requestSequence === loadSequence.current) installDocument(body.document)
    } catch (error) {
      if (requestSequence === loadSequence.current) {
        setNotice({ kind: 'error', message: error instanceof Error ? error.message : 'Errore.' })
      }
    } finally {
      if (requestSequence === loadSequence.current) setLoading(false)
    }
  }

  useEffect(() => {
    if (initialIndex) return
    void (async () => {
      try {
        const response = await fetch('/api/site-texts')
        if (!response.ok) throw new Error(await responseMessage(response))
        const body = (await response.json()) as { documents: SiteTextDocumentSummary[] }
        setDocuments(body.documents)
        const firstPage = body.documents.find((item) => item.area === 'Pagine') || body.documents[0]
        if (firstPage) void loadDocument(firstPage.sourceID, true)
      } catch (error) {
        setNotice({ kind: 'error', message: error instanceof Error ? error.message : 'Errore.' })
      } finally {
        setLoading(false)
      }
    })()
    // Initial index load is intentionally performed once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialIndex])

  useEffect(() => {
    if (!initialIndex?.length || sourceID) return
    void loadDocument(
      initialIndex.find((item) => item.area === 'Pagine')?.sourceID || initialIndex[0].sourceID,
      true,
    )
    // The initial document is loaded once when server-provided data is available.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialIndex, sourceID])

  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (!dirty) return
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  useEffect(() => {
    if (!dirty) return
    const warnLinkNavigation = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target.closest('a[href]') : null
      if (target && !window.confirm('Vuoi uscire senza salvare le modifiche?')) {
        event.preventDefault()
        event.stopPropagation()
      }
    }
    window.document.addEventListener('click', warnLinkNavigation, true)
    return () => window.document.removeEventListener('click', warnLinkNavigation, true)
  }, [dirty])

  useEffect(() => {
    const receiveSelection = (event: MessageEvent) => {
      if (
        event.origin !== window.location.origin ||
        event.source !== iframeRef.current?.contentWindow
      )
        return
      const payload = event.data as { fieldID?: unknown; type?: unknown }
      if (payload?.type !== 'h4g:select-field' || typeof payload.fieldID !== 'string') return
      if (!document?.controls.some((control) => control.id === payload.fieldID)) return
      setSelectedID(payload.fieldID)
    }
    window.addEventListener('message', receiveSelection)
    return () => window.removeEventListener('message', receiveSelection)
  }, [document])

  const preparePreview = () => {
    frameCleanup.current?.()
    frameCleanup.current = null
    mappedNodes.current.clear()
    const frameWindow = iframeRef.current?.contentWindow
    const frameDocument = iframeRef.current?.contentDocument
    if (!frameWindow || !frameDocument || !document) return

    const style = frameDocument.createElement('style')
    style.dataset.h4gVisualEditor = 'true'
    style.textContent = `
      [data-h4g-field-id] { cursor: text !important; outline: 1px dashed transparent; outline-offset: 4px; transition: outline-color .12s, background-color .12s; }
      [data-h4g-field-id]:hover { outline-color: rgba(183, 213, 42, .9); background: rgba(183, 213, 42, .08); }
      [data-h4g-selected="true"] { outline: 2px solid #b7d52a !important; background: rgba(183, 213, 42, .13) !important; }
    `
    frameDocument.head.appendChild(style)

    const controlsByText = new Map<string, SiteTextControl[]>()
    for (const control of document.controls) {
      const value = normalizeText(control.value)
      if (!value) continue
      controlsByText.set(value, [...(controlsByText.get(value) || []), control])
    }

    const nodesByText = new Map<string, Text[]>()
    const walker = frameDocument.createTreeWalker(frameDocument.body, NodeFilter.SHOW_TEXT)
    let node = walker.nextNode()
    while (node) {
      const textNode = node as Text
      const parent = textNode.parentElement
      const value = normalizeText(textNode.data)
      if (
        parent &&
        value &&
        !['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA'].includes(parent.tagName)
      ) {
        nodesByText.set(value, [...(nodesByText.get(value) || []), textNode])
      }
      node = walker.nextNode()
    }

    for (const [value, textNodes] of nodesByText) {
      const matches = controlsByText.get(value)
      // If several CMS fields contain the same copy, choosing by DOM order could save
      // the wrong field. Those values remain available in the explicit side panel.
      if (matches?.length !== 1) continue
      const fieldID = matches[0].id
      for (const textNode of textNodes) textNode.parentElement!.dataset.h4gFieldId = fieldID
      mappedNodes.current.set(fieldID, textNodes)
    }

    const click = (event: Event) => {
      const target =
        event.target instanceof Element
          ? event.target.closest<HTMLElement>('[data-h4g-field-id]')
          : null
      if (!target?.dataset.h4gFieldId) return
      event.preventDefault()
      event.stopPropagation()
      frameDocument
        .querySelectorAll('[data-h4g-selected]')
        .forEach((element) => element.removeAttribute('data-h4g-selected'))
      target.dataset.h4gSelected = 'true'
      frameWindow.parent.postMessage(
        { fieldID: target.dataset.h4gFieldId, type: 'h4g:select-field' },
        frameWindow.location.origin,
      )
    }
    frameDocument.addEventListener('click', click, true)
    frameCleanup.current = () => {
      frameDocument.removeEventListener('click', click, true)
      style.remove()
    }
    setPreviewLoading(false)
  }

  const updateDraft = (control: SiteTextControl, value: string) => {
    setDrafts((current) => ({ ...current, [control.id]: value }))
    setFieldErrors((current) => ({ ...current, [control.id]: '' }))
    for (const node of mappedNodes.current.get(control.id) || []) node.data = value
  }

  const selectControl = (control: SiteTextControl) => {
    setSelectedID(control.id)
    const nodes = mappedNodes.current.get(control.id) || []
    const frameDocument = iframeRef.current?.contentDocument
    frameDocument
      ?.querySelectorAll('[data-h4g-selected]')
      .forEach((element) => element.removeAttribute('data-h4g-selected'))
    const element = nodes[0]?.parentElement
    if (element) {
      element.dataset.h4gSelected = 'true'
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  const save = async () => {
    if (!document || !dirty || saving) return
    const requiredErrors = Object.fromEntries(
      document.controls
        .filter((control) => control.required && !(drafts[control.id] || '').trim())
        .map((control) => [control.id, 'Questo testo è obbligatorio.']),
    )
    if (Object.keys(requiredErrors).length) {
      setFieldErrors(requiredErrors)
      setNotice({ kind: 'error', message: 'Controlla i campi obbligatori.' })
      return
    }

    setSaving(true)
    setNotice(null)
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
        if (response.status === 409) setConflict(true)
        throw new Error(await responseMessage(response))
      }
      const body = (await response.json()) as { document: SiteTextDocument; message?: string }
      installDocument(body.document)
      setNotice({ kind: 'success', message: body.message || 'Modifiche pubblicate.' })
    } catch (error) {
      setNotice({ kind: 'error', message: error instanceof Error ? error.message : 'Errore.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="site-text-editor">
      <header className="site-text-editor__topbar">
        <div className="site-text-editor__title">
          <span>Editor visuale</span>
          <select
            aria-label="Pagina o area del sito"
            disabled={loading}
            onChange={(event) => void loadDocument(event.target.value)}
            value={sourceID}
          >
            {documents.map((item) => (
              <option key={item.sourceID} value={item.sourceID}>
                {item.area} · {item.title}
              </option>
            ))}
          </select>
        </div>

        <div aria-label="Dimensione anteprima" className="site-text-editor__devices">
          {(
            [
              ['desktop', Monitor, 'Desktop'],
              ['tablet', Tablet, 'Tablet'],
              ['mobile', Smartphone, 'Mobile'],
            ] as const
          ).map(([value, Icon, label]) => (
            <button
              aria-label={label}
              aria-pressed={device === value}
              key={value}
              onClick={() => setDevice(value)}
              type="button"
            >
              <Icon size={17} />
            </button>
          ))}
        </div>

        <div className="site-text-editor__actions">
          {dirty ? (
            <span className="site-text-editor__dirty">Modifiche non salvate</span>
          ) : (
            <span>Pubblicato</span>
          )}
          {document ? (
            <a href={document.previewPath} rel="noreferrer" target="_blank">
              Apri sito <ExternalLink size={14} />
            </a>
          ) : null}
          <button
            className="site-text-editor__save"
            disabled={!dirty || saving}
            onClick={save}
            type="button"
          >
            {saving ? 'Pubblicazione…' : 'Salva e pubblica'}
          </button>
        </div>
      </header>

      <div aria-label="Vista editor" className="site-text-editor__mobile-switch" role="tablist">
        <button
          aria-selected={mobilePane === 'preview'}
          onClick={() => setMobilePane('preview')}
          role="tab"
          type="button"
        >
          <Eye size={15} /> Anteprima
        </button>
        <button
          aria-selected={mobilePane === 'editor'}
          onClick={() => setMobilePane('editor')}
          role="tab"
          type="button"
        >
          <PencilLine size={15} /> Testo
        </button>
      </div>

      {notice ? (
        <div
          className={`site-text-editor__notice site-text-editor__notice--${notice.kind}`}
          role="status"
        >
          {notice.message}
          {conflict ? (
            <button onClick={() => void loadDocument(sourceID, true)} type="button">
              Ricarica versione recente
            </button>
          ) : null}
        </div>
      ) : null}

      <div className={`site-text-editor__workspace site-text-editor__workspace--${mobilePane}`}>
        <section className="site-text-editor__preview" aria-label="Anteprima del sito">
          {previewLoading || loading ? (
            <div className="site-text-editor__preview-loading">Caricamento anteprima…</div>
          ) : null}
          {document ? (
            <div
              className={`site-text-editor__frame-shell site-text-editor__frame-shell--${device}`}
            >
              <iframe
                key={`${document.sourceID}-${previewKey}`}
                onLoad={() => {
                  preparePreview()
                  window.setTimeout(preparePreview, 700)
                }}
                ref={iframeRef}
                src={`${document.previewPath}?h4gVisualEditor=1`}
                style={{ maxWidth: deviceWidths[device] }}
                title={`Anteprima ${document.title}`}
              />
            </div>
          ) : (
            <div className="site-text-editor__preview-empty">
              Seleziona una pagina da modificare.
            </div>
          )}
        </section>

        <aside className="site-text-editor__panel">
          <div className="site-text-editor__panel-heading">
            <PanelRight aria-hidden="true" size={18} />
            <div>
              <strong>{selectedControl?.section || 'Testi della pagina'}</strong>
              <small>{selectedControl?.label || 'Clicca un testo nell’anteprima'}</small>
            </div>
          </div>

          {selectedControl ? (
            <div className="site-text-editor__active-field">
              <label htmlFor="visual-editor-active-field">
                {selectedControl.label || 'Testo selezionato'}
                {selectedControl.required ? ' *' : ''}
              </label>
              {selectedControl.description ? <p>{selectedControl.description}</p> : null}
              {selectedControl.control === 'textarea' ? (
                <textarea
                  aria-invalid={Boolean(fieldErrors[selectedControl.id])}
                  id="visual-editor-active-field"
                  rows={8}
                  value={drafts[selectedControl.id] ?? ''}
                  onChange={(event) => updateDraft(selectedControl, event.target.value)}
                />
              ) : (
                <input
                  aria-invalid={Boolean(fieldErrors[selectedControl.id])}
                  id="visual-editor-active-field"
                  type="text"
                  value={drafts[selectedControl.id] ?? ''}
                  onChange={(event) => updateDraft(selectedControl, event.target.value)}
                />
              )}
              {fieldErrors[selectedControl.id] ? (
                <small className="site-text-editor__field-error">
                  {fieldErrors[selectedControl.id]}
                </small>
              ) : null}
              <button
                className="site-text-editor__reset"
                disabled={drafts[selectedControl.id] === selectedControl.value}
                onClick={() => updateDraft(selectedControl, selectedControl.value)}
                type="button"
              >
                <RotateCcw size={14} /> Annulla modifica
              </button>
            </div>
          ) : (
            <p className="site-text-editor__hint">Clicca una frase nella pagina per iniziare.</p>
          )}

          <div className="site-text-editor__field-browser">
            <div className="site-text-editor__search">
              <Search size={15} />
              <input
                aria-label="Cerca tra i testi"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Cerca un testo…"
                value={query}
              />
            </div>
            <div className="site-text-editor__section-list">
              {sections.map((section) => {
                const controls = visibleControls.filter((control) => control.section === section)
                if (!controls.length) return null
                return (
                  <details
                    key={section}
                    open={controls.some((control) => control.id === selectedID)}
                  >
                    <summary>
                      {section}
                      <span>{controls.length}</span>
                    </summary>
                    <div>
                      {controls.map((control) => (
                        <button
                          className={control.id === selectedID ? 'is-active' : ''}
                          key={control.id}
                          onClick={() => selectControl(control)}
                          type="button"
                        >
                          <span>{control.label || 'Testo'}</span>
                          <small>{drafts[control.id] || 'Testo vuoto'}</small>
                        </button>
                      ))}
                    </div>
                  </details>
                )
              })}
            </div>
          </div>
        </aside>
      </div>
    </main>
  )
}
