import { getEventGalleryPage, getEventGalleryPhotosPage } from '@/blocks/EventGallery/queries'
import { getEventFilterParamsFromSearchParams } from '@/blocks/EventSuite/filters'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = Number(searchParams.get('page') || '1')
  const photosPerPage = Number(searchParams.get('photosPerPage') || '9')
  const eventIdParam = searchParams.get('eventId')
  const filters = getEventFilterParamsFromSearchParams(searchParams)

  if (eventIdParam) {
    const numericEventId = Number(eventIdParam)
    const result = await getEventGalleryPhotosPage({
      eventId: Number.isFinite(numericEventId) ? numericEventId : eventIdParam,
      page: Number.isFinite(page) ? page : 1,
      photosPerPage: Number.isFinite(photosPerPage) ? photosPerPage : 9,
    })

    return Response.json(result)
  }

  const result = await getEventGalleryPage({
    filters,
    page: Number.isFinite(page) ? page : 1,
    photosPerPage: Number.isFinite(photosPerPage) ? photosPerPage : 9,
  })

  return Response.json(result)
}
