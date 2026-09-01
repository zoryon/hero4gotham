import { TornCardsBlock } from '@/blocks/TornCards/Component'
import type { TornCardsBlock as TornCardsBlockProps } from '@/payload-types'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

describe('TornCards responsive gutter', () => {
  it.each(['wide', 'extraWide'] as const)(
    'uses a compact mobile gutter for bordered %s cards while preserving larger breakpoints',
    (containerWidth) => {
      const html = renderToStaticMarkup(
        React.createElement(TornCardsBlock, {
          blockType: 'tornCards',
          cardGap: 'sm',
          containerWidth,
          items: [
            {
              id: 'identity',
              title: 'Identità',
            },
          ],
          layout: {
            scribbleBorder: true,
          },
        } as TornCardsBlockProps),
      )
      const document = new DOMParser().parseFromString(html, 'text/html')
      const block = document.querySelector('.torn-cards-block')

      expect(block?.classList.contains('mx-2')).toBe(true)
      expect(
        block?.classList.contains(
          'md:mx-[calc(var(--vintage-border-width,15px)*0.75)]',
        ),
      ).toBe(true)
    },
  )
})
