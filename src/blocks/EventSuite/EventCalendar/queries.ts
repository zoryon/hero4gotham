import configPromise from '@payload-config'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'

const getMonthRange = (year: number, monthIndex: number) => ({
  end: new Date(year, monthIndex + 1, 1),
  start: new Date(year, monthIndex, 1),
})

export const getEventCalendarDays = unstable_cache(
  async (year: number, monthIndex: number): Promise<number[]> => {
    const { end, start } = getMonthRange(year, monthIndex)
    const payload = await getPayload({ config: configPromise })

    const result = await payload.find({
      collection: 'events',
      depth: 0,
      limit: 100,
      pagination: false,
      select: {
        startsAt: true,
      },
      sort: 'startsAt',
      where: {
        startsAt: {
          greater_than_equal: start.toISOString(),
          less_than: end.toISOString(),
        },
      },
    })

    return Array.from(new Set(result.docs.map((event) => new Date(event.startsAt).getDate()))).sort(
      (a, b) => a - b,
    )
  },
  ['event-calendar-days'],
  {
    revalidate: 300,
    tags: ['events'],
  },
)
