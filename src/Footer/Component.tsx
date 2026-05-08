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
        <div className="site-footer__bottom">
          <div className="site-footer__left">
            <p className="site-footer__legal-note">
              &copy; {year}{' '}
              {footerData?.legalNote || 'Associazione culturale. Tutti i diritti riservati.'}
            </p>
            <nav aria-label="Legal" className="site-footer__legal-links">
              {legalLinks.map(({ link }, i) => (
                <CMSLink className="site-footer__micro-link" key={i} {...link} />
              ))}
            </nav>
          </div>

          {navItems.length ? (
            <nav aria-label="Social" className="site-footer__right">
              {navItems.map(({ link }, i) => {
                return <CMSLink className="site-footer__micro-link" key={i} {...link} />
              })}
            </nav>
          ) : null}
        </div>
      </div>
    </footer>
  )
}
