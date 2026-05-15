import { getEventFilterParamsFromSearchParams } from '@/blocks/EventSuite/filters'
import { getEventListPage } from '@/blocks/EventSuite/EventList/queries'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = Number(searchParams.get('page') || '1')
  const maxEvents = Number(searchParams.get('maxEvents') || '30')
  const filters = getEventFilterParamsFromSearchParams(searchParams)

  const result = await getEventListPage({
    filters,
    maxEvents: Number.isFinite(maxEvents) ? maxEvents : 30,
    page: Number.isFinite(page) ? page : 1,
  })

  return Response.json(result)
}
