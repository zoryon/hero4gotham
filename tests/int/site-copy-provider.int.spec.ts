import { render, screen } from '@testing-library/react'
import React from 'react'
import { describe, expect, it } from 'vitest'

import { mergeSiteCopy } from '@/SiteCopy/defaults'
import { SiteCopyProvider, useSiteCopy } from '@/providers/SiteCopy'

const Probe = () => {
  const copy = useSiteCopy()
  return React.createElement('span', null, copy.cookie.title)
}

describe('site copy provider', () => {
  it('makes server-loaded copy available to client components', () => {
    const copy = mergeSiteCopy({ cookie: { title: 'Cookie personalizzati' } })

    render(
      React.createElement(SiteCopyProvider, {
        children: React.createElement(Probe),
        copy,
      }),
    )

    expect(screen.getByText('Cookie personalizzati')).toBeDefined()
  })
})
