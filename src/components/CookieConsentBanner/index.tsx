'use client'

import React, { useEffect, useState } from 'react'

type CookieConsent = {
  analytics: boolean
  marketing: boolean
  necessary: true
  updatedAt: string
}

declare global {
  interface Window {
    hero4gothamCookieConsent?: CookieConsent
  }
}

const cookieName = 'hero4gotham_cookie_consent_v1'
const openPreferencesEvent = 'hero4gotham:open-cookie-preferences'
const consentEvent = 'hero4gotham:cookie-consent'

const defaultConsent: CookieConsent = {
  analytics: false,
  marketing: false,
  necessary: true,
  updatedAt: '',
}

function readStoredConsent(): CookieConsent | null {
  try {
    const storedConsent = window.localStorage.getItem(cookieName)

    if (!storedConsent) {
      return null
    }

    const parsedConsent = JSON.parse(storedConsent) as Partial<CookieConsent>

    return {
      analytics: Boolean(parsedConsent.analytics),
      marketing: Boolean(parsedConsent.marketing),
      necessary: true,
      updatedAt: parsedConsent.updatedAt || '',
    }
  } catch {
    return null
  }
}

function applyConsent(consent: CookieConsent) {
  window.hero4gothamCookieConsent = consent
  document.documentElement.dataset.cookieAnalytics = String(consent.analytics)
  document.documentElement.dataset.cookieMarketing = String(consent.marketing)
  window.dispatchEvent(new CustomEvent(consentEvent, { detail: consent }))
}

function persistConsent(consent: CookieConsent) {
  const serializedConsent = JSON.stringify(consent)

  window.localStorage.setItem(cookieName, serializedConsent)
  document.cookie = `${cookieName}=${encodeURIComponent(
    serializedConsent,
  )}; Path=/; Max-Age=31536000; SameSite=Lax`
  applyConsent(consent)
}

export function CookieConsentBanner() {
  const [isOpen, setIsOpen] = useState(false)
  const [analytics, setAnalytics] = useState(false)
  const [marketing, setMarketing] = useState(false)

  useEffect(() => {
    const storedConsent = readStoredConsent()

    if (storedConsent) {
      setAnalytics(storedConsent.analytics)
      setMarketing(storedConsent.marketing)
      applyConsent(storedConsent)
    } else {
      applyConsent(defaultConsent)
      setIsOpen(true)
    }

    const openPreferences = () => {
      const latestConsent = readStoredConsent()

      setAnalytics(Boolean(latestConsent?.analytics))
      setMarketing(Boolean(latestConsent?.marketing))
      setIsOpen(true)
    }

    window.addEventListener(openPreferencesEvent, openPreferences)

    return () => {
      window.removeEventListener(openPreferencesEvent, openPreferences)
    }
  }, [])

  const saveConsent = (nextConsent: Omit<CookieConsent, 'necessary' | 'updatedAt'>) => {
    persistConsent({
      ...nextConsent,
      necessary: true,
      updatedAt: new Date().toISOString(),
    })
    setIsOpen(false)
  }

  if (!isOpen) {
    return null
  }

  return (
    <section
      aria-label="Preferenze cookie"
      aria-modal="false"
      className="cookie-consent"
      role="dialog"
    >
      <div className="cookie-consent__panel">
        <div className="cookie-consent__copy">
          <p className="cookie-consent__eyebrow">Preferenze cookie</p>
          <h2 className="cookie-consent__title">Gestisci i cookie</h2>
          <p className="cookie-consent__text">
            Usiamo cookie tecnici necessari al funzionamento del sito. Con il tuo consenso
            possiamo usare anche cookie analytics e marketing. Puoi accettare tutti i cookie,
            rifiutare quelli non necessari o scegliere le categorie da abilitare. Puoi modificare
            le preferenze in qualsiasi momento dal link nel footer.
          </p>
          <a className="cookie-consent__policy-link" href="/privacy-policy#cookie-policy">
            Leggi Privacy e Cookie Policy
          </a>
        </div>

        <div className="cookie-consent__choices" aria-label="Categorie cookie">
          <label className="cookie-consent__choice cookie-consent__choice--disabled">
            <span>
              <strong>Necessari</strong>
              <small>Sempre attivi</small>
            </span>
            <input checked disabled type="checkbox" />
          </label>
          <label className="cookie-consent__choice">
            <span>
              <strong>Analytics</strong>
              <small>Statistiche anonime e miglioramento del sito</small>
            </span>
            <input
              checked={analytics}
              onChange={(event) => setAnalytics(event.target.checked)}
              type="checkbox"
            />
          </label>
          <label className="cookie-consent__choice">
            <span>
              <strong>Marketing</strong>
              <small>Contenuti e strumenti promozionali esterni</small>
            </span>
            <input
              checked={marketing}
              onChange={(event) => setMarketing(event.target.checked)}
              type="checkbox"
            />
          </label>
        </div>

        <div className="cookie-consent__actions">
          <button
            className="cookie-consent__button cookie-consent__button--ghost"
            onClick={() => saveConsent({ analytics: false, marketing: false })}
            type="button"
          >
            Rifiuta non necessari
          </button>
          <button
            className="cookie-consent__button"
            onClick={() => saveConsent({ analytics, marketing })}
            type="button"
          >
            Salva preferenze
          </button>
          <button
            className="cookie-consent__button cookie-consent__button--accent"
            onClick={() => saveConsent({ analytics: true, marketing: true })}
            type="button"
          >
            Accetta tutto
          </button>
        </div>
      </div>
    </section>
  )
}
