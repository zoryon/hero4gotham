import type { Field, Payload } from 'payload'

import { siteTextField } from '@/siteText/field'
import {
  listSiteTextDocuments,
  readSiteTextDocument,
  saveSiteTextDocument,
  SiteTextServiceError,
} from '@/siteText/service'
import { describe, expect, it, vi } from 'vitest'

const pageFields: Field[] = [
  siteTextField(
    { name: 'title', required: true, type: 'text' },
    { label: 'Titolo', section: 'Contenuto' },
  ),
  { name: 'textColor', type: 'text' },
]

const makePayload = () => {
  const page = {
    _status: 'draft',
    id: 7,
    textColor: '#ffffff',
    title: 'Pagina originale',
    updatedAt: '2026-09-02T10:00:00.000Z',
  }
  const siteCopy = {
    common: { loading: 'Caricamento' },
    updatedAt: '2026-09-02T09:00:00.000Z',
  }

  const payload = {
    config: {
      collections: [{ fields: pageFields, slug: 'pages', versions: { drafts: true } }],
      globals: [
        {
          fields: [
            {
              fields: [
                siteTextField(
                  { name: 'loading', type: 'text' },
                  { label: 'Caricamento', section: 'Comuni' },
                ),
              ],
              name: 'common',
              type: 'group',
            },
          ],
          slug: 'siteCopy',
        },
      ],
    },
    db: {
      beginTransaction: vi.fn(async () => 'transaction-id'),
      commitTransaction: vi.fn(async () => undefined),
      rollbackTransaction: vi.fn(async () => undefined),
    },
    find: vi.fn(async () => ({ docs: [page] })),
    findByID: vi.fn(async () => page),
    findGlobal: vi.fn(async () => siteCopy),
    update: vi.fn(async ({ data }) => ({ ...page, ...data, updatedAt: 'new-version' })),
    updateGlobal: vi.fn(async ({ data }) => ({ ...siteCopy, ...data, updatedAt: 'new-version' })),
  }

  return payload as unknown as Payload
}

const manager = { id: 12, role: 'eventsManager' }

describe('site text service', () => {
  it('rejects unauthenticated users before querying Payload', async () => {
    const payload = makePayload()

    await expect(listSiteTextDocuments(payload, null)).rejects.toMatchObject({
      code: 'FORBIDDEN',
      status: 403,
    })
    expect(payload.find).not.toHaveBeenCalled()
  })

  it('lists configured documents and globals for an events manager', async () => {
    const payload = makePayload()

    await expect(listSiteTextDocuments(payload, manager)).resolves.toEqual([
      {
        area: 'Elementi comuni',
        sourceID: 'global:siteCopy',
        title: 'Testi comuni',
        version: '2026-09-02T09:00:00.000Z',
      },
      {
        area: 'Pagine',
        sourceID: 'collection:pages:7',
        title: 'Pagina originale',
        version: '2026-09-02T10:00:00.000Z',
      },
    ])
  })

  it('returns only allowlisted text controls for a document', async () => {
    const payload = makePayload()
    const document = await readSiteTextDocument(payload, manager, 'collection:pages:7')

    expect(document.controls).toHaveLength(1)
    expect(document.controls[0]).toMatchObject({ label: 'Titolo', value: 'Pagina originale' })
    expect(JSON.stringify(document)).not.toContain('#ffffff')
  })

  it('rejects stale saves without issuing an update', async () => {
    const payload = makePayload()
    const document = await readSiteTextDocument(payload, manager, 'collection:pages:7')

    await expect(
      saveSiteTextDocument(payload, manager, {
        changes: [{ id: document.controls[0].id, value: 'Pagina nuova' }],
        sourceID: document.sourceID,
        version: 'stale-version',
      }),
    ).rejects.toMatchObject({ code: 'STALE_VERSION', status: 409 })
    expect(payload.update).not.toHaveBeenCalled()
  })

  it('publishes a minimal text-only patch immediately', async () => {
    const payload = makePayload()
    const document = await readSiteTextDocument(payload, manager, 'collection:pages:7')

    const updated = await saveSiteTextDocument(payload, manager, {
      changes: [{ id: document.controls[0].id, value: 'Pagina nuova' }],
      sourceID: document.sourceID,
      version: document.version,
    })

    expect(payload.update).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: 'pages',
        data: { _status: 'published', title: 'Pagina nuova' },
        draft: false,
        id: '7',
      }),
    )
    expect(updated.version).toBe('new-version')
    expect(payload.db.commitTransaction).toHaveBeenCalledWith('transaction-id')
  })

  it('rejects unknown sources with a typed client error', async () => {
    const payload = makePayload()

    await expect(
      readSiteTextDocument(payload, manager, 'collection:users:1'),
    ).rejects.toBeInstanceOf(SiteTextServiceError)
  })
})
