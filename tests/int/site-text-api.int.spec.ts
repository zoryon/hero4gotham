import type { Field, Payload } from 'payload'

import { handleGetSiteTexts, handlePatchSiteTexts } from '@/app/(payload)/api/site-texts/route'
import { siteTextField } from '@/siteText/field'
import { extractSiteTextControls } from '@/siteText/traverse'
import { describe, expect, it, vi } from 'vitest'

const fields: Field[] = [
  siteTextField({ name: 'title', type: 'text' }, { label: 'Titolo', section: 'Contenuto' }),
]
const page = { id: 1, title: 'Home', updatedAt: 'current-version' }
const manager = { id: 2, role: 'eventsManager' }

const makePayload = () =>
  ({
    config: { collections: [{ fields, slug: 'pages', versions: { drafts: true } }], globals: [] },
    db: {
      beginTransaction: vi.fn(async () => 'transaction-id'),
      commitTransaction: vi.fn(async () => undefined),
      rollbackTransaction: vi.fn(async () => undefined),
    },
    find: vi.fn(async () => ({ docs: [page] })),
    findByID: vi.fn(async () => page),
    findGlobal: vi.fn(),
    logger: { error: vi.fn() },
    update: vi.fn(async ({ data }) => ({ ...page, ...data, updatedAt: 'saved-version' })),
    updateGlobal: vi.fn(),
  }) as unknown as Payload

describe('site text API handlers', () => {
  it('returns 401 for an expired session', async () => {
    const response = await handleGetSiteTexts(
      new Request('http://localhost/api/site-texts'),
      makePayload(),
      null,
    )
    expect(response.status).toBe(401)
  })

  it('returns 403 for a role that cannot manage site text', async () => {
    const response = await handleGetSiteTexts(
      new Request('http://localhost/api/site-texts'),
      makePayload(),
      { role: 'viewer' },
    )
    expect(response.status).toBe(403)
  })

  it('returns the document index and publishes valid changes', async () => {
    const payload = makePayload()
    const indexResponse = await handleGetSiteTexts(
      new Request('http://localhost/api/site-texts'),
      payload,
      manager,
    )
    expect(indexResponse.status).toBe(200)

    const [control] = extractSiteTextControls(fields, page)
    const saveResponse = await handlePatchSiteTexts(
      new Request('http://localhost/api/site-texts', {
        body: JSON.stringify({
          changes: [{ id: control.id, value: 'Nuova home' }],
          sourceID: 'collection:pages:1',
          version: 'current-version',
        }),
        method: 'PATCH',
      }),
      payload,
      manager,
    )

    expect(saveResponse.status).toBe(200)
    await expect(saveResponse.json()).resolves.toMatchObject({ message: 'Testi pubblicati.' })
  })

  it.each([
    ['invalid source', 'collection:users:1', 400],
    ['stale version', 'collection:pages:1', 409],
  ])('maps %s to status %i', async (_label, sourceID, expectedStatus) => {
    const response = await handlePatchSiteTexts(
      new Request('http://localhost/api/site-texts', {
        body: JSON.stringify({ changes: [], sourceID, version: 'stale-version' }),
        method: 'PATCH',
      }),
      makePayload(),
      manager,
    )
    expect(response.status).toBe(expectedStatus)
  })

  it('maps missing documents to 404 without exposing the internal error', async () => {
    const payload = makePayload()
    vi.mocked(payload.findByID).mockRejectedValueOnce(
      Object.assign(new Error('database path'), { status: 404 }),
    )

    const response = await handleGetSiteTexts(
      new Request('http://localhost/api/site-texts?sourceID=collection%3Apages%3A999'),
      payload,
      manager,
    )
    expect(response.status).toBe(404)
    expect(await response.text()).not.toContain('database path')
  })

  it('maps unexpected failures to 500 and logs them', async () => {
    const payload = makePayload()
    vi.mocked(payload.find).mockRejectedValueOnce(new Error('database unavailable'))

    const response = await handleGetSiteTexts(
      new Request('http://localhost/api/site-texts'),
      payload,
      manager,
    )
    expect(response.status).toBe(500)
    expect(payload.logger.error).toHaveBeenCalledOnce()
  })
})
