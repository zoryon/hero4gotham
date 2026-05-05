import React from 'react'

import type { EventFiltersBlock as EventFiltersBlockProps, Media } from '@/payload-types'

import { EventFiltersClient, type EventFilterActivity } from './Component.client'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import configPromise from '@payload-config'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'

type ActivityResult = {
  id: number
  image?: Media | number | null
  order?: number | null
  shortName: string
  title: string
}

const getActivitiesForFilters = unstable_cache(
  async (): Promise<EventFilterActivity[]> => {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'activities',
      depth: 1,
      limit: 8,
      pagination: false,
      select: {
        image: true,
        order: true,
        shortName: true,
        title: true,
      },
      sort: 'order',
    })

    return (result.docs as ActivityResult[]).map((activity) => {
      const image = activity.image && typeof activity.image === 'object' ? activity.image : null

      return {
        iconAlt: image?.alt || activity.shortName || activity.title,
        iconUrl: image ? getMediaUrl(image.url, image.updatedAt) || null : null,
        id: activity.id,
        label: activity.shortName || activity.title,
      }
    })
  },
  ['event-filters-activities'],
  {
    revalidate: 300,
    tags: ['activities'],
  },
)

const getVenuesForFilters = unstable_cache(
  async (): Promise<string[]> => {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'events',
      limit: 200,
      pagination: false,
      select: {
        venue: true,
      },
      sort: 'venue',
    })

    return Array.from(
      new Set(
        result.docs
          .map((event) => event.venue?.trim())
          .filter((venue): venue is string => Boolean(venue)),
      ),
    )
  },
  ['event-filters-venues'],
  {
    revalidate: 300,
    tags: ['events'],
  },
)

export const EventFiltersBlock = async (props: EventFiltersBlockProps) => {
  const [activities, venues] = await Promise.all([getActivitiesForFilters(), getVenuesForFilters()])

  return <EventFiltersClient {...props} activities={activities} venues={venues} />
}
