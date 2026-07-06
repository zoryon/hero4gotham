import { getEventFilterParamsFromSearchParams } from '@/blocks/EventSuite/filters'
import { getEventListPage } from '@/blocks/EventSuite/EventList/queries'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = Number(searchParams.get('page') || '1')
  const pageSize = Number(searchParams.get('pageSize') || '4')
  const filters = getEventFilterParamsFromSearchParams(searchParams)

  const result = await getEventListPage({
    filters,
    page: Number.isFinite(page) ? page : 1,
    pageSize: Number.isFinite(pageSize) ? pageSize : 4,
  })

  return Response.json(result)
}
