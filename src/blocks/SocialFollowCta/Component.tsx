import React from 'react'

import type {
  Media as MediaDocument,
  SocialFollowCtaBlock as SocialFollowCtaBlockProps,
} from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import {
  typographyFontFamilyStyles,
  typographyFontWeightClasses,
  typographyLetterSpacingClasses,
  typographyVerticalScaleValues,
} from '@/fields/typography'
import { formatTextTransform, textTransformClass } from '@/fields/uiOptions'
import { cn } from '@/utilities/ui'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

type LinkField = NonNullable<SocialFollowCtaBlockProps['primaryLink']>
type SocialItem = NonNullable<SocialFollowCtaBlockProps['socialItems']>[number]
type TextStyle = NonNullable<SocialFollowCtaBlockProps['titleStyle']>

const defaultSocialItems: SocialItem[] = [
  { label: 'Facebook', platform: 'facebook', url: '#' },
  { label: 'Instagram', platform: 'instagram', url: '#' },
  { label: 'Email', platform: 'email', url: 'info@example.com' },
]

const resolveMediaDocument = async (image: MediaDocument | number | null | undefined) => {
  if (!image) return null

  if (typeof image === 'object' && image.url) return image

  try {
    const payload = await getPayload({ config: configPromise })

    return await payload.findByID({
      collection: 'media',
      depth: 0,
      id: typeof image === 'object' ? image.id : image,
    })
  } catch {
    return null
  }
}

const getRecordValue = <T extends Record<string, string>>(
  record: T,
  value: null | string | undefined,
  fallback: keyof T,
) => record[(value || fallback) as keyof T] || record[fallback]

const getTextStyle = (
  style: TextStyle | null | undefined,
  fallback: {
    color: string
    fontFamily: keyof typeof typographyFontFamilyStyles
    fontSizeDesktop: number
    fontSizeMobile: number
    fontStyle: 'italic' | 'normal'
    lineHeight: number
    verticalScale: keyof typeof typographyVerticalScaleValues
  },
  prefix: string,
): React.CSSProperties =>
  ({
    [`--${prefix}-font-size-mobile`]: `${style?.fontSizeMobile ?? fallback.fontSizeMobile}px`,
    [`--${prefix}-font-size-desktop`]: `${style?.fontSizeDesktop ?? fallback.fontSizeDesktop}px`,
    color: style?.color || fallback.color,
    display: 'inline-block',
    fontFamily: getRecordValue(typographyFontFamilyStyles, style?.fontFamily, fallback.fontFamily),
    fontStyle: style?.fontStyle === 'italic' ? 'italic' : fallback.fontStyle,
    lineHeight: style?.lineHeight ?? fallback.lineHeight,
    transform: `scaleY(${getRecordValue(
      typographyVerticalScaleValues,
      style?.verticalScale,
      fallback.verticalScale,
    )})`,
    transformOrigin: 'center',
  }) as React.CSSProperties

const getSocialHref = (item: SocialItem) => {
  if (item.platform === 'email' && item.url && !item.url.startsWith('mailto:')) {
    return `mailto:${item.url}`
  }

  return item.url || '#'
}

const hasLinkHref = (link: LinkField | null | undefined) => {
  if (!link) return false
  if (link.type === 'custom') return Boolean(link.url)

  return Boolean(link.reference)
}

const SocialIcon: React.FC<{
  platform?: SocialItem['platform']
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

const ActionLink: React.FC<{
  children: React.ReactNode
  className: string
  label: string
  link?: LinkField | null
  style?: React.CSSProperties
}> = ({ children, className, label, link, style }) => {
  if (hasLinkHref(link)) {
    return (
      <CMSLink {...link} appearance="inline" className={className} label={undefined} style={style}>
        {children}
      </CMSLink>
    )
  }

  return (
    <span aria-label={label} className={className} style={style}>
      {children}
    </span>
  )
}

export const SocialFollowCtaBlock = async ({
  accentColor = '#9fbd18',
  body = 'Resta aggiornato su eventi, attivita e novita\ndel nostro mondo. Ti aspettiamo!',
  bodyStyle,
  contentMaxWidth = 1180,
  dividerColor = 'rgb(159 189 24 / 0.68)',
  dividerHeight = 52,
  heightDesktop = 80,
  heightMobile = 170,
  iconSize = 39,
  paddingX = 36,
  paddingY = 12,
  primaryBackgroundColor = '#9fbd18',
  primaryBackgroundImage,
  primaryLabel = 'DIVENTA SOCIO',
  primaryLink,
  primaryStyle,
  secondaryColor = '#9b2da0',
  secondaryLabel = 'SCOPRI LE ATTIVITA',
  secondaryLink,
  secondaryStyle,
  socialItems,
  title = 'SEGUICI O VIENI A TROVARCI',
  titleStyle,
}: SocialFollowCtaBlockProps) => {
  const primaryBackgroundMedia = await resolveMediaDocument(primaryBackgroundImage)
  const visibleSocialItems = socialItems?.length ? socialItems : defaultSocialItems

  return (
    <section
      className="social-follow-cta"
      style={
        {
          '--social-follow-accent': accentColor || '#9fbd18',
          '--social-follow-content-max-width': `${contentMaxWidth ?? 1180}px`,
          '--social-follow-desktop-height': `${heightDesktop ?? 80}px`,
          '--social-follow-divider-color': dividerColor || 'rgb(159 189 24 / 0.68)',
          '--social-follow-divider-height': `${dividerHeight ?? 52}px`,
          '--social-follow-icon-size': `${iconSize ?? 39}px`,
          '--social-follow-mobile-height': `${heightMobile ?? 170}px`,
          '--social-follow-padding-x': `${paddingX ?? 36}px`,
          '--social-follow-padding-y': `${paddingY ?? 12}px`,
          '--social-follow-secondary': secondaryColor || '#9b2da0',
        } as React.CSSProperties
      }
    >
      <div className="social-follow-cta__inner">
        <div className="social-follow-cta__copy">
          <h2
            className={cn(
              'text-[length:var(--social-follow-title-font-size-mobile)] min-[40rem]:text-[length:var(--social-follow-title-font-size-desktop)]',
              textTransformClass(titleStyle?.textTransform),
              getRecordValue(typographyFontWeightClasses, titleStyle?.fontWeight, 'regular'),
              getRecordValue(typographyLetterSpacingClasses, titleStyle?.letterSpacing, 'normal'),
            )}
            style={getTextStyle(
              titleStyle,
              {
                color: '#a6bd17',
                fontFamily: 'rye',
                fontSizeDesktop: 15,
                fontSizeMobile: 18,
                fontStyle: 'normal',
                lineHeight: 1,
                verticalScale: 'normal',
              },
              'social-follow-title',
            )}
          >
            {formatTextTransform(title, titleStyle?.textTransform)}
          </h2>

          <p
            className={cn(
              'mt-2 whitespace-pre-line text-[length:var(--social-follow-body-font-size-mobile)] min-[40rem]:mt-1 min-[40rem]:text-[length:var(--social-follow-body-font-size-desktop)]',
              textTransformClass(bodyStyle?.textTransform),
              getRecordValue(typographyFontWeightClasses, bodyStyle?.fontWeight, 'regular'),
              getRecordValue(typographyLetterSpacingClasses, bodyStyle?.letterSpacing, 'tight'),
            )}
            style={getTextStyle(
              bodyStyle,
              {
                color: '#f4f0dc',
                fontFamily: 'geistSans',
                fontSizeDesktop: 10,
                fontSizeMobile: 13,
                fontStyle: 'normal',
                lineHeight: 1.28,
                verticalScale: 'normal',
              },
              'social-follow-body',
            )}
          >
            {formatTextTransform(body, bodyStyle?.textTransform)}
          </p>
        </div>

        <span aria-hidden className="social-follow-cta__divider" />

        <nav aria-label="Social links" className="social-follow-cta__social">
          {visibleSocialItems.map((item, index) => {
            const isEmail = item.platform === 'email'

            return (
              <a
                aria-label={item.label || item.platform || 'Social'}
                className="social-follow-cta__social-link"
                href={getSocialHref(item)}
                key={item.id || `${item.platform}-${index}`}
                rel={!isEmail && item.newTab !== false ? 'noopener noreferrer' : undefined}
                target={!isEmail && item.newTab !== false ? '_blank' : undefined}
              >
                <span className="social-follow-cta__social-glyph">
                  <SocialIcon label={item.label} platform={item.platform} />
                </span>
              </a>
            )
          })}
        </nav>

        <span aria-hidden className="social-follow-cta__divider" />

        <div className="social-follow-cta__actions">
          <ActionLink
            className="social-follow-cta__primary"
            label={primaryLabel || 'Primary CTA'}
            link={primaryLink}
            style={{
              backgroundColor: primaryBackgroundColor || '#9fbd18',
            }}
          >
            {primaryBackgroundMedia ? (
              <Media
                fill
                alt=""
                imgClassName="object-fill"
                pictureClassName="social-follow-cta__primary-media"
                resource={primaryBackgroundMedia}
                size="12rem"
              />
            ) : null}
            <span
              className={cn(
                'social-follow-cta__primary-label',
                'text-[length:var(--social-follow-primary-font-size-mobile)] min-[40rem]:text-[length:var(--social-follow-primary-font-size-desktop)]',
                textTransformClass(primaryStyle?.textTransform),
                getRecordValue(typographyFontWeightClasses, primaryStyle?.fontWeight, 'regular'),
                getRecordValue(
                  typographyLetterSpacingClasses,
                  primaryStyle?.letterSpacing,
                  'tight',
                ),
              )}
              style={getTextStyle(
                primaryStyle,
                {
                  color: '#182007',
                  fontFamily: 'rye',
                  fontSizeDesktop: 10,
                  fontSizeMobile: 12,
                  fontStyle: 'normal',
                  lineHeight: 1,
                  verticalScale: 'normal',
                },
                'social-follow-primary',
              )}
            >
              {formatTextTransform(primaryLabel, primaryStyle?.textTransform)}
            </span>
          </ActionLink>

          <ActionLink
            className="social-follow-cta__secondary"
            label={secondaryLabel || 'Secondary CTA'}
            link={secondaryLink}
          >
            <span
              className={cn(
                'text-[length:var(--social-follow-secondary-font-size-mobile)] min-[40rem]:text-[length:var(--social-follow-secondary-font-size-desktop)]',
                textTransformClass(secondaryStyle?.textTransform),
                getRecordValue(typographyFontWeightClasses, secondaryStyle?.fontWeight, 'black'),
                getRecordValue(
                  typographyLetterSpacingClasses,
                  secondaryStyle?.letterSpacing,
                  'tight',
                ),
              )}
              style={getTextStyle(
                secondaryStyle,
                {
                  color: secondaryColor || '#9b2da0',
                  fontFamily: 'cinzel',
                  fontSizeDesktop: 11,
                  fontSizeMobile: 12,
                  fontStyle: 'normal',
                  lineHeight: 1,
                  verticalScale: 'normal',
                },
                'social-follow-secondary',
              )}
            >
              {formatTextTransform(secondaryLabel, secondaryStyle?.textTransform)}
            </span>
            <span aria-hidden className="social-follow-cta__secondary-arrow">
              -&gt;
            </span>
          </ActionLink>
        </div>
      </div>
    </section>
  )
}
