import Link from 'next/link'
import React from 'react'

import { Button } from '@/components/ui/button'
import { getSiteCopy } from '@/utilities/siteCopy'

export default async function NotFound() {
  const copy = await getSiteCopy()
  return (
    <div className="container py-28">
      <div className="prose max-w-none">
        <h1 style={{ marginBottom: 0 }}>404</h1>
        <p className="mb-4">{copy.notFound.message}</p>
      </div>
      <Button asChild variant="default">
        <Link href="/">{copy.notFound.goHome}</Link>
      </Button>
    </div>
  )
}
