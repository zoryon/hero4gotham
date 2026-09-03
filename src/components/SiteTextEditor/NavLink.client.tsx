'use client'

import { Link, useAuth, useConfig } from '@payloadcms/ui'
import { PanelsTopLeft } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { formatAdminURL } from 'payload/shared'

import type { User } from '@/payload-types'
import './index.scss'

export default function SiteTextNavLink() {
  const { user } = useAuth<User>()
  const { config } = useConfig()
  const pathname = usePathname()
  if (user?.role !== 'admin' && user?.role !== 'eventsManager') return null

  const href = formatAdminURL({ adminRoute: config.routes.admin, path: '/modifica-sito' })
  const active = pathname === href

  return (
    <div className="site-text-nav">
      <div className="site-text-nav__label">Sito</div>
      <Link
        className="nav__link site-text-nav__link"
        href={href}
        id="nav-site-texts"
        prefetch={false}
      >
        {active ? <div className="nav__link-indicator" /> : null}
        <PanelsTopLeft aria-hidden="true" size={17} />
        <span className="nav__link-label">Modifica il sito</span>
      </Link>
    </div>
  )
}
