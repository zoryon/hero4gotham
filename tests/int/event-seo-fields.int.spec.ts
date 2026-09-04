import { Events } from '@/collections/Events'
import { describe, expect, it } from 'vitest'

describe('event SEO fields', () => {
  it('exposes optional title and description fields in an SEO group', () => {
    const meta = Events.fields.find(
      (field) => 'name' in field && field.name === 'meta' && field.type === 'group',
    )

    expect(meta).toMatchObject({ label: 'SEO', name: 'meta', type: 'group' })

    if (!meta || meta.type !== 'group') throw new Error('Expected the event SEO group')

    expect(meta.fields).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ label: 'Titolo SEO', name: 'title', required: false }),
        expect.objectContaining({ label: 'Descrizione SEO', name: 'description', required: false }),
      ]),
    )
  })
})
