// @vitest-environment node

import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

describe('event SEO migration script', () => {
  it('stops with a clear error instead of connecting to local Postgres without DATABASE_URL', () => {
    const result = spawnSync(
      process.execPath,
      [path.resolve('node_modules/tsx/dist/cli.mjs'), path.resolve('scripts/migrate-event-seo.ts')],
      {
        encoding: 'utf8',
        env: { ...process.env, DATABASE_URL: '', DOTENV_CONFIG_QUIET: 'true' },
      },
    )

    expect(result.status).toBe(1)
    expect(result.stderr).toContain('DATABASE_URL mancante')
  })
})
