import { beforeEach, describe, expect, it, vi } from 'vitest'

const { find } = vi.hoisted(() => ({
  find: vi.fn(),
}))

vi.mock('payload', () => ({
  getPayload: vi.fn(async () => ({ find })),
}))

vi.mock('@payload-config', () => ({
  default: {},
}))

import { getEventListPage } from '@/blocks/EventSuite/EventList/queries'

describe('upcoming event list order', () => {
  beforeEach(() => {
    find.mockReset()
    find.mockResolvedValue({ docs: [], totalDocs: 0 })
  })

  it('keeps pinned events first and orders each group by the nearest start date', async () => {
    await getEventListPage({ page: 1 })

    expect(find).toHaveBeenCalledWith(
      expect.objectContaining({
        sort: ['-pinned', 'startsAt'],
      }),
    )
  })
})
