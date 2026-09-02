import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

import { CMSLink } from '@/components/Link'
import { CookiePreferencesLink } from './CookiePreferencesLink.client'
import { getSiteCopy } from '@/utilities/siteCopy'

const fallbackDescription =
  'Un luogo storto al punto giusto per arte, incontri, giochi e idee fuori asse.'

export async function Footer() {
  const [footerData, copy] = await Promise.all([getCachedGlobal('footer', 1)(), getSiteCopy()])
  const fallbackLegalLinks = [
    {
      openCookiePreferences: false,
      link: {
        label: copy.footer.privacyPolicyLabel,
        type: 'custom' as const,
        url: '/privacy-policy',
      },
    },
    {
      openCookiePreferences: true,
      link: {
        label: copy.footer.privacyPreferencesLabel,
        type: 'custom' as const,
        url: '/preferenze-privacy',
      },
    },
  ]
  const fallbackSocialLinks = [
    {
      openCookiePreferences: false,
      link: {
        label: copy.footer.instagramLabel,
        newTab: true,
        type: 'custom' as const,
        url: 'https://instagram.com',
      },
    },
    {
      openCookiePreferences: false,
      link: {
        label: copy.footer.linkedinLabel,
        newTab: true,
        type: 'custom' as const,
        url: 'https://linkedin.com',
      },
    },
    {
      openCookiePreferences: false,
      link: {
        label: copy.footer.twitterLabel,
        newTab: true,
        type: 'custom' as const,
        url: 'https://x.com',
      },
    },
  ]

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
            <nav aria-label={copy.footer.socialNavigationLabel} className="site-footer__link-group">
              <p className="site-footer__group-title">{copy.footer.socialTitle}</p>
              {navItems.map(({ link, openCookiePreferences }, i) => {
                if (openCookiePreferences) {
                  return (
                    <CookiePreferencesLink
                      className="site-footer__link"
                      key={i}
                      label={link?.label}
                    />
                  )
                }

                return <CMSLink className="site-footer__link" key={i} {...link} />
              })}
            </nav>

            <nav aria-label={copy.footer.legalNavigationLabel} className="site-footer__link-group">
              <p className="site-footer__group-title">{copy.footer.informationTitle}</p>
              {legalLinks.map(({ link, openCookiePreferences }, i) => {
                if (openCookiePreferences) {
                  return (
                    <CookiePreferencesLink
                      className="site-footer__link"
                      key={i}
                      label={link?.label}
                    />
                  )
                }

                return <CMSLink className="site-footer__link" key={i} {...link} />
              })}
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
