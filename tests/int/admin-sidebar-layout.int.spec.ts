import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

const adminStyles = readFileSync(resolve('src/app/(payload)/custom.scss'), 'utf8')

describe('Payload admin sidebar layout', () => {
  it('allows the main wrapper to fill the desktop track when the sidebar closes', () => {
    const wrapperRule = adminStyles.match(/\.template-default__wrap\s*\{([^}]*)\}/)?.[1]

    expect(wrapperRule).toBeDefined()
    expect(wrapperRule).not.toMatch(/max-width\s*:/)
  })
})
