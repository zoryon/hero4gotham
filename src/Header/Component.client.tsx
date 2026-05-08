'use client'

import { useHeaderTheme } from '@/providers/HeaderTheme'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { typographyFontFamilyStyles, typographyVerticalScaleValues } from '@/fields/typography'
import { formatTextTransform, textTransformClass, textTransformCssValue } from '@/fields/uiOptions'
import { cn } from '@/utilities/ui'

interface HeaderClientProps {
  data: Header
}

type HeaderNavItem = NonNullable<Header['navItems']>[number]
type HeaderSocialItem = NonNullable<Header['socialItems']>[number]
type HeaderTypography = NonNullable<Header['eyebrowTypography']>

const typographyDefaults = {
  brandTypography: {
    fontFamily: 'cinzel',
    fontSize: 27,
    fontWeight: 'black',
    letterSpacing: 0.03,
    lineHeight: 0.95,
    textTransform: 'uppercase',
    verticalScale: 'normal',
  },
  eyebrowTypography: {
    fontFamily: 'cinzel',
    fontSize: 13,
    fontWeight: 'black',
    letterSpacing: 0.1,
    lineHeight: 0.95,
    textTransform: 'uppercase',
    verticalScale: 'normal',
  },
  navTypography: {
    fontFamily: 'cinzel',
    fontSize: 14,
    fontWeight: 'black',
    letterSpacing: 0.03,
    lineHeight: 1,
    textTransform: 'uppercase',
    verticalScale: 'normal',
  },
  socialTypography: {
    fontFamily: 'sans',
    fontSize: 18,
    fontWeight: 'black',
    letterSpacing: 0,
    lineHeight: 1,
    textTransform: 'normal',
    verticalScale: 'normal',
  },
  taglineTypography: {
    fontFamily: 'cinzel',
    fontSize: 16,
    fontWeight: 'black',
    letterSpacing: 0.12,
    lineHeight: 0.95,
    textTransform: 'uppercase',
    verticalScale: 'normal',
  },
} as const

const fontWeightValues = {
  black: 900,
  bold: 700,
  medium: 500,
  regular: 400,
  semibold: 600,
} as const

const px = (value: number | null | undefined, fallback: number) => `${value ?? fallback}px`
const em = (value: number | null | undefined, fallback: number) => `${value ?? fallback}em`

const typographyVars = (
  prefix: string,
  typography: HeaderTypography | null | undefined,
  defaults: (typeof typographyDefaults)[keyof typeof typographyDefaults],
) => {
  const fontFamily = typography?.fontFamily || defaults.fontFamily
  const fontWeight = typography?.fontWeight || defaults.fontWeight
  const verticalScale = typography?.verticalScale || defaults.verticalScale

  return {
    [`--${prefix}-family`]:
      typographyFontFamilyStyles[fontFamily as keyof typeof typographyFontFamilyStyles],
    [`--${prefix}-size`]: px(typography?.fontSize, defaults.fontSize),
    [`--${prefix}-weight`]: fontWeightValues[fontWeight as keyof typeof fontWeightValues],
    [`--${prefix}-letter-spacing`]: em(typography?.letterSpacing, defaults.letterSpacing),
    [`--${prefix}-line-height`]: typography?.lineHeight ?? defaults.lineHeight,
    [`--${prefix}-text-transform`]: textTransformCssValue(
      typography?.textTransform || defaults.textTransform,
    ),
    [`--${prefix}-vertical-scale`]:
      typographyVerticalScaleValues[verticalScale as keyof typeof typographyVerticalScaleValues],
  }
}

const getNavHref = (link: HeaderNavItem['link']) => {
  if (link?.type === 'custom') return link.url || ''
  if (
    link?.type === 'reference' &&
    link.reference?.value &&
    typeof link.reference.value === 'object' &&
    'slug' in link.reference.value
  ) {
    const slug = link.reference.value.slug
    if (link.reference.relationTo === 'pages' && slug === 'home') return '/'

    return link.reference.relationTo === 'pages'
      ? `/${slug}`
      : `/${link.reference.relationTo}/${slug}`
  }

  return ''
}

const getSocialHref = (item: HeaderSocialItem) => {
  if (item.platform === 'email' && item.url && !item.url.startsWith('mailto:')) {
    return `mailto:${item.url}`
  }

  return item.url || '#'
}

const decodePath = (path: string) => {
  try {
    return decodeURI(path)
  } catch {
    return path
  }
}

const normalizePath = (path: string) => {
  const pathname = decodePath(path.split(/[?#]/)[0] || '/').normalize('NFC')
  return pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
}

const isNavItemActive = (pathname: string, href: string) => {
  if (!href || href.startsWith('#')) return false

  const currentPath = normalizePath(pathname)
  const navPath = normalizePath(href)

  if (navPath === '/') return currentPath === '/'

  return currentPath === navPath || currentPath.startsWith(`${navPath}/`)
}

const SocialIcon: React.FC<{
  platform?: HeaderSocialItem['platform'] | null
  label?: string | null
}> = ({ label, platform }) => {
  if (platform === 'instagram') {
    return (
      <svg aria-hidden className="size-[1.05em]" fill="none" viewBox="0 0 24 24">
        <rect height="16" rx="5" stroke="currentColor" strokeWidth="2.4" width="16" x="4" y="4" />
        <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="2.4" />
        <circle cx="17.2" cy="6.8" fill="currentColor" r="1.2" />
      </svg>
    )
  }

  if (platform === 'email') {
    return (
      <svg aria-hidden className="size-[1.05em]" fill="none" viewBox="0 0 24 24">
        <rect height="14" rx="2.5" stroke="currentColor" strokeWidth="2.4" width="18" x="3" y="5" />
        <path
          d="m4.5 7 7.5 6 7.5-6"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.4"
        />
      </svg>
    )
  }

  return (
    <span className="font-black lowercase leading-none">
      {platform === 'facebook' ? 'f' : label?.slice(0, 1)}
    </span>
  )
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()
  const navItems = data?.navItems || []
  const socialItems = data?.socialItems || []
  const hasLogo = Boolean(data?.logo && typeof data.logo === 'object')
  const eyebrowTextTransform = data?.eyebrowTypography?.textTransform
  const brandTextTransform = data?.brandTypography?.textTransform
  const taglineTextTransform = data?.taglineTypography?.textTransform
  const navTextTransform = data?.navTypography?.textTransform
  const socialTextTransform = data?.socialTypography?.textTransform

  useEffect(() => {
    setHeaderTheme(null)
    setIsMenuOpen(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (!isMenuOpen) return

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMenuOpen(false)
    }

    window.addEventListener('keydown', closeOnEscape)

    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [isMenuOpen])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  return (
    <header
      className="site-header z-20 w-full"
      style={
        {
          '--header-accent': data?.accentColor || '#a6bd17',
          '--header-bg': data?.backgroundColor || 'transparent',
          '--header-height': `${data?.height || 92}px`,
          '--header-logo-width': `${data?.logoWidth || 82}px`,
          '--header-max-width': `${data?.maxWidth || 1240}px`,
          '--header-text': data?.textColor || '#f4f0dc',
          ...typographyVars(
            'header-eyebrow',
            data?.eyebrowTypography,
            typographyDefaults.eyebrowTypography,
          ),
          ...typographyVars(
            'header-brand',
            data?.brandTypography,
            typographyDefaults.brandTypography,
          ),
          ...typographyVars(
            'header-tagline',
            data?.taglineTypography,
            typographyDefaults.taglineTypography,
          ),
          ...typographyVars('header-nav', data?.navTypography, typographyDefaults.navTypography),
          ...typographyVars(
            'header-social',
            data?.socialTypography,
            typographyDefaults.socialTypography,
          ),
        } as React.CSSProperties
      }
      {...(theme ? { 'data-theme': theme } : {})}
    >
      <div className="site-header__inner">
        <Link aria-label="Home" className="site-header__brand" href="/">
          <span className="site-header__logo" aria-hidden={!hasLogo}>
            {hasLogo ? (
              <Media
                className="h-full w-full"
                imgClassName="h-full w-full object-contain"
                loading="eager"
                priority
                resource={data.logo}
              />
            ) : (
              <Logo loading="eager" priority="high" className="h-full w-full object-contain" />
            )}
          </span>
          <span className="site-header__brand-copy">
            {data?.eyebrow ? (
              <span
                className={cn('site-header__eyebrow', textTransformClass(eyebrowTextTransform))}
              >
                {formatTextTransform(data.eyebrow, eyebrowTextTransform)}
              </span>
            ) : null}
            {data?.brandName ? (
              <span className={cn('site-header__name', textTransformClass(brandTextTransform))}>
                {formatTextTransform(data.brandName, brandTextTransform)}
              </span>
            ) : null}
            {data?.tagline ? (
              <span
                className={cn('site-header__tagline', textTransformClass(taglineTextTransform))}
              >
                {formatTextTransform(data.tagline, taglineTextTransform)}
              </span>
            ) : null}
          </span>
        </Link>

        <button
          aria-controls="site-header-menu"
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? 'Chiudi navigazione' : 'Apri navigazione'}
          className="site-header__menu-toggle"
          onClick={() => setIsMenuOpen((open) => !open)}
          type="button"
        >
          {isMenuOpen ? (
            <X aria-hidden className="size-5" />
          ) : (
            <Menu aria-hidden className="size-5" />
          )}
        </button>

        <div
          className={cn('site-header__menu', isMenuOpen && 'site-header__menu--open')}
          id="site-header-menu"
        >
          <nav
            aria-label="Primary navigation"
            className="site-header__nav"
            onClickCapture={(event) => {
              if (event.target instanceof Element && event.target.closest('a')) {
                setIsMenuOpen(false)
              }
            }}
          >
            {navItems.map(({ link }, i) => {
              const href = getNavHref(link)
              const isActive = isNavItemActive(pathname, href)

              return (
                <CMSLink
                  key={i}
                  {...link}
                  appearance="inline"
                  className={cn(
                    'site-header__nav-link',
                    textTransformClass(navTextTransform),
                    isActive && 'site-header__nav-link--active',
                  )}
                  label={formatTextTransform(link.label, navTextTransform)}
                />
              )
            })}
          </nav>

          {socialItems.length ? (
            <nav aria-label="Social links" className="site-header__social">
              {socialItems.map((item, index) => (
                <a
                  aria-label={item.label || item.platform || 'Social'}
                  className={cn(
                    'site-header__social-link',
                    textTransformClass(socialTextTransform),
                  )}
                  href={getSocialHref(item)}
                  key={`${item.platform}-${index}`}
                  onClick={() => setIsMenuOpen(false)}
                  rel="noopener noreferrer"
                  target={item.platform === 'email' ? undefined : '_blank'}
                >
                  <span className="site-header__social-glyph">
                    <SocialIcon label={item.label} platform={item.platform} />
                  </span>
                </a>
              ))}
            </nav>
          ) : null}
        </div>
      </div>
    </header>
  )
}
