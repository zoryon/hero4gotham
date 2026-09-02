import { mergeSiteCopy, siteCopyDefaults } from '@/SiteCopy/defaults'
import { describe, expect, it } from 'vitest'

describe('site copy', () => {
  it('keeps defaults for missing database fields without mutating defaults', () => {
    const copy = mergeSiteCopy({
      cookie: {
        title: 'Preferenze aggiornate',
      },
    })

    expect(copy.cookie.title).toBe('Preferenze aggiornate')
    expect(copy.cookie.acceptAll).toBe('Accetta tutto')
    expect(copy.notFound.goHome).toBe('Torna alla home')
    expect(siteCopyDefaults.cookie.title).toBe('Gestisci i cookie')
  })

  it('ignores unknown and non-string values from stored content', () => {
    const copy = mergeSiteCopy({
      cookie: {
        acceptAll: 42,
        extra: 'non consentito',
      },
      injected: {
        title: 'non consentito',
      },
    })

    expect(copy.cookie.acceptAll).toBe('Accetta tutto')
    expect('extra' in copy.cookie).toBe(false)
    expect('injected' in copy).toBe(false)
  })

  it('contains every frontend copy group used by the site', () => {
    expect(Object.keys(siteCopyDefaults).sort()).toEqual([
      'accessibility',
      'common',
      'cookie',
      'eventDetail',
      'eventSuite',
      'footer',
      'forms',
      'notFound',
      'pagination',
      'posts',
      'privacy',
      'search',
      'seo',
    ])
  })
})
