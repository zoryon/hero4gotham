'use client'

import { Link, useAuth, useConfig } from '@payloadcms/ui'
import {
  ArrowRight,
  CalendarDays,
  Image,
  LayoutDashboard,
  Palette,
  Plus,
  Shield,
} from 'lucide-react'
import { formatAdminURL } from 'payload/shared'

import type { User } from '@/payload-types'
import './index.scss'

type DashboardCard = {
  accent?: boolean
  description: string
  href: string
  icon: React.ReactNode
  label: string
}

export function AdminDashboard() {
  const { user } = useAuth<User>()
  const { config } = useConfig()
  const adminRoute = config.routes.admin
  const isAdmin = user?.role === 'admin'
  const path = (value: `/${string}`) => formatAdminURL({ adminRoute, path: value })

  const mainCards: DashboardCard[] = [
    {
      accent: true,
      description:
        'Apri il sito, seleziona una frase e pubblica le modifiche senza toccare la grafica.',
      href: path('/modifica-sito'),
      icon: <LayoutDashboard aria-hidden="true" />,
      label: 'Modifica il sito',
    },
    {
      description: 'Crea un evento oppure aggiorna date, luogo, programma e fotografie.',
      href: path('/collections/events'),
      icon: <CalendarDays aria-hidden="true" />,
      label: 'Gestisci gli eventi',
    },
    {
      description: 'Carica immagini e documenti e organizzali nelle cartelle della libreria.',
      href: path('/collections/media'),
      icon: <Image aria-hidden="true" />,
      label: 'Apri la libreria media',
    },
  ]

  return (
    <main className="h4g-dashboard">
      <header className="h4g-dashboard__hero">
        <div>
          <span className="h4g-dashboard__eyebrow">Control Room</span>
          <h1>
            Bentornat{user?.name?.trim().toLowerCase().endsWith('a') ? 'a' : 'o'},{' '}
            {user?.name || 'nel CMS'}
          </h1>
          <p>Da qui puoi aggiornare il sito e tenere sotto controllo i contenuti pubblicati.</p>
        </div>
        <Link className="h4g-dashboard__new-event" href={path('/collections/events/create')}>
          <Plus aria-hidden="true" size={17} />
          Nuovo evento
        </Link>
      </header>

      <section aria-label="Azioni principali" className="h4g-dashboard__grid">
        {mainCards.map((card) => (
          <Link
            className={`h4g-dashboard__card${card.accent ? ' h4g-dashboard__card--accent' : ''}`}
            href={card.href}
            key={card.label}
          >
            <span className="h4g-dashboard__icon">{card.icon}</span>
            <span className="h4g-dashboard__card-copy">
              <strong>{card.label}</strong>
              <small>{card.description}</small>
            </span>
            <ArrowRight aria-hidden="true" className="h4g-dashboard__arrow" size={19} />
          </Link>
        ))}
      </section>

      {isAdmin ? (
        <section className="h4g-dashboard__advanced">
          <div className="h4g-dashboard__section-title">
            <span>Area amministratore</span>
            <p>Struttura, identità visiva e configurazioni riservate.</p>
          </div>
          <div className="h4g-dashboard__compact-grid">
            <Link href={path('/collections/pages')}>
              <Palette aria-hidden="true" />
              <span>
                <strong>Struttura e design</strong>
                <small>Pagine, blocchi e layout</small>
              </span>
              <ArrowRight aria-hidden="true" size={18} />
            </Link>
            <Link href={path('/collections/users')}>
              <Shield aria-hidden="true" />
              <span>
                <strong>Amministrazione</strong>
                <small>Utenti e accessi</small>
              </span>
              <ArrowRight aria-hidden="true" size={18} />
            </Link>
          </div>
        </section>
      ) : null}
    </main>
  )
}
