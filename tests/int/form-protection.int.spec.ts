// @vitest-environment node

import {
  createSubmissionRateLimiter,
  getClientIp,
  isMeaningfulSubmission,
} from '@/utilities/formProtection'
import { describe, expect, it } from 'vitest'

describe('inbound form protection', () => {
  it.each([
    'Vorrei ricevere informazioni sulle prossime attivita.',
    'Ciao, posso partecipare al prossimo evento?',
    'Sono interessato al volontariato e vorrei dare una mano.',
  ])('accepts meaningful text: %s', (message) => {
    expect(isMeaningfulSubmission(message)).toBe(true)
  })

  it.each([
    'gjdkjgsklgmlsmg',
    'asdf asdf asdf asdf',
    '1234567890 !!!!!',
    'aaaaaaaaaaaaaaaa',
    'qwertyuiop qwertyuiop',
  ])('rejects clearly random text: %s', (message) => {
    expect(isMeaningfulSubmission(message)).toBe(false)
  })

  it('blocks the fourth request from one IP inside 60 seconds', () => {
    const limiter = createSubmissionRateLimiter({
      longLimit: 10,
      longWindowMs: 15 * 60_000,
      shortLimit: 3,
      shortWindowMs: 60_000,
    })

    expect(limiter.consume('203.0.113.10', 0).allowed).toBe(true)
    expect(limiter.consume('203.0.113.10', 10_000).allowed).toBe(true)
    expect(limiter.consume('203.0.113.10', 20_000).allowed).toBe(true)

    const blocked = limiter.consume('203.0.113.10', 30_000)
    expect(blocked.allowed).toBe(false)
    expect(blocked.retryAfterSeconds).toBe(30)
  })

  it('blocks the eleventh request from one IP inside 15 minutes', () => {
    const limiter = createSubmissionRateLimiter({
      longLimit: 10,
      longWindowMs: 15 * 60_000,
      shortLimit: 3,
      shortWindowMs: 60_000,
    })

    for (let requestNumber = 0; requestNumber < 10; requestNumber += 1) {
      expect(limiter.consume('203.0.113.20', requestNumber * 61_000).allowed).toBe(true)
    }

    expect(limiter.consume('203.0.113.20', 10 * 61_000).allowed).toBe(false)
  })

  it('keeps limits isolated between different IP addresses', () => {
    const limiter = createSubmissionRateLimiter({
      longLimit: 2,
      longWindowMs: 60_000,
      shortLimit: 1,
      shortWindowMs: 10_000,
    })

    expect(limiter.consume('203.0.113.30', 0).allowed).toBe(true)
    expect(limiter.consume('203.0.113.30', 1_000).allowed).toBe(false)
    expect(limiter.consume('203.0.113.31', 1_000).allowed).toBe(true)
  })

  it('reports the later retry time when both windows are exceeded', () => {
    const limiter = createSubmissionRateLimiter({
      longLimit: 3,
      longWindowMs: 15 * 60_000,
      shortLimit: 2,
      shortWindowMs: 60_000,
    })

    expect(limiter.consume('203.0.113.35', 0).allowed).toBe(true)
    expect(limiter.consume('203.0.113.35', 61_000).allowed).toBe(true)
    expect(limiter.consume('203.0.113.35', 62_000).allowed).toBe(true)

    expect(limiter.consume('203.0.113.35', 63_000)).toEqual({
      allowed: false,
      retryAfterSeconds: 837,
    })
  })

  it('uses the first proxy address and normalizes IPv4-mapped addresses', () => {
    const forwardedRequest = new Request('https://example.com', {
      headers: { 'x-forwarded-for': '::ffff:203.0.113.40, 10.0.0.2' },
    })

    expect(getClientIp(forwardedRequest)).toBe('203.0.113.40')
    expect(getClientIp(new Request('https://example.com'))).toBeNull()
  })

  it('reads only the configured proxy header and rejects invalid addresses', () => {
    const request = new Request('https://example.com', {
      headers: {
        'cf-connecting-ip': '203.0.113.50',
        'x-forwarded-for': 'not-an-ip',
      },
    })

    expect(getClientIp(request)).toBeNull()
    expect(getClientIp(request, 'cf-connecting-ip')).toBe('203.0.113.50')
  })
})
