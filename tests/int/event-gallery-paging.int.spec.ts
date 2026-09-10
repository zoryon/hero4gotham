// @vitest-environment node
import { createRequire } from 'node:module'
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { buildAlbumPageQuery } from '@/blocks/EventGallery/sql'

const { execute, find } = vi.hoisted(() => ({ execute: vi.fn(), find: vi.fn() }))
vi.mock('payload', () => ({ getPayload: async () => ({ db: { drizzle: { execute } }, find }) }))
vi.mock('@payload-config', () => ({ default: {} }))
import { getEventGalleryPage, getEventGalleryPhotosPage } from '@/blocks/EventGallery/queries'

const require = createRequire(import.meta.url)
const { Client } = createRequire(require.resolve('@payloadcms/db-postgres'))('pg')
const { PgDialect } = createRequire(require.resolve('@payloadcms/db-postgres'))(
  'drizzle-orm/pg-core',
)
const client = new Client({ connectionString: process.env.DATABASE_URL })

describe('database gallery pagination', () => {
  beforeAll(async () => {
    await client.connect()
    // Session-local tables shadow the real tables; no application data is changed.
    await client.query(`
      CREATE TEMP TABLE events (id integer PRIMARY KEY, title text, starts_at timestamptz, ends_at timestamptz, activity_id integer, venue text, description text, long_description text);
      CREATE TEMP TABLE media (id integer PRIMARY KEY);
      CREATE TEMP TABLE events_gallery (id text PRIMARY KEY, _parent_id integer, _order integer, image_id integer, is_cover boolean, is_banner boolean);
    `)
    execute.mockImplementation(async (query: ReturnType<typeof buildAlbumPageQuery>) => {
      const compiled = new PgDialect().sqlToQuery(query)
      return client.query(compiled.sql, compiled.params)
    })
  })
  afterAll(async () => {
    await client.end()
  })
  beforeEach(async () => {
    await client.query('TRUNCATE pg_temp.events, pg_temp.media, pg_temp.events_gallery')
    execute.mockClear()
    find.mockReset()
    find.mockImplementation(async ({ collection, where }) => ({
      docs:
        collection === 'media'
          ? where.id.in.map((id: number) => ({
              id,
              url: `/photo-${id}.jpg`,
              width: 800,
              height: 600,
            }))
          : [],
    }))
  })

  const addEvent = async (
    id: number,
    flags: { isCover?: boolean; isBanner?: boolean }[],
    title = 'Event',
  ) => {
    await client.query(
      "INSERT INTO events (id, title, starts_at, activity_id, venue) VALUES ($1, $2, '2026-05-08', 2, 'Roma')",
      [id, title],
    )
    for (const [index, flag] of flags.entries()) {
      const imageId = id * 100 + index
      await client.query('INSERT INTO media VALUES ($1)', [imageId])
      await client.query('INSERT INTO events_gallery VALUES ($1,$2,$3,$4,$5,$6)', [
        `${id}-${index}`,
        id,
        index,
        imageId,
        flag.isCover ?? false,
        flag.isBanner ?? false,
      ])
    }
  }

  it('paginates eligible albums before loading their media, with stable ordering', async () => {
    await addEvent(1, [{}, { isCover: true }])
    await addEvent(2, [{}, { isCover: true }])
    await addEvent(3, [{ isCover: true }])
    await addEvent(4, [{ isBanner: true }, { isCover: true }])
    await addEvent(5, [{ isBanner: true }, { isCover: true }, {}])
    const first = await getEventGalleryPage({ page: 1, photosPerPage: 2 })
    expect(first.albums.map((album) => album.eventId)).toEqual([5, 2])
    expect(first.nextPage).toBe(2)
    expect(first.albums[1].cover.id).toBe(201)
    const second = await getEventGalleryPage({ page: 2, photosPerPage: 2 })
    expect(second.albums.map((album) => album.eventId)).toEqual([1])
    expect(second.hasNextPage).toBe(false)
    expect(second.nextPage).toBeNull()
    expect(find.mock.calls.every(([args]) => args.collection === 'media' && args.limit <= 2)).toBe(
      true,
    )
  })

  it.each([
    {
      name: 'second photo is cover, no banner selected',
      flags: [{}, { isCover: true }],
      visible: true,
    },
    { name: 'first photo is the default cover', flags: [{}, {}], visible: true },
    { name: 'only a cover exists', flags: [{ isCover: true }], visible: false },
    {
      name: 'only explicit banner and cover exist',
      flags: [{ isBanner: true }, { isCover: true }],
      visible: false,
    },
    {
      name: 'an extra photo exists beyond banner and cover',
      flags: [{ isBanner: true }, { isCover: true }, {}],
      visible: true,
    },
  ])('$name', async ({ flags, visible }) => {
    await addEvent(33, flags)
    const result = await getEventGalleryPage({ page: 1, photosPerPage: 9 })
    expect(result.albums.map((album) => album.eventId)).toEqual(visible ? [33] : [])
  })

  it('applies search, activity, venue and date filters before paging', async () => {
    await addEvent(1, [{}, {}], 'COMIX PARK')
    await addEvent(2, [{}, {}], 'Other event')
    const result = await getEventGalleryPage({
      page: 1,
      photosPerPage: 1,
      filters: { query: 'comix', activityId: 2, venue: 'Roma', date: '2026-05-08' },
    })
    expect(result.albums.map((album) => album.eventId)).toEqual([1])
    expect(result.hasNextPage).toBe(false)
  })

  it('paginates photo rows without loading the complete event gallery', async () => {
    await addEvent(1, [{}, {}, {}, {}, {}])
    const first = await getEventGalleryPhotosPage({ eventId: 1, page: 1, photosPerPage: 2 })
    const second = await getEventGalleryPhotosPage({ eventId: 1, page: 2, photosPerPage: 2 })
    const last = await getEventGalleryPhotosPage({ eventId: 1, page: 3, photosPerPage: 2 })
    expect(first.photos.map((photo) => photo.image.id)).toEqual([100, 101])
    expect(second.photos.map((photo) => photo.image.id)).toEqual([102, 103])
    expect(last.photos.map((photo) => photo.image.id)).toEqual([104])
    expect(first.nextPage).toBe(2)
    expect(last.hasNextPage).toBe(false)
    expect(find.mock.calls.every(([args]) => args.collection === 'media' && args.limit <= 2)).toBe(
      true,
    )
  })
})
