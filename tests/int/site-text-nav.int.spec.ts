import React from 'react'

import SiteTextNavLink from '@/components/SiteTextEditor/NavLink.client'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('@payloadcms/ui', () => ({
  Link: ({
    children,
    prefetch: _prefetch,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { prefetch?: boolean }) =>
    React.createElement('a', props, children),
  useAuth: () => ({ user: { id: 'manager-id', role: 'eventsManager' } }),
  useConfig: () => ({ config: { routes: { admin: '/control-room-h4g' } } }),
}))

vi.mock('next/navigation', () => ({
  usePathname: () => '/control-room-h4g/collections/media',
}))

afterEach(cleanup)

describe('site text navigation', () => {
  it('shows the editor as an explicit Pages action', () => {
    render(React.createElement(SiteTextNavLink))

    expect(screen.getByText('Pagine')).toBeDefined()
    expect(screen.getByRole('link', { name: 'Modifica testi del sito' }).getAttribute('href')).toBe(
      '/control-room-h4g/testi-del-sito',
    )
  })
})
