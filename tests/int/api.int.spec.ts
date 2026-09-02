// @vitest-environment node

import { getPayload, Payload } from 'payload'
import config from '@/payload.config'
import type { User } from '@/payload-types'
import { readSiteTextDocument, saveSiteTextDocument } from '@/siteText/service'

import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
  unstable_cache: (callback: unknown) => callback,
}))

let payload: Payload
let adminUser: User
let eventsManager: User
let otherEventsManager: User

const runID = Date.now()
const originalEmail = `events-manager-account-${runID}@example.com`
const updatedEmail = `events-manager-account-updated-${runID}@example.com`
const password = 'account-test-password'
const updatedPassword = 'account-test-password-updated'

describe('API', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })

    adminUser = await payload.create({
      collection: 'users',
      data: {
        email: `admin-account-${runID}@example.com`,
        name: 'Amministratore',
        password,
        role: 'admin',
      },
    })

    eventsManager = await payload.create({
      collection: 'users',
      data: {
        email: originalEmail,
        name: 'Gestore eventi',
        password,
        role: 'eventsManager',
      },
    })

    otherEventsManager = await payload.create({
      collection: 'users',
      data: {
        email: `other-events-manager-${runID}@example.com`,
        name: 'Altro gestore',
        password,
        role: 'eventsManager',
      },
    })
  })

  afterAll(async () => {
    if (adminUser) {
      await payload.delete({ collection: 'users', id: adminUser.id })
    }

    if (eventsManager) {
      await payload.delete({ collection: 'users', id: eventsManager.id })
    }

    if (otherEventsManager) {
      await payload.delete({ collection: 'users', id: otherEventsManager.id })
    }
  })

  it('fetches users', async () => {
    const users = await payload.find({
      collection: 'users',
    })
    expect(users).toBeDefined()
  })

  it('allows an events manager to read and update their own name, email, and password', async () => {
    const ownAccount = await payload.findByID({
      collection: 'users',
      id: eventsManager.id,
      overrideAccess: false,
      user: eventsManager,
    })

    expect(ownAccount.id).toBe(eventsManager.id)

    eventsManager = await payload.update({
      collection: 'users',
      id: eventsManager.id,
      data: {
        email: updatedEmail,
        name: 'Gestore aggiornato',
        password: updatedPassword,
      },
      overrideAccess: false,
      user: eventsManager,
    })

    expect(eventsManager.name).toBe('Gestore aggiornato')
    expect(eventsManager.email).toBe(updatedEmail)

    await expect(
      payload.login({
        collection: 'users',
        data: {
          email: updatedEmail,
          password,
        },
      }),
    ).rejects.toThrow()

    const loginResult = await payload.login({
      collection: 'users',
      data: {
        email: updatedEmail,
        password: updatedPassword,
      },
    })

    expect(loginResult.user?.id).toBe(eventsManager.id)
  })

  it('does not allow an events manager to change their own role', async () => {
    await payload.update({
      collection: 'users',
      id: eventsManager.id,
      data: {
        role: 'admin',
      },
      overrideAccess: false,
      user: eventsManager,
    })

    const storedAccount = await payload.findByID({
      collection: 'users',
      id: eventsManager.id,
    })

    expect(storedAccount.role).toBe('eventsManager')
  })

  it('does not allow an events manager to read or update another account', async () => {
    await expect(
      payload.findByID({
        collection: 'users',
        id: otherEventsManager.id,
        overrideAccess: false,
        user: eventsManager,
      }),
    ).rejects.toThrow()

    await expect(
      payload.update({
        collection: 'users',
        id: otherEventsManager.id,
        data: {
          name: 'Modifica non autorizzata',
        },
        overrideAccess: false,
        user: eventsManager,
      }),
    ).rejects.toThrow()

    const untouchedAccount = await payload.findByID({
      collection: 'users',
      id: otherEventsManager.id,
    })

    expect(untouchedAccount.name).toBe('Altro gestore')
  })

  it('keeps administrator access to other accounts', async () => {
    const account = await payload.findByID({
      collection: 'users',
      id: otherEventsManager.id,
      overrideAccess: false,
      user: adminUser,
    })

    expect(account.id).toBe(otherEventsManager.id)

    const updatedAccount = await payload.update({
      collection: 'users',
      id: otherEventsManager.id,
      data: {
        name: 'Altro gestore aggiornato',
      },
      overrideAccess: false,
      user: adminUser,
    })

    expect(updatedAccount.name).toBe('Altro gestore aggiornato')
  })

  it('publishes page text for a manager while preserving structure and generic access rules', async () => {
    const page = await payload.create({
      collection: 'pages',
      data: {
        _status: 'draft',
        hero: { type: 'none' },
        layout: [{ blockType: 'content', columns: [] }],
        slug: `site-text-test-${runID}`,
        title: 'Titolo originale',
      },
      draft: true,
    })

    try {
      const before = await payload.findByID({ collection: 'pages', depth: 0, id: page.id })
      const document = await readSiteTextDocument(
        payload,
        eventsManager,
        `collection:pages:${page.id}`,
      )
      const title = document.controls.find((control) => control.value === 'Titolo originale')

      expect(title).toBeDefined()
      await saveSiteTextDocument(payload, eventsManager, {
        changes: [{ id: title!.id, value: 'Titolo pubblicato' }],
        sourceID: document.sourceID,
        version: document.version,
      })

      const after = await payload.findByID({ collection: 'pages', depth: 0, id: page.id })
      expect(after).toMatchObject({
        _status: 'published',
        slug: before.slug,
        title: 'Titolo pubblicato',
      })
      expect(after.hero).toEqual(before.hero)
      expect(after.layout).toEqual(before.layout)

      await expect(
        payload.update({
          collection: 'pages',
          data: { title: 'Tentativo generico' },
          id: page.id,
          overrideAccess: false,
          user: eventsManager,
        }),
      ).rejects.toThrow()
    } finally {
      await payload.delete({
        collection: 'pages',
        context: { disableRevalidate: true },
        id: page.id,
      })
    }
  })
})
