import { SubtitleBlock } from '@/blocks/Subtitle/Component'
import { TitleBlock } from '@/blocks/Title/Component'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

describe('mobile page hero text width', () => {
  it('can remove duplicated containers from title and subtitle inside a text backdrop', () => {
    const html = renderToStaticMarkup(
      React.createElement(
        React.Fragment,
        null,
        React.createElement(TitleBlock, {
          disableInnerContainer: true,
          title: 'Eventi',
        }),
        React.createElement(SubtitleBlock, {
          disableInnerContainer: true,
          text: 'Dove il caos prende vita.',
        }),
      ),
    )
    const document = new DOMParser().parseFromString(html, 'text/html')

    expect(document.querySelector('h2')?.closest('section')?.classList.contains('container')).toBe(
      false,
    )
    expect(document.querySelector('p')?.closest('section')?.classList.contains('container')).toBe(
      false,
    )
  })

  it('keeps the container for standalone title and subtitle blocks', () => {
    const html = renderToStaticMarkup(
      React.createElement(
        React.Fragment,
        null,
        React.createElement(TitleBlock, { title: 'Eventi' }),
        React.createElement(SubtitleBlock, { text: 'Dove il caos prende vita.' }),
      ),
    )
    const document = new DOMParser().parseFromString(html, 'text/html')

    expect(document.querySelector('h2')?.closest('section')?.classList.contains('container')).toBe(
      true,
    )
    expect(document.querySelector('p')?.closest('section')?.classList.contains('container')).toBe(
      true,
    )
  })
})
