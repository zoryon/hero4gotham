import { isIP } from 'node:net'

type RateLimitOptions = {
  longLimit: number
  longWindowMs: number
  shortLimit: number
  shortWindowMs: number
}

type RateLimitResult = {
  allowed: boolean
  retryAfterSeconds: number
}

type SubmissionRateLimiter = {
  consume: (key: string, now?: number) => RateLimitResult
}

const DEFAULT_RATE_LIMIT_OPTIONS: RateLimitOptions = {
  longLimit: 10,
  longWindowMs: 15 * 60_000,
  shortLimit: 3,
  shortWindowMs: 60_000,
}

const MAX_TRACKED_IPS = 10_000
const vowelsPattern = /[aeiouyàáâäèéêëìíîïòóôöùúûü]/gu
const vowelPattern = /[aeiouyàáâäèéêëìíîïòóôöùúûü]/u
const letterPattern = /\p{L}/gu
const tokenPattern = /\p{L}{2,}/gu
const longConsonantRunPattern = /[bcdfghjklmnpqrstvwxz]{8,}/u
const keyboardPattern = /(qwerty|asdfgh|zxcvb|poiuy|lkjhg|mnbvc)/u

export const isMeaningfulSubmission = (value: string) => {
  const normalized = value.normalize('NFKC').trim().toLocaleLowerCase('it')
  const letters = normalized.match(letterPattern) || []

  if (letters.length < 3) return false

  const letterString = letters.join('')
  const tokens = normalized.match(tokenPattern) || []

  if (!tokens.length || keyboardPattern.test(letterString)) return false
  if (/(.)\1{5,}/u.test(letterString)) return false

  if (letterString.length >= 8) {
    const vowelCount = (letterString.match(vowelsPattern) || []).length
    const uniqueRatio = new Set(letterString).size / letterString.length

    if (vowelCount / letterString.length < 0.12) return false
    if (longConsonantRunPattern.test(letterString)) return false
    if (uniqueRatio < 0.25) return false
  }

  if (tokens.length >= 3 && new Set(tokens).size === 1) return false

  return tokens.some((token) => vowelPattern.test(token))
}

export const createSubmissionRateLimiter = (
  options: RateLimitOptions = DEFAULT_RATE_LIMIT_OPTIONS,
): SubmissionRateLimiter => {
  const attemptsByKey = new Map<string, number[]>()

  return {
    consume(key, now = Date.now()) {
      const oldestRelevantTimestamp = now - options.longWindowMs
      const attempts = (attemptsByKey.get(key) || []).filter(
        (timestamp) => timestamp > oldestRelevantTimestamp,
      )
      const shortAttempts = attempts.filter((timestamp) => timestamp > now - options.shortWindowMs)
      const shortBlocked = shortAttempts.length >= options.shortLimit
      const longBlocked = attempts.length >= options.longLimit

      if (shortBlocked || longBlocked) {
        const retryTimestamps = [
          ...(shortBlocked ? [shortAttempts[0] + options.shortWindowMs] : []),
          ...(longBlocked ? [attempts[0] + options.longWindowMs] : []),
        ]

        attemptsByKey.set(key, attempts)

        return {
          allowed: false,
          retryAfterSeconds: Math.max(1, Math.ceil((Math.max(...retryTimestamps) - now) / 1000)),
        }
      }

      attempts.push(now)
      attemptsByKey.delete(key)
      attemptsByKey.set(key, attempts)

      if (attemptsByKey.size > MAX_TRACKED_IPS) {
        const oldestKey = attemptsByKey.keys().next().value
        if (oldestKey) attemptsByKey.delete(oldestKey)
      }

      return { allowed: true, retryAfterSeconds: 0 }
    },
  }
}

const globalRateLimiter = globalThis as typeof globalThis & {
  hero4GothamSubmissionRateLimiter?: SubmissionRateLimiter
}

export const submissionRateLimiter =
  globalRateLimiter.hero4GothamSubmissionRateLimiter || createSubmissionRateLimiter()

globalRateLimiter.hero4GothamSubmissionRateLimiter = submissionRateLimiter

export const getClientIp = (
  request: Request,
  trustedHeader = process.env.TRUSTED_CLIENT_IP_HEADER || 'x-forwarded-for',
) => {
  const headerValue = request.headers.get(trustedHeader)
  const candidate = headerValue?.split(',')[0]?.trim()

  if (!candidate || candidate.length > 64 || /[\r\n]/u.test(candidate)) return null

  const normalizedIp = candidate.replace(/^::ffff:/u, '')

  return isIP(normalizedIp) ? normalizedIp : null
}

export const checkSubmissionRateLimit = (request: Request) => {
  const clientIp = getClientIp(request)

  if (!clientIp) return { allowed: true, retryAfterSeconds: 0 }

  return submissionRateLimiter.consume(clientIp)
}
