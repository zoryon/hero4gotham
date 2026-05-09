import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

import { CMSLink } from '@/components/Link'

const fallbackLegalLinks = [
  {
    link: {
      label: 'Privacy Policy',
      type: 'custom' as const,
      url: '/privacy-policy',
    },
  },
  {
    link: {
      label: 'Le tue preferenze relative alla privacy',
      type: 'custom' as const,
      url: '/preferenze-privacy',
    },
  },
]

export async function Footer() {
  const footerData = await getCachedGlobal('footer', 1)()

  const navItems = footerData?.navItems || []
  const legalLinks = footerData?.legalLinks?.length ? footerData.legalLinks : fallbackLegalLinks
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer mt-auto">
      <div className="site-footer__inner">
        <div className="site-footer__main">
          <div className="site-footer__brand">
            {footerData?.eyebrow ? (
              <p className="site-footer__eyebrow">{footerData.eyebrow}</p>
            ) : null}
            <p className="site-footer__brand-name">
              {footerData?.brandName || 'Il Sorriso Storto'}
            </p>
            {footerData?.description ? (
              <p className="site-footer__description">{footerData.description}</p>
            ) : null}
          </div>

          <div className="site-footer__columns">
            {navItems.length ? (
              <nav aria-label="Social" className="site-footer__link-group">
                <p className="site-footer__group-title">Seguici</p>
                {navItems.map(({ link }, i) => {
                  return <CMSLink className="site-footer__link" key={i} {...link} />
                })}
              </nav>
            ) : null}

            <nav aria-label="Legal" className="site-footer__link-group">
              <p className="site-footer__group-title">Informazioni</p>
              {legalLinks.map(({ link }, i) => (
                <CMSLink className="site-footer__link" key={i} {...link} />
              ))}
            </nav>
          </div>
        </div>

        <div className="site-footer__bottom">
          <div className="site-footer__legal">
            <p className="site-footer__legal-note">
              &copy; {year}{' '}
              {footerData?.legalNote || 'Associazione culturale. Tutti i diritti riservati.'}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
