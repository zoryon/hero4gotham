import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'

import { ActivitiesDetailGridBlock } from '@/blocks/ActivitiesDetailGrid/Component'
import { ActivitiesDetailGrid } from '@/blocks/ActivitiesDetailGrid/config'
import { Activities } from '@/collections/Activities'
import type { ActivitiesDetailGridBlock as ActivitiesDetailGridBlockProps } from '@/payload-types'

vi.mock('next/cache', () => ({
  unstable_cache: (callback: unknown) => callback,
}))

type FieldShape = {
  fields?: FieldShape[]
  name?: string
  tabs?: { fields?: FieldShape[] }[]
}

const collectFieldNames = (fields: FieldShape[]): string[] =>
  fields.flatMap((field) => [
    ...(field.name ? [field.name] : []),
    ...(field.fields ? collectFieldNames(field.fields) : []),
    ...(field.tabs?.flatMap((tab) => collectFieldNames(tab.fields || [])) || []),
  ])

describe('activity card content model', () => {
  it('does not expose details or CTA fields in either activity editor', () => {
    const collectionFieldNames = collectFieldNames(Activities.fields as FieldShape[])
    const blockFieldNames = collectFieldNames(ActivitiesDetailGrid.fields as FieldShape[])

    for (const removedField of ['cta', 'ctaImage', 'details', 'ctaStyle', 'detailStyle']) {
      expect(collectionFieldNames).not.toContain(removedField)
      expect(blockFieldNames).not.toContain(removedField)
    }
  })

  it('does not render legacy details or CTA content from saved manual cards', async () => {
    const element = await ActivitiesDetailGridBlock({
      activities: [
        {
          cta: 'CTA DA RIMUOVERE',
          details: [{ text: 'DETTAGLIO DA RIMUOVERE' }],
          description: 'Descrizione mantenuta',
          title: 'AttivitÃ  di prova',
        },
      ],
      blockType: 'activitiesDetailGrid',
      source: 'manual',
    } as unknown as ActivitiesDetailGridBlockProps)
    const html = renderToStaticMarkup(element)

    expect(html).toContain('Descrizione mantenuta')
    expect(html).not.toContain('CTA DA RIMUOVERE')
    expect(html).not.toContain('DETTAGLIO DA RIMUOVERE')
  })

  it('renders a long description once, in full, inside the scrollable text region', async () => {
    const description =
      'Dal Romics al Milano Games Week, dal Comicon al BeComics Torino: un racconto completo delle fiere, degli incontri e degli eventi.'
    const element = await ActivitiesDetailGridBlock({
      activities: [
        {
          description,
          title: 'Fiere ed eventi',
        },
      ],
      blockType: 'activitiesDetailGrid',
      source: 'manual',
    } as unknown as ActivitiesDetailGridBlockProps)
    const html = renderToStaticMarkup(element)

    expect(html).toContain('activity-detail-card__description-scroll')
    expect(html.split(description)).toHaveLength(2)
    expect(html).not.toContain('activity-detail-card__description-short')
    expect(html).not.toContain('...')
  })
})
