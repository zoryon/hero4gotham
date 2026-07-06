import type { Metadata } from 'next'

import React from 'react'

import { PrivacyPolicyContent } from '@/PrivacyPolicy/PrivacyPolicyContent.client'
import { SiteBackgroundFrame } from '@/SiteBackground/Component'
import { getCachedGlobal } from '@/utilities/getGlobals'

const formatDate = (value: null | string | undefined) => {
  if (!value) return ''

  return new Intl.DateTimeFormat('it-IT', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value))
}

export default async function PrivacyPolicyPage() {
  const [privacyPolicy, siteBackground] = await Promise.all([
    getCachedGlobal('privacyPolicy', 1)(),
    getCachedGlobal('siteBackground', 1)().catch(() => null),
  ])

  return (
    <article>
      <SiteBackgroundFrame fallbackSettings={siteBackground} isFirstPageBlock settings={privacyPolicy}>
        <section className="privacy-policy-page container mt-3 lg:mt-8 2xl:mt-10">
          <div className="privacy-policy-shell mx-auto max-w-6xl">
            <header className="privacy-policy-hero">
              <p className="privacy-policy-eyebrow mt-4 md:mt-8">Informativa privacy</p>
              <h1 className="privacy-policy-title mt-3">{privacyPolicy.title || 'Privacy Policy'}</h1>
              {privacyPolicy.intro ? (
                <p className="privacy-policy-intro mt-4">{privacyPolicy.intro}</p>
              ) : null}
              {privacyPolicy.updatedAt ? (
                <p className="privacy-policy-updated mt-1">
                  {privacyPolicy.lastUpdatedLabel || 'Ultimo aggiornamento'}:{' '}
                  {formatDate(privacyPolicy.updatedAt)}
                </p>
              ) : null}
            </header>

            {privacyPolicy.content ? <PrivacyPolicyContent content={privacyPolicy.content} /> : null}
          </div>
        </section>
      </SiteBackgroundFrame>
    </article>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const privacyPolicy = await getCachedGlobal('privacyPolicy', 1)()

  return {
    description:
      privacyPolicy.metaDescription ||
      'Informativa privacy sul trattamento dei dati personali del sito.',
    title: privacyPolicy.metaTitle || privacyPolicy.title || 'Privacy Policy',
  }
}
