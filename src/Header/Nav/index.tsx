'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import { SearchIcon } from 'lucide-react'
import { useSiteCopy } from '@/providers/SiteCopy'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const copy = useSiteCopy()
  const navItems = data?.navItems || []

  return (
    <nav className="flex gap-3 items-center">
      {navItems.map(({ link }, i) => {
        return <CMSLink key={i} {...link} appearance="link" />
      })}
      <Link href="/search">
        <span className="sr-only">{copy.accessibility.search}</span>
        <SearchIcon className="w-5 text-primary" />
      </Link>
    </nav>
  )
}
