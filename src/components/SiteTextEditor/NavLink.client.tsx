'use client'

import { Link, useAuth, useConfig } from '@payloadcms/ui'
import { usePathname } from 'next/navigation'
import { formatAdminURL } from 'payload/shared'

import type { User } from '@/payload-types'
import './index.scss'

export default function SiteTextNavLink() {
  const { user } = useAuth<User>()
  const { config } = useConfig()
  const pathname = usePathname()
  if (user?.role !== 'admin' && user?.role !== 'eventsManager') return null

  const href = formatAdminURL({ adminRoute: config.routes.admin, path: '/testi-del-sito' })
  const active = pathname === href

  return (
    <div className="site-text-nav">
      <div className="site-text-nav__label">Pagine</div>
      <Link
        className="nav__link site-text-nav__link"
        href={href}
        id="nav-site-texts"
        prefetch={false}
      >
        {active ? <div className="nav__link-indicator" /> : null}
        <span className="nav__link-label">Modifica testi del sito</span>
      </Link>
    </div>
  )
}
