// @vitest-environment node

import { getPayload, Payload } from 'payload'
import config from '@/payload.config'
import type { User } from '@/payload-types'

import { afterAll, beforeAll, describe, expect, it } from 'vitest'

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
})
