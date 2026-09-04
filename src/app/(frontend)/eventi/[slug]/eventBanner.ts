import type { Event as EventDocument, Media as MediaDocument } from '@/payload-types'

export const getEventBannerImage = (gallery: EventDocument['gallery']): MediaDocument | null => {
  const bannerItem = gallery.find((item) => item.isBanner && typeof item.image === 'object')

  return bannerItem && typeof bannerItem.image === 'object' ? bannerItem.image : null
}

export const getEventHeroClassName = (bannerImage: MediaDocument | null) =>
  bannerImage ? 'event-detail-hero' : 'event-detail-hero event-detail-hero--without-banner'
