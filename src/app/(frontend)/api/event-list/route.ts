import { getUpcomingEventListPage } from '@/blocks/EventSuite/EventList/queries'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = Number(searchParams.get('page') || '1')
  const maxEvents = Number(searchParams.get('maxEvents') || '30')

  const result = await getUpcomingEventListPage({
    maxEvents: Number.isFinite(maxEvents) ? maxEvents : 30,
    page: Number.isFinite(page) ? page : 1,
  })

  return Response.json(result)
}
