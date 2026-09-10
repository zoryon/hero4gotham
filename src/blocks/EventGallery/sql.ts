import { sql } from '@payloadcms/db-postgres'
import {
  getDateRangeFromFilterValue,
  normalizeEventFilterParams,
} from '@/blocks/EventSuite/filters'
import type { EventFilterParams } from '@/blocks/EventSuite/filters'

export const buildAlbumPageQuery = (
  filters: EventFilterParams | undefined,
  limit: number,
  offset: number,
) => {
  const normalized = normalizeEventFilterParams(filters)
  const clauses = [sql`true`]
  const start = getDateRangeFromFilterValue(normalized.date)
  const end = getDateRangeFromFilterValue(normalized.dateTo) || start

  if (start && end) {
    clauses.push(
      sql`e.starts_at < ${end.end.toISOString()} AND COALESCE(e.ends_at, e.starts_at) >= ${start.start.toISOString()}`,
    )
  }
  if (normalized.activityId !== 'all') clauses.push(sql`e.activity_id = ${normalized.activityId}`)
  if (normalized.venue) clauses.push(sql`e.venue = ${normalized.venue}`)
  if (normalized.query) {
    // Treat search input literally, including SQL LIKE wildcards.
    const pattern = `%${normalized.query.replace(/[\\%_]/g, '\\$&')}%`
    clauses.push(
      sql`(e.title ILIKE ${pattern} OR e.description ILIKE ${pattern} OR e.long_description ILIKE ${pattern} OR e.venue ILIKE ${pattern})`,
    )
  }

  return sql`
    SELECT e.id, e.title, e.starts_at AS "startsAt", e.ends_at AS "endsAt", cover.image_id AS "imageId"
    FROM events e
    CROSS JOIN LATERAL (
      SELECT g.id, g.image_id FROM events_gallery g
      INNER JOIN media m ON m.id = g.image_id
      WHERE g._parent_id = e.id
      ORDER BY (g.is_cover IS TRUE) DESC, g._order, g.id
      LIMIT 1
    ) cover
    WHERE ${sql.join(clauses, sql` AND `)}
      AND EXISTS (
        SELECT 1 FROM events_gallery photo
        INNER JOIN media m ON m.id = photo.image_id
        WHERE photo._parent_id = e.id AND photo.id <> cover.id
          AND photo.is_banner IS NOT TRUE
      )
    ORDER BY e.starts_at DESC, e.id DESC
    LIMIT ${limit} OFFSET ${offset}
  `
}

export const buildPhotoPageQuery = (eventId: number | string, limit: number, offset: number) => sql`
  SELECT g.id, g.image_id AS "imageId"
  FROM events_gallery g
  INNER JOIN media m ON m.id = g.image_id
  WHERE g._parent_id = ${eventId}
  ORDER BY g._order, g.id
  LIMIT ${limit} OFFSET ${offset}
`
