import { getEventCalendarDays } from '@/blocks/EventSuite/EventCalendar/queries'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const year = Number(searchParams.get('year'))
  const month = Number(searchParams.get('month'))

  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
    return Response.json({ eventDays: [] }, { status: 400 })
  }

  const eventDays = await getEventCalendarDays(year, month - 1)

  return Response.json({ eventDays })
}
