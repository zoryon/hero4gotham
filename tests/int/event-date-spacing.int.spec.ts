import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { EventListClient } from '@/blocks/EventSuite/EventList/Component.client'
import { EventFiltersProvider } from '@/providers/EventFilters'

describe('event date spacing', () => {
  it('leaves a clear gap between the day range and the month', () => {
    const html = renderToStaticMarkup(
      React.createElement(
        EventFiltersProvider,
        null,
        React.createElement(EventListClient, {
          events: [
            {
              endsAt: '2027-12-13T00:00:00.000Z',
              id: 1,
              startsAt: '2027-12-12T00:00:00.000Z',
              title: 'Evento di prova',
            },
          ],
        }),
      ),
    )
    const document = new DOMParser().parseFromString(html, 'text/html')
    const month = Array.from(document.querySelectorAll('span')).find(
      (element) => element.textContent === 'DIC',
    )

    expect(month).toBeDefined()
    expect(month?.classList.contains('mt-3')).toBe(true)
  })
})
