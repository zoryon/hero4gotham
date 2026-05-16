import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import { homeStatic } from '@/endpoints/seed/home-static'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { SiteBackgroundFrame, type SiteBackgroundSettings } from '@/SiteBackground/Component'
import { generateMeta } from '@/utilities/generateMeta'
import { getCachedGlobal } from '@/utilities/getGlobals'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { cn } from '@/utilities/ui'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const pages = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = pages.docs
    ?.filter((doc) => {
      return doc.slug !== 'home'
    })
    .map(({ slug }) => {
      return { slug }
    })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = 'home' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const url = '/' + decodedSlug
  let page: RequiredDataFromCollectionSlug<'pages'> | null

  page = await queryPageBySlug({
    slug: decodedSlug,
  })

  // Remove this code once your website is seeded
  if (!page && slug === 'home') {
    page = homeStatic
  }

  if (!page) {
    return <PayloadRedirects url={url} />
  }

  const { hero, layout } = page
  const siteBackground = await getCachedGlobal('siteBackground', 1)().catch(() => null)
  const hasHeroContent = Boolean(
    hero?.richText ||
    hero?.media ||
    (Array.isArray(hero?.links) && hero.links.some(({ link }) => Boolean(link))),
  )
  const hasHero = Boolean(hero?.type && hero.type !== 'none' && hasHeroContent)
  const hasHighImpactHero = hasHero && hero?.type === 'highImpact'
  const pageLayout = (Array.isArray(layout) ? layout : []) as PageLayoutBlockWithLegacy[]
  const legacyBackgroundSettings = getFirstLegacyBackgroundContainer(pageLayout)
  const renderLayout = unwrapLegacyBackgroundContainers(pageLayout)
  const startsUnderHeader = hasHighImpactHero || !hasHero

  return (
    <article className={cn(!startsUnderHeader && 'pt-[calc(var(--header-height,92px)+2rem)]')}>
      <PageClient />
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      {hasHero ? <RenderHero {...hero} /> : null}
      <SiteBackgroundFrame
        fallbackSettings={legacyBackgroundSettings}
        isFirstPageBlock={!hasHero}
        settings={siteBackground}
      >
        <RenderBlocks
          blocks={renderLayout}
          markFirstBlock={!hasHero}
          wrapperClassName="my-8 first:mt-0 last:mb-0"
        />
      </SiteBackgroundFrame>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = 'home' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const page = await queryPageBySlug({
    slug: decodedSlug,
  })

  return generateMeta({ doc: page })
}

const queryPageBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})

type PageLayoutBlock = NonNullable<RequiredDataFromCollectionSlug<'pages'>['layout']>[number]

type LegacyBackgroundContainerBlock = SiteBackgroundSettings & {
  blocks?: PageLayoutBlock[] | null
  blockType?: string | null
}

type PageLayoutBlockWithLegacy = PageLayoutBlock | LegacyBackgroundContainerBlock

const isLegacyBackgroundContainer = (
  block: PageLayoutBlockWithLegacy | null | undefined,
): block is LegacyBackgroundContainerBlock => {
  return block?.blockType === 'backgroundContainer'
}

const getFirstLegacyBackgroundContainer = (
  blocks: PageLayoutBlockWithLegacy[],
): SiteBackgroundSettings | null => {
  const legacyBlock = blocks.find(isLegacyBackgroundContainer)

  return legacyBlock || null
}

const unwrapLegacyBackgroundContainers = (blocks: PageLayoutBlockWithLegacy[]): PageLayoutBlock[] => {
  return blocks.flatMap((block) => {
    if (!isLegacyBackgroundContainer(block)) return [block as PageLayoutBlock]

    return Array.isArray(block.blocks) ? block.blocks : []
  })
}
