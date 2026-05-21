import React from 'react'

import type {
  Event as EventDocument,
  Media as MediaDocument,
  PhotoGalleryStripBlock as PhotoGalleryStripBlockProps,
} from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import {
  typographyFontFamilyStyles,
  typographyFontSizeClasses,
  typographyFontWeightClasses,
  typographyLetterSpacingClasses,
  typographySubtitleFontSizeClasses,
  typographyVerticalScaleValues,
} from '@/fields/typography'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { cn } from '@/utilities/ui'
import configPromise from '@payload-config'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'

type GalleryEventData = Pick<EventDocument, 'gallery' | 'id' | 'startsAt' | 'title'>

type StripPhoto = {
  id: number | string
  image: MediaDocument
}

const cardTransforms = [
  'rotate-[-2.3deg] md:translate-y-1',
  'rotate-[2.2deg] md:-translate-y-1',
  'rotate-[5deg] md:translate-y-1',
]

const tapeClasses = [
  'left-[-0.45rem] top-[-0.62rem] rotate-[-9deg] bg-[#8f4fb4]',
  'left-[-0.55rem] top-[-0.58rem] rotate-[-12deg] bg-[#a3b834]',
  'right-[-0.42rem] top-[-0.54rem] rotate-[26deg] bg-[#8f4fb4]',
]

const getRecordValue = <T extends Record<string, string>>(
  record: T,
  value: null | string | undefined,
  fallback: keyof T,
) => record[(value || fallback) as keyof T] || record[fallback]

const resolveBackgroundImage = (image: MediaDocument | number | null | undefined) => {
  if (!image || typeof image !== 'object') return undefined

  const url = getMediaUrl(image.url, image.updatedAt)
  return url ? `url("${url.replace(/"/g, '\\"')}")` : undefined
}

const getTextClassName = ({
  base,
  fontSize,
  fontWeight,
  letterSpacing,
  sizeKind = 'subtitle',
}: {
  base?: string
  fontSize?: null | string
  fontWeight?: null | string
  letterSpacing?: null | string
  sizeKind?: 'display' | 'subtitle'
}) =>
  cn(
    base,
    sizeKind === 'display'
      ? getRecordValue(typographyFontSizeClasses, fontSize, 'compact')
      : getRecordValue(typographySubtitleFontSizeClasses, fontSize, 'small'),
    getRecordValue(typographyFontWeightClasses, fontWeight, 'black'),
    getRecordValue(typographyLetterSpacingClasses, letterSpacing, 'tight'),
  )

const getTextStyle = ({
  color,
  fontFamily,
  fontStyle,
  verticalScale,
}: {
  color?: null | string
  fontFamily?: null | string
  fontStyle?: null | string
  verticalScale?: null | string
}): React.CSSProperties => ({
  color: color || undefined,
  display: 'inline-block',
  fontFamily: getRecordValue(typographyFontFamilyStyles, fontFamily, 'rye'),
  fontStyle: fontStyle === 'italic' ? 'italic' : 'normal',
  transform: `scaleY(${getRecordValue(typographyVerticalScaleValues, verticalScale, 'normal')})`,
  transformOrigin: 'top left',
})

const isMediaDocument = (
  media: MediaDocument | number | null | undefined,
): media is MediaDocument => Boolean(media && typeof media === 'object')

const getGalleryMedia = (image: MediaDocument): MediaDocument =>
  ({
    alt: image.alt,
    height: image.height,
    id: image.id,
    mimeType: image.mimeType,
    updatedAt: image.updatedAt,
    url: image.url,
    width: image.width,
  }) as MediaDocument

const shufflePhotos = (photos: StripPhoto[]) => {
  const shuffled = [...photos]

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    const current = shuffled[index]
    shuffled[index] = shuffled[swapIndex]
    shuffled[swapIndex] = current
  }

  return shuffled
}

const getAutomaticPhotoCandidates = unstable_cache(
  async (): Promise<StripPhoto[]> => {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'events',
      depth: 1,
      limit: 100,
      pagination: false,
      select: {
        gallery: {
          image: true,
        },
        startsAt: true,
        title: true,
      },
      sort: '-startsAt',
    })

    return (result.docs as GalleryEventData[]).flatMap((event) =>
      (event.gallery || []).flatMap((item, index) => {
        const image = item.image && typeof item.image === 'object' ? item.image : null

        if (!image) return []

        return [
          {
            id: `${event.id}-${item.id || image.id || index}`,
            image: getGalleryMedia(image),
          },
        ]
      }),
    )
  },
  ['photo-gallery-strip-candidates'],
  {
    revalidate: 300,
    tags: ['events'],
  },
)

const getManualPhotos = async (
  manualPhotos: PhotoGalleryStripBlockProps['manualPhotos'],
): Promise<StripPhoto[]> => {
  const selected = (manualPhotos || []).filter(Boolean)
  const populated = selected.filter(isMediaDocument)

  if (populated.length === selected.length) {
    return populated.slice(0, 3).map((image) => ({ id: image.id, image }))
  }

  const ids = selected
    .map((photo) => (typeof photo === 'object' ? photo.id : photo))
    .filter((id): id is number => typeof id === 'number')

  if (!ids.length) return populated.slice(0, 3).map((image) => ({ id: image.id, image }))

  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'media',
    depth: 0,
    limit: 3,
    pagination: false,
    where: {
      id: {
        in: ids,
      },
    },
  })
  const docsById = new Map((result.docs as MediaDocument[]).map((doc) => [doc.id, doc]))

  return ids
    .map((id) => docsById.get(id))
    .filter((image): image is MediaDocument => Boolean(image))
    .slice(0, 3)
    .map((image) => ({ id: image.id, image }))
}

export const PhotoGalleryStripBlock = async ({
  ctaBackgroundImage,
  ctaFallbackBackgroundColor = '#a3e635',
  ctaLabel = 'Vedi tutte le foto',
  ctaLabelColor = '#211713',
  ctaLabelFontFamily,
  ctaLabelFontSize,
  ctaLabelFontStyle,
  ctaLabelFontWeight,
  ctaLabelLetterSpacing,
  ctaLabelVerticalScale,
  ctaLink,
  headingBottom = 'Galleria',
  headingBottomColor = '#f4f4f5',
  headingBottomFontFamily,
  headingBottomFontSize,
  headingBottomFontStyle,
  headingBottomFontWeight,
  headingBottomLetterSpacing,
  headingBottomVerticalScale,
  headingTop = 'Dalla nostra',
  headingTopColor = '#f4f4f5',
  headingTopFontFamily,
  headingTopFontSize,
  headingTopFontStyle,
  headingTopFontWeight,
  headingTopLetterSpacing,
  headingTopVerticalScale,
  headingUnderlineColor = '#e879f9',
  manualPhotos,
  photoSource = 'automatic',
}: PhotoGalleryStripBlockProps) => {
  const photos =
    photoSource === 'manual'
      ? await getManualPhotos(manualPhotos)
      : shufflePhotos(await getAutomaticPhotoCandidates()).slice(0, 3)

  const visiblePhotos = photos.slice(0, 3)
  const ctaLinkHasHref = Boolean(
    ctaLink?.url ||
      (ctaLink?.type === 'reference' &&
        ctaLink.reference?.value &&
        typeof ctaLink.reference.value === 'object' &&
        ctaLink.reference.value.slug),
  )

  const ctaClassName = getTextClassName({
    base: 'inline-flex min-h-9 w-[min(100%,10.5rem)] items-center justify-center px-4 py-2 text-center uppercase shadow-[0_4px_0_rgb(0_0_0_/_0.18)]',
    fontSize: ctaLabelFontSize,
    fontWeight: ctaLabelFontWeight,
    letterSpacing: ctaLabelLetterSpacing,
  })
  const ctaStyle: React.CSSProperties = {
    backgroundColor: ctaBackgroundImage ? 'transparent' : ctaFallbackBackgroundColor || '#a3e635',
    backgroundImage: resolveBackgroundImage(ctaBackgroundImage),
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '100% 100%',
    clipPath: 'polygon(3% 0, 100% 0, 97% 92%, 0 100%)',
    color: ctaLabelColor || '#211713',
    fontFamily: getRecordValue(typographyFontFamilyStyles, ctaLabelFontFamily, 'cinzel'),
    fontStyle: ctaLabelFontStyle === 'italic' ? 'italic' : 'normal',
    transform: `scaleY(${getRecordValue(
      typographyVerticalScaleValues,
      ctaLabelVerticalScale,
      'normal',
    )})`,
    transformOrigin: 'center',
  }

  return (
    <section className="photo-gallery-strip vintage-surface relative isolate overflow-hidden px-4 py-5 md:px-6 md:py-6 xl:px-4 xl:py-5">
      <div className="relative z-10 grid min-w-0 items-center gap-6 md:grid-cols-[10.5rem_minmax(0,1fr)] lg:grid-cols-[12rem_minmax(0,1fr)] xl:gap-8">
        <div className="grid min-w-0 justify-items-start">
          <h2 className="grid min-w-0 leading-none">
            <span
              className={getTextClassName({
                base: 'uppercase',
                fontSize: headingTopFontSize,
                fontWeight: headingTopFontWeight,
                letterSpacing: headingTopLetterSpacing,
              })}
              style={getTextStyle({
                color: headingTopColor,
                fontFamily: headingTopFontFamily,
                fontStyle: headingTopFontStyle,
                verticalScale: headingTopVerticalScale,
              })}
            >
              {headingTop}
            </span>
            <span
              className={getTextClassName({
                base: 'mt-1 uppercase',
                fontSize: headingBottomFontSize,
                fontWeight: headingBottomFontWeight,
                letterSpacing: headingBottomLetterSpacing,
              })}
              style={getTextStyle({
                color: headingBottomColor,
                fontFamily: headingBottomFontFamily,
                fontStyle: headingBottomFontStyle,
                verticalScale: headingBottomVerticalScale,
              })}
            >
              {headingBottom}
            </span>
          </h2>
          <span
            aria-hidden
            className="mt-2 h-1 w-28 -rotate-2"
            style={{ backgroundColor: headingUnderlineColor || '#e879f9' }}
          />
          <div className="mt-5 w-full">
            {ctaLinkHasHref ? (
              <CMSLink {...ctaLink} className={ctaClassName} label={ctaLabel} style={ctaStyle} />
            ) : (
              <span className={ctaClassName} style={ctaStyle}>
                {ctaLabel}
              </span>
            )}
          </div>
        </div>

        <div className="grid min-w-0 gap-5 sm:grid-cols-3 sm:gap-4 lg:gap-6">
          {visiblePhotos.map((photo, index) => (
            <figure
              className={cn(
                'photo-gallery-strip-card relative aspect-[16/9] min-h-0 bg-zinc-100 p-1 shadow-[0_15px_28px_rgb(0_0_0_/_0.45)]',
                cardTransforms[index] || cardTransforms[0],
              )}
              key={photo.id}
            >
              <span
                aria-hidden
                className={cn(
                  'absolute z-20 h-5 w-16 opacity-90 shadow-[0_2px_4px_rgb(0_0_0_/_0.25)]',
                  tapeClasses[index] || tapeClasses[0],
                )}
              />
              <div className="relative h-full overflow-hidden bg-black">
                <Media
                  fill
                  imgClassName="object-cover object-center"
                  pictureClassName="absolute inset-0"
                  resource={photo.image}
                  size="(max-width: 639px) 92vw, (max-width: 1023px) 28vw, 26vw"
                />
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
