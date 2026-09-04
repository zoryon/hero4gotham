import { describe, expect, it } from 'vitest'

import { normalizePreviewText } from '@/siteText/preview'

describe('site text preview matching', () => {
  it('matches titles regardless of visual casing and invisible word-break characters', () => {
    expect(normalizePreviewText('ATTIVITÀ')).toBe(normalizePreviewText('Attività'))
    expect(normalizePreviewText('PROGETTA\u00ADZIONE')).toBe(normalizePreviewText('Progettazione'))
  })
})
