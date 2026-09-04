import { describe, expect, it } from 'vitest'

import {
  getEventBannerImage,
  getEventHeroClassName,
} from '@/app/(frontend)/eventi/[slug]/eventBanner'
import type { Event, Media } from '@/payload-types'

describe('event detail banner', () => {
  it('uses only an explicitly selected banner and never falls back to another gallery image', () => {
    const regularImage = { id: 1 } as Media
    const bannerImage = { id: 2 } as Media
    const galleryWithoutBanner = [{ image: regularImage, isBanner: false }] as Event['gallery']
    const galleryWithBanner = [
      { image: regularImage, isBanner: false },
      { image: bannerImage, isBanner: true },
    ] as Event['gallery']

    expect(getEventBannerImage(galleryWithoutBanner)).toBeNull()
    expect(getEventBannerImage(galleryWithBanner)).toBe(bannerImage)
    expect(getEventHeroClassName(null)).toContain('event-detail-hero--without-banner')
    expect(getEventHeroClassName(bannerImage)).not.toContain('event-detail-hero--without-banner')
  })
})
