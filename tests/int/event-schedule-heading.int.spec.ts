import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { EventScheduleHeading } from '@/app/(frontend)/eventi/[slug]/EventScheduleHeading'

describe('event schedule heading', () => {
  it('shows Programma once as the main heading without an eyebrow', () => {
    const html = renderToStaticMarkup(
      React.createElement(EventScheduleHeading, { title: 'Programma' }),
    )
    const document = new DOMParser().parseFromString(html, 'text/html')

    expect(document.querySelector('p')).toBeNull()
    expect(document.querySelector('h2')?.textContent).toBe('PROGRAMMA')
    expect(document.body.textContent?.match(/PROGRAMMA/g)).toHaveLength(1)
  })
})
