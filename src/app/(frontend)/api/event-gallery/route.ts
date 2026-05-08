import { getEventGalleryPage } from '@/blocks/EventGallery/queries'
import { getEventFilterParamsFromSearchParams } from '@/blocks/EventSuite/filters'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = Number(searchParams.get('page') || '1')
  const maxPhotos = Number(searchParams.get('maxPhotos') || '60')
  const photosPerPage = Number(searchParams.get('photosPerPage') || '9')
  const filters = getEventFilterParamsFromSearchParams(searchParams)

  const result = await getEventGalleryPage({
    filters,
    maxPhotos: Number.isFinite(maxPhotos) ? maxPhotos : 60,
    page: Number.isFinite(page) ? page : 1,
    photosPerPage: Number.isFinite(photosPerPage) ? photosPerPage : 9,
  })

  return Response.json(result)
}
