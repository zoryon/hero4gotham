import { getActivityGalleryHref } from '@/blocks/EventSuite/filters'
import { expect, it } from 'vitest'

it('builds a gallery link only for a real numeric activity id', () => {
  expect(getActivityGalleryHref(7)).toBe('/galleria?activityId=7')
  expect(getActivityGalleryHref('manual-row-id')).toBeNull()
})
