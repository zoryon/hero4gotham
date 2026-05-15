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

const fallbackDescription =
  'Un luogo storto al punto giusto per arte, incontri, giochi e idee fuori asse.'

const fallbackSocialLinks = [
  {
    link: {
      label: 'Instagram',
      newTab: true,
      type: 'custom' as const,
      url: 'https://instagram.com',
    },
  },
  {
    link: {
      label: 'LinkedIn',
      newTab: true,
      type: 'custom' as const,
      url: 'https://linkedin.com',
    },
  },
  {
    link: {
      label: 'X(Twitter)',
      newTab: true,
      type: 'custom' as const,
      url: 'https://x.com',
    },
  },
]

export async function Footer() {
  const footerData = await getCachedGlobal('footer', 1)()

  const description = footerData?.description || fallbackDescription
  const navItems = footerData?.navItems?.length ? footerData.navItems : fallbackSocialLinks
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
            <p className="site-footer__description">{description}</p>
          </div>

          <div className="site-footer__columns">
            <nav aria-label="Social" className="site-footer__link-group">
              <p className="site-footer__group-title">Seguici</p>
              {navItems.map(({ link }, i) => {
                return <CMSLink className="site-footer__link" key={i} {...link} />
              })}
            </nav>

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
