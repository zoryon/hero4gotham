# Editor Testi del Sito Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Aggiungere a Payload una vista `Testi del sito` dalla quale admin e gestori eventi possono pubblicare tutti i testi destinati ai visitatori senza modificare struttura, formattazione, link, media, colori o layout.

**Architecture:** I campi CMS ammessi vengono marcati esplicitamente nello schema con metadati `custom.siteText` e trasformati da un servizio server-side in controlli testuali normalizzati. Una API autenticata applica soltanto patch ricostruite dal catalogo corrente, con controllo di concorrenza su `updatedAt`; una Global `siteCopy` raccoglie le stringhe frontend oggi hardcoded e viene esposta dalla stessa vista.

**Tech Stack:** Payload CMS 3.84.1, Next.js 16 App Router, React 19, TypeScript 5.7, PostgreSQL, Vitest 4, Playwright 1.58.

**Spec:** `docs/superpowers/specs/2026-09-02-editor-testi-sito-design.md`

## Global Constraints

- La vista modifica soltanto testo rivolto ai visitatori; stringhe dell'admin e valori tecnici sono esclusi.
- Formattazione Lexical, URL, slug, colori, media, ordine, tipo e numero degli elementi devono rimanere invariati.
- `Salva` pubblica subito e non è previsto autosalvataggio.
- Pagine, Header, Footer, Privacy, Documenti soci e `siteCopy` restano admin-only nelle schermate Payload generiche.
- Il gestore conserva i permessi completi già previsti per la collezione Eventi e per le risorse necessarie a gestirla.
- Le operazioni Local API eseguite per conto dell'utente usano `overrideAccess: false`; l'elevazione server necessaria per aggiornare una sorgente admin-only avviene soltanto nel servizio con allowlist e controllo ruolo già completati.
- Nessuna nuova dipendenza runtime è necessaria.

## Struttura dei file

- `src/siteText/types.ts`: contratti condivisi tra catalogo, API e UI.
- `src/siteText/field.ts`: helper per marcare in modo esplicito i campi testuali ammessi.
- `src/siteText/traverse.ts`: estrazione e applicazione sicura delle modifiche sui documenti.
- `src/siteText/richText.ts`: estrazione e sostituzione delle sole foglie testuali Lexical.
- `src/siteText/sources.ts`: aree, collezioni e Global che alimentano la vista.
- `src/siteText/service.ts`: lettura, autorizzazione, concorrenza e salvataggio Payload.
- `src/SiteCopy/config.ts`, `defaults.ts`, `hooks/revalidateSiteCopy.ts`: schema e fallback delle stringhe statiche.
- `src/utilities/siteCopy.ts`: caricamento cache-aware e merge con i fallback.
- `src/providers/SiteCopy/*`: disponibilità delle stringhe nei componenti client.
- `src/app/(payload)/api/site-texts/route.ts`: API HTTP della vista.
- `src/components/SiteTextEditor/*`: custom view, navigazione e stile.
- `tests/int/site-text-*.int.spec.ts`: dominio, catalogo, sicurezza, salvataggio e copertura copy.
- `tests/e2e/site-text-editor.e2e.spec.ts`: flusso utente reale.

---

### Task 1: Dominio sicuro per campi semplici e Lexical

**Files:**
- Create: `src/siteText/types.ts`
- Create: `src/siteText/field.ts`
- Create: `src/siteText/richText.ts`
- Create: `src/siteText/traverse.ts`
- Test: `tests/int/site-text-domain.int.spec.ts`

**Interfaces:**
- Produces: `siteTextField(field, options)`, `extractSiteTextControls(fields, data)`, `applySiteTextChanges(fields, data, changes)`.
- Produces: `SiteTextControl`, `SiteTextChange`, `SiteTextFieldOptions`, `SiteTextDocument`.
- Consumes: Payload `Field` definitions and plain serialized documents.

- [ ] **Step 1: Write failing tests for explicit opt-in and preservation**

```ts
// tests/int/site-text-domain.int.spec.ts
import { describe, expect, it } from 'vitest'
import { siteTextField } from '@/siteText/field'
import { applySiteTextChanges, extractSiteTextControls } from '@/siteText/traverse'

const fields = [
  siteTextField({ name: 'title', type: 'text', required: true }, { section: 'Contenuto' }),
  { name: 'textColor', type: 'text' as const },
  { name: 'image', type: 'upload' as const, relationTo: 'media' as const },
]

describe('site text domain', () => {
  it('extracts only explicitly marked visitor text', () => {
    const controls = extractSiteTextControls(fields, {
      image: 12,
      textColor: '#ffffff',
      title: 'Titolo originale',
    })

    expect(controls).toMatchObject([
      { control: 'text', label: 'Title', section: 'Contenuto', value: 'Titolo originale' },
    ])
    expect(JSON.stringify(controls)).not.toContain('textColor')
  })

  it('applies known ids and preserves every unexposed value', () => {
    const original = { image: 12, textColor: '#ffffff', title: 'Prima' }
    const [control] = extractSiteTextControls(fields, original)
    const updated = applySiteTextChanges(fields, original, [{ id: control.id, value: 'Dopo' }])

    expect(updated).toEqual({ image: 12, textColor: '#ffffff', title: 'Dopo' })
    expect(original.title).toBe('Prima')
  })

  it('rejects ids that are not present in the current catalog', () => {
    expect(() =>
      applySiteTextChanges(fields, { title: 'Prima' }, [{ id: 'forged', value: '#000000' }]),
    ).toThrow('Campo di testo non valido')
  })
})
```

- [ ] **Step 2: Run the domain test and verify it fails**

Run: `pnpm vitest run tests/int/site-text-domain.int.spec.ts`

Expected: FAIL because `@/siteText/field` and `@/siteText/traverse` do not exist.

- [ ] **Step 3: Define the shared types and opt-in helper**

```ts
// src/siteText/types.ts
export type SiteTextControlType = 'text' | 'textarea'

export type SiteTextFieldOptions = {
  description?: string
  label?: string
  section: string
}

export type SiteTextControl = SiteTextFieldOptions & {
  control: SiteTextControlType
  id: string
  required: boolean
  value: string
}

export type SiteTextChange = Pick<SiteTextControl, 'id' | 'value'>

export type SiteTextDocument = {
  area: string
  controls: SiteTextControl[]
  sourceID: string
  title: string
  version: string
}
```

```ts
// src/siteText/field.ts
import type { Field } from 'payload'
import type { SiteTextFieldOptions } from './types'

export const siteTextField = <T extends Field>(field: T, options: SiteTextFieldOptions): T => ({
  ...field,
  custom: { ...field.custom, siteText: options },
})
```

- [ ] **Step 4: Implement immutable traversal and stable control ids**

In `src/siteText/traverse.ts`, recursively traverse `group`, `tabs`, `row`, `collapsible`, `array` and `blocks`. Only a named `text`, `textarea` or `richText` field carrying `custom.siteText` is emitted. Array and block paths include the existing row `id` when available and fall back to the current index; block traversal also verifies `blockType` against the matching block config.

Use base64url-encoded JSON paths only as UI identifiers. On save, regenerate the current controls and create a `Map(control.id, internalPath)`; never decode a client id into an update path.

```ts
const currentControls = extractSiteTextControls(fields, original)
const allowed = new Map(currentControls.map((control) => [control.id, control]))

for (const change of changes) {
  if (!allowed.has(change.id)) throw new Error('Campo di testo non valido')
  if (typeof change.value !== 'string') throw new Error('Valore di testo non valido')
}
```

- [ ] **Step 5: Add Lexical leaf tests before implementation**

```ts
it('changes Lexical words without changing nodes, formats, or links', () => {
  const richFields = [
    siteTextField({ name: 'body', type: 'richText' }, { section: 'Testo' }),
  ]
  const body = {
    root: {
      type: 'root',
      children: [{
        type: 'paragraph',
        children: [{ type: 'text', text: 'Apri', format: 1 }, {
          type: 'link',
          fields: { url: 'https://example.com' },
          children: [{ type: 'text', text: 'il link', format: 2 }],
        }],
      }],
    },
  }
  const controls = extractSiteTextControls(richFields, { body })
  const updated = applySiteTextChanges(richFields, { body }, [
    { id: controls[1].id, value: 'la pagina' },
  ]) as { body: typeof body }

  expect(updated.body.root.children[0].children[1]).toEqual({
    type: 'link',
    fields: { url: 'https://example.com' },
    children: [{ type: 'text', text: 'la pagina', format: 2 }],
  })
})
```

- [ ] **Step 6: Implement Lexical leaf traversal and rerun tests**

`src/siteText/richText.ts` exports `extractLexicalTextLeaves(value, basePath)` and `replaceLexicalTextLeaves(value, replacements)`. Only objects with `type === 'text'` and a string `text` property are editable; all sibling keys are cloned unchanged.

Run: `pnpm vitest run tests/int/site-text-domain.int.spec.ts`

Expected: PASS.

- [ ] **Step 7: Commit the domain layer**

```bash
git add src/siteText tests/int/site-text-domain.int.spec.ts
git commit -m "feat: add safe site text domain"
```

### Task 2: Catalogare esplicitamente i testi Payload esistenti

**Files:**
- Create: `src/siteText/sources.ts`
- Modify: `src/fields/link.ts`
- Modify: `src/heros/config.ts`
- Modify: `src/collections/Pages/index.ts`
- Modify: `src/collections/Posts/index.ts`
- Modify: `src/collections/Activities.ts`
- Modify: `src/collections/Events.ts`
- Modify: `src/collections/Variables.ts`
- Modify: `src/collections/Categories.ts`
- Modify: `src/collections/Media.ts`
- Modify: `src/Header/config.ts`
- Modify: `src/Footer/config.ts`
- Modify: `src/PrivacyPolicy/config.ts`
- Modify: `src/MembershipDocuments/config.ts`
- Modify: `src/blocks/ArchiveBlock/config.ts`
- Modify: `src/blocks/CallToAction/config.ts`
- Modify: `src/blocks/Content/config.ts`
- Modify: `src/blocks/ContactMessage/config.ts`
- Modify: `src/blocks/ActivityChoiceCta/config.ts`
- Modify: `src/blocks/Arrow/config.ts`
- Modify: `src/blocks/FaqAccordion/config.ts`
- Modify: `src/blocks/FeatureGrid/config.ts`
- Modify: `src/blocks/EventGallery/config.ts`
- Modify: `src/blocks/PhotoGalleryStrip/config.ts`
- Modify: `src/blocks/ActivitiesDetailGrid/config.ts`
- Modify: `src/blocks/EventProposalCta/config.ts`
- Modify: `src/blocks/MembershipApplication/config.ts`
- Modify: `src/blocks/Subtitle/config.ts`
- Modify: `src/blocks/ProcessSteps/config.ts`
- Modify: `src/blocks/SocialFollowCta/config.ts`
- Modify: `src/blocks/QuoteBanner/config.ts`
- Modify: `src/blocks/Form/config.ts`
- Modify: `src/blocks/UpcomingEventsCta/config.ts`
- Modify: `src/blocks/EventSuite/FeaturedEvent/config.ts`
- Modify: `src/blocks/EventSuite/EventList/config.ts`
- Modify: `src/blocks/EventSuite/EventCalendar/config.ts`
- Modify: `src/blocks/EventFilters/config.ts`
- Modify: `src/blocks/Title/config.ts`
- Modify: `src/blocks/ThreePanelShowcase/config.ts`
- Modify: `src/blocks/UpcomingEvents/config.ts`
- Modify: `src/blocks/TornCards/config.ts`
- Test: `tests/int/site-text-catalog.int.spec.ts`

**Interfaces:**
- Consumes: `siteTextField()` and Payload collection/global field arrays.
- Produces: `siteTextSources`, `getSiteTextSource(sourceID)` and schema metadata consumed by Task 4.

- [ ] **Step 1: Write the failing catalog security test**

```ts
// tests/int/site-text-catalog.int.spec.ts
import { describe, expect, it } from 'vitest'
import configPromise from '@/payload.config'
import { extractSiteTextControls } from '@/siteText/traverse'

describe('site text catalog', () => {
  it('includes content and excludes style, URL, media and structure', async () => {
    const config = await configPromise
    const pages = config.collections.find(({ slug }) => slug === 'pages')!
    const controls = extractSiteTextControls(pages.fields, {
      title: 'Home',
      backgroundImage: 3,
      layout: [{
        blockType: 'upcomingEvents',
        heading: 'Prossimi eventi',
        headingColor: '#fff000',
        eventLinkLabel: 'Scopri',
      }],
    })
    const values = controls.map(({ value }) => value)

    expect(values).toEqual(expect.arrayContaining(['Home', 'Prossimi eventi', 'Scopri']))
    expect(values).not.toContain('#fff000')
    expect(JSON.stringify(controls)).not.toContain('backgroundImage')
  })

  it('never exposes link destinations', async () => {
    const config = await configPromise
    const header = config.globals.find(({ slug }) => slug === 'header')!
    const controls = extractSiteTextControls(header.fields, {
      navItems: [{ link: { label: 'Chi siamo', type: 'custom', url: '/segreto' } }],
    })

    expect(controls.map(({ value }) => value)).toContain('Chi siamo')
    expect(controls.map(({ value }) => value)).not.toContain('/segreto')
  })
})
```

- [ ] **Step 2: Run the catalog test and verify it fails**

Run: `pnpm vitest run tests/int/site-text-catalog.int.spec.ts`

Expected: FAIL because content fields are not marked with `custom.siteText`.

- [ ] **Step 3: Mark collection and Global content fields**

Wrap the following visitor-facing fields with `siteTextField`; do not wrap any slug, color, URL, upload, relationship, select, date, checkbox or internal populated-author id:

- Pages: `title`, `hero.richText`, `meta.title`, `meta.description` and the marked block fields listed below.
- Posts: `title`, `content`, `meta.title`, `meta.description`.
- Activities: `title`, `shortName`, `description`, `cta`, `details.text`.
- Events: `title`, `gallery.caption`, `description`, `longDescription`, `timeline.time`, `timeline.title`, `timeline.description`, `artistsAndGuests.firstName`, `artistsAndGuests.lastName`, `artistsAndGuests.description`, `usefulInfo.title`, `usefulInfo.description`, `venue`, `venueAddress`, `audience`.
- Variables: `value` only; keep its existing type-aware validator.
- Categories: `title`; keep `slug` excluded.
- Media: `alt`, `caption`; keep file data, crop and focal point excluded and retain the existing protected-folder visibility rules.
- Header: `navItems.link.label`, `socialItems.label`; exclude every social URL.
- Footer: `eyebrow`, `brandName`, `description`, `legalNote`, `navItems.link.label`, `legalLinks.link.label`.
- Privacy: `title`, `intro`, `lastUpdatedLabel`, `content`, `metaTitle`, `metaDescription`.
- Membership documents: each existing `privacyDocuments.title` and `privacyDocuments.description`.

Use Italian section names in the metadata: `Titolo`, `Hero`, `Contenuto`, `SEO`, `Navigazione`, `Social`, `Footer`, `Privacy`, `Documenti`, `Programma`, `Ospiti`, `Informazioni utili`.

- [ ] **Step 4: Mark page-block content fields and leave structural strings unmarked**

Apply `siteTextField()` to these exact content fields:

- Rich text: `ArchiveBlock.introContent`, `CallToAction.richText`, `Content.richText`, `Form.introContent`.
- Contact message: `heading`, `introText`, the four `*Placeholder` fields, `privacyLabel`, `submitLabel`, `successMessage`, `errorMessage`; exclude `privacyTriggerLinkUrl` and `emailSubjectPrefix`.
- Membership application: `heading`, `introText`, the three section titles, all `*Label` fields, `submitLabel`, `successMessage`, `errorMessage`; exclude the four `*TriggerLinkUrl` fields and `emailSubjectPrefix`.
- Activity choice: `topText`, `bottomText`, `accentText`.
- Arrow: `label`, `description`, `ariaLabel`.
- FAQ: `heading`, `iconLabel`, `items.question`, `items.answer`.
- Feature grid: `items.title`, `items.description`.
- Gallery: `loadMoreLabel`, `emptyStateLabel`.
- Photo strip: `headingTop`, `headingBottom`, `ctaLabel`.
- Activities detail grid: `heading`, `items.title`, `items.description`, `items.cta`, nested `text`.
- Event proposal: `title`, `body`, `ctaFallbackLabel`.
- Subtitle: `text`, emphasized `word` entries.
- Process steps: `heading`, `steps.numberLabel`, `steps.title`, `steps.description`.
- Social follow: `title`, `body`, social `label`, `primaryLabel`, `secondaryLabel`; exclude social `url`.
- Quote banner: `quote`, `leftQuote`, `rightQuote`.
- Upcoming events CTA: `ctaTitle`, `ctaText`, `ctaLinkFallbackLabel`, `ctaAccentLabel`.
- Featured event: `heading`, `linkFallbackLabel`.
- Event list: `heading`, `eventLinkFallbackLabel`, `emptyStateLabel`.
- Event calendar: `heading`.
- Event filters: `allEventsLabel`, `filterByLabel`, `searchPlaceholder`, `dateLabel`, `typeLabel`, `venueLabel`, `allVenuesLabel`.
- Title: `title`, emphasized `word` entries, `subtitle`.
- Three-panel showcase: each panel `title` and `body`.
- Upcoming events: `heading`, `emptyEventsTitle`, `emptyEventsText`, `eventLinkLabel`.
- Torn cards: `heading`, card `title`, card `description`, `descriptionLinkText`, emphasized `word` entries; exclude `descriptionLinkValue` because it is the destination.

Every field whose name ends in `Color`, `Bg`, `Background`, `URL`, `Url`, `Image`, `Glyph` or `Value` remains unmarked unless the preceding collection list explicitly includes it.

- [ ] **Step 5: Define source navigation and visibility**

```ts
// src/siteText/sources.ts
export const siteTextSources = [
  { area: 'Pagine', kind: 'collection', slug: 'pages', titleField: 'title' },
  { area: 'Elementi comuni', kind: 'global', slug: 'header', title: 'Header' },
  { area: 'Elementi comuni', kind: 'global', slug: 'footer', title: 'Footer' },
  { area: 'Elementi comuni', kind: 'global', slug: 'membershipDocuments', title: 'Documenti' },
  { area: 'Elementi comuni', kind: 'collection', slug: 'variables', titleField: 'name' },
  { area: 'Eventi', kind: 'collection', slug: 'events', titleField: 'title' },
  { area: 'Attività', kind: 'collection', slug: 'activities', titleField: 'title' },
  { area: 'Articoli', kind: 'collection', slug: 'posts', titleField: 'title' },
  { area: 'Articoli', kind: 'collection', slug: 'categories', titleField: 'title' },
  { area: 'Media', kind: 'collection', slug: 'media', titleField: 'filename' },
  { area: 'Moduli', kind: 'collection', slug: 'forms', titleField: 'title' },
  { area: 'Privacy', kind: 'global', slug: 'privacyPolicy', title: 'Privacy Policy' },
] as const
```

Extend the form-builder override in `src/plugins/index.ts` so its visitor-facing `title`, field labels/placeholders, submit button label, confirmation message and email messages are marked. Exclude recipient addresses, sender addresses, webhook URLs, field names and select values. Add `src/plugins/index.ts` to this task's modified files when making that change.

- [ ] **Step 6: Run catalog tests and typecheck**

Run: `pnpm vitest run tests/int/site-text-domain.int.spec.ts tests/int/site-text-catalog.int.spec.ts`

Run: `pnpm exec tsc --noEmit`

Expected: both commands exit 0.

- [ ] **Step 7: Commit the explicit catalog**

```bash
git add src/fields src/heros src/collections src/Header src/Footer src/PrivacyPolicy src/MembershipDocuments src/blocks src/plugins src/siteText/sources.ts tests/int/site-text-catalog.int.spec.ts
git commit -m "feat: catalog visitor-facing CMS text"
```

### Task 3: Global per le stringhe statiche e integrazione frontend

**Files:**
- Create: `src/SiteCopy/defaults.ts`
- Create: `src/SiteCopy/config.ts`
- Create: `src/SiteCopy/hooks/revalidateSiteCopy.ts`
- Create: `src/utilities/siteCopy.ts`
- Create: `src/providers/SiteCopy/index.tsx`
- Modify: `src/providers/index.tsx`
- Modify: `src/payload.config.ts`
- Modify: `src/app/(frontend)/layout.tsx`
- Modify: `src/Footer/Component.tsx`
- Modify: `src/Header/Nav/index.tsx`
- Modify: `src/components/CookieConsentBanner/index.tsx`
- Modify: `src/components/Card/index.tsx`
- Modify: `src/components/ui/pagination.tsx`
- Modify: `src/PrivacyPolicy/PrivacyPolicyContent.client.tsx`
- Modify: `src/heros/PostHero/index.tsx`
- Modify: `src/blocks/CallToAction/Component.tsx`
- Modify: `src/blocks/EventGallery/Component.client.tsx`
- Modify: `src/blocks/Form/Component.tsx`
- Modify: `src/blocks/ContactMessage/Component.client.tsx`
- Modify: `src/blocks/MembershipApplication/Component.client.tsx`
- Modify: `src/app/(frontend)/not-found.tsx`
- Modify: `src/app/(frontend)/search/page.tsx`
- Modify: `src/app/(frontend)/posts/page.tsx`
- Modify: `src/app/(frontend)/posts/page/[pageNumber]/page.tsx`
- Modify: `src/app/(frontend)/eventi/[slug]/page.tsx`
- Modify: `src/app/(frontend)/eventi/[slug]/EventDetailGallery.client.tsx`
- Modify: `src/utilities/siteMetadata.ts`
- Test: `tests/int/site-copy.int.spec.ts`
- Test: `tests/int/site-copy-coverage.int.spec.ts`

**Interfaces:**
- Produces: `siteCopyDefaults`, `getSiteCopy()`, `<SiteCopyProvider copy={copy}>`, `useSiteCopy()`.
- Consumes: `getCachedGlobal('siteCopy')` after generated Payload types are available; until Task 6, use a narrow local `SiteCopyData` type matching `defaults.ts`.

- [ ] **Step 1: Write failing fallback and key-completeness tests**

```ts
// tests/int/site-copy.int.spec.ts
import { describe, expect, it } from 'vitest'
import { mergeSiteCopy, siteCopyDefaults } from '@/SiteCopy/defaults'

describe('site copy', () => {
  it('keeps defaults for missing database fields', () => {
    const copy = mergeSiteCopy({ cookie: { title: 'Preferenze aggiornate' } })
    expect(copy.cookie.title).toBe('Preferenze aggiornate')
    expect(copy.cookie.acceptAll).toBe('Accetta tutto')
    expect(copy.notFound.goHome).toBe('Torna alla home')
  })

  it('contains every required frontend copy group', () => {
    expect(Object.keys(siteCopyDefaults).sort()).toEqual([
      'accessibility', 'common', 'cookie', 'eventDetail', 'footer', 'forms',
      'notFound', 'pagination', 'posts', 'privacy', 'search', 'seo',
    ])
  })
})
```

- [ ] **Step 2: Run the copy test and verify it fails**

Run: `pnpm vitest run tests/int/site-copy.int.spec.ts`

Expected: FAIL because `@/SiteCopy/defaults` does not exist.

- [ ] **Step 3: Define defaults and Payload Global**

`siteCopyDefaults` contains the current production wording, grouped as follows:

- `accessibility`: search screen-reader label, open-CTA label, loading-gallery label, more-pages label.
- `common`: generic loading label and missing-value label (`Da definire`).
- `cookie`: dialog aria label, eyebrow, title, explanatory paragraph, policy label, categories aria label, three category names/descriptions, reject, save and accept labels.
- `eventDetail`: back-to-events, date, time, venue, audience, program, guests, useful information, gallery and load-more labels plus fallback metadata title.
- `footer`: `Seguici` and `Informazioni` headings.
- `forms`: document modal eyebrow labels and generic loading message.
- `notFound`: message and home-link label.
- `pagination`: previous and next labels.
- `posts`: listing title, author label, publication-date label and missing-image label.
- `privacy`: eyebrow, section label and default introduction-section label.
- `search`: page title and empty-results message.
- `seo`: site name, default meta description, search meta title, article-list meta title template and fallback event meta title.

Define the Global with nested `group` fields whose leaf fields are `siteTextField({ type: 'text' | 'textarea' }, { section, label })`. Set `read: () => true`, `update: adminOnly`, and `admin.hidden: hideFromNonAdmins`. Its hook calls `revalidateTag('global_siteCopy', 'max')` and `revalidatePath('/', 'layout')`.

- [ ] **Step 4: Implement fallback loading and client provider**

```ts
// src/utilities/siteCopy.ts
export async function getSiteCopy(): Promise<SiteCopyData> {
  const stored = await getCachedGlobal('siteCopy', 0)().catch(() => ({}))
  return mergeSiteCopy(stored)
}
```

Load once in `src/app/(frontend)/layout.tsx`, pass it into `Providers`, and expose it with a required React context. Server components call the cached `getSiteCopy()` directly; client components call `useSiteCopy()`.

- [ ] **Step 5: Replace the enumerated hardcoded frontend strings**

Replace only visitor-facing literals in the files listed for this task. Convert the static `metadata` export in the frontend root layout to cached `generateMetadata()` so `seo.siteName` and `seo.defaultDescription` are applied to the rendered metadata; use the same copy for search, article-list and fallback-event metadata. Keep the constants in `siteMetadata.ts` only as resilience fallbacks for Payload's synchronous admin-side SEO title generator. Do not move CSS class names, route segments, event names, log/error diagnostics, email templates received only by staff, HTML attributes with protocol semantics, or Payload admin copy.

For each migrated literal, keep its exact current wording in `siteCopyDefaults` so the site is visually and semantically unchanged before an editor saves the Global.

- [ ] **Step 6: Add an automated visitor-copy audit**

Create `tests/int/site-copy-coverage.int.spec.ts`. It scans `.ts` and `.tsx` files below `src/app/(frontend)`, `src/components`, `src/blocks`, `src/Header`, `src/Footer`, `src/PrivacyPolicy` and `src/heros`, excluding test fixtures and admin-only components. The test fails for the known raw visitor literals migrated in this task (`Search`, `No results found.`, `Posts`, `Previous`, `Next`, `Seguici`, `Informazioni`, `Preferenze cookie`, `Gestisci i cookie`, `Accetta tutto`, `Da definire`, `This page could not be found.`, `Go home`, `Author`, `Date Published`, `No image`, `Caricamento foto…`, `Caricamento, attendi...`) so none can be reintroduced outside `SiteCopy/defaults.ts`.

Run the broader audit once with:

```powershell
rg -n ">\s*[A-Za-zÀ-ÿ][^<{]*<" "src/app/(frontend)" src/components src/blocks src/Header src/Footer src/PrivacyPolicy src/heros
```

For every remaining result, classify it by the rule in this task: visitor-visible prose or accessible labels move into `siteCopy`; Payload admin text, diagnostics, mail sent only to staff, routes and protocol values remain local. Add every moved literal to the regression array in `site-copy-coverage.int.spec.ts`.

- [ ] **Step 7: Add the Global to the text source registry**

Append `{ area: 'Elementi comuni', kind: 'global', slug: 'siteCopy', title: 'Testi comuni' }` in `src/siteText/sources.ts`. The generic catalog then exposes its marked leaves automatically.

- [ ] **Step 8: Run copy, coverage, metadata, and type tests**

Run: `pnpm vitest run tests/int/site-copy.int.spec.ts tests/int/site-copy-coverage.int.spec.ts tests/int/metadata.int.spec.ts`

Run: `pnpm exec tsc --noEmit`

Expected: all tests pass and TypeScript exits 0.

- [ ] **Step 9: Commit static copy support**

```bash
git add src/SiteCopy src/utilities/siteCopy.ts src/providers src/payload.config.ts src/app src/Footer src/Header src/components src/PrivacyPolicy src/heros src/blocks src/siteText/sources.ts tests/int/site-copy.int.spec.ts tests/int/site-copy-coverage.int.spec.ts
git commit -m "feat: manage static frontend copy in Payload"
```

### Task 4: Servizio di lettura/salvataggio e API autenticata

**Files:**
- Create: `src/siteText/errors.ts`
- Create: `src/siteText/service.ts`
- Create: `src/app/(payload)/api/site-texts/route.ts`
- Modify: `src/Header/config.ts`
- Modify: `src/Footer/config.ts`
- Modify: `src/PrivacyPolicy/config.ts`
- Modify: `src/MembershipDocuments/config.ts`
- Test: `tests/int/site-text-service.int.spec.ts`
- Test: `tests/int/site-text-api.int.spec.ts`

**Interfaces:**
- Produces: `listSiteTextDocuments(payload, user)`, `readSiteTextDocument(payload, user, sourceID)`, `saveSiteTextDocument(payload, user, input)`.
- Produces: `GET /api/site-texts` with optional `sourceID`, and `PATCH /api/site-texts`.
- Consumes: Task 1 traversal, Task 2 registry, `Payload`, and authenticated `User`.

- [ ] **Step 1: Write failing service authorization and integrity tests**

```ts
// tests/int/site-text-service.int.spec.ts
it('lets an events manager publish page text while preserving layout', async () => {
  const before = await payload.findByID({ collection: 'pages', id: page.id, depth: 0 })
  const document = await readSiteTextDocument(payload, eventsManager, `pages:${page.id}`)
  const title = document.controls.find((control) => control.value === before.title)!

  await saveSiteTextDocument(payload, eventsManager, {
    changes: [{ id: title.id, value: 'Titolo pubblicato' }],
    sourceID: document.sourceID,
    version: document.version,
  })

  const after = await payload.findByID({ collection: 'pages', id: page.id, depth: 0 })
  expect(after.title).toBe('Titolo pubblicato')
  expect(after.backgroundImage).toEqual(before.backgroundImage)
  expect(after.layout).toEqual(before.layout)
  expect(after._status).toBe('published')
})

it('rejects forged fields and stale versions without partial writes', async () => {
  const document = await readSiteTextDocument(payload, eventsManager, `pages:${page.id}`)
  await expect(saveSiteTextDocument(payload, eventsManager, {
    changes: [{ id: 'layout.0.headingColor', value: '#000000' }],
    sourceID: document.sourceID,
    version: document.version,
  })).rejects.toMatchObject({ status: 400 })

  await expect(saveSiteTextDocument(payload, eventsManager, {
    changes: [], sourceID: document.sourceID, version: 'stale',
  })).rejects.toMatchObject({ status: 409 })
})
```

Also assert that a missing user is rejected, an unrelated role-shaped object is rejected, and the manager still cannot update `pages` with `overrideAccess: false` through the generic Local API.

- [ ] **Step 2: Run service tests and verify they fail**

Run: `pnpm vitest run tests/int/site-text-service.int.spec.ts`

Expected: FAIL because `@/siteText/service` does not exist.

- [ ] **Step 3: Implement source resolution and authorized reads**

`listSiteTextDocuments` queries each registered collection with `depth: 0`, `pagination: false`, `limit: 500`, a minimal `select` for id/title/updatedAt, and `overrideAccess: false` when the current role already has read access. Global entries are returned without document enumeration. Media always uses `overrideAccess: false` for listing, reading and saving so protected folders and ownership restrictions cannot be bypassed by the text editor.

`readSiteTextDocument` verifies `admin` or `eventsManager`, resolves only a registered source id, reads at `depth: 0`, selects the configured Payload fields, and calls `extractSiteTextControls`. The `version` is the document/global `updatedAt`; missing timestamps produce a server error rather than disabling concurrency checks.

- [ ] **Step 4: Implement safe, atomic saves**

Use `applySiteTextChanges` against a fresh document. Compare the fresh `updatedAt` to `input.version` before applying. For a collection call one `payload.update`; for a Global call one `payload.updateGlobal`. Pass `context: { siteTextEditor: true }` and preserve hooks. Page and post updates include `_status: 'published'` and `draft: false`.

The service is the sole boundary allowed to use privileged Local API updates on admin-only sources. It receives a typed authenticated user, rechecks the role, regenerates the allowed field map, and never accepts `data`, `path`, `select` or Payload query arguments from the caller.

- [ ] **Step 5: Tighten generic Global access**

Change Header, Footer, Privacy and Membership Documents to `update: adminOnly` and `admin.hidden: hideFromNonAdmins`. Keep public reads. Field-level restrictions may remain as defense in depth. This removes the existing path that would let a manager change arrays, URLs or privacy backgrounds outside the dedicated editor.

- [ ] **Step 6: Write and implement route-handler tests**

Test the route functions using `new Request()` with mocked authenticated Payload requests or by extracting `handleGetSiteTexts(req, payload, user)` and `handlePatchSiteTexts(req, payload, user)` pure handlers. Assert status codes `200`, `400`, `401`, `403`, `404`, `409`, and `500` for their named conditions.

The Next route obtains auth with:

```ts
const payload = await getPayload({ config: configPromise })
const { user } = await payload.auth({ headers: request.headers })
```

It returns only `{ areas }`, `{ document }`, or `{ document, message: 'Testi pubblicati.' }`; exceptions are mapped through typed `SiteTextError` instances without returning stacks or internal paths.

- [ ] **Step 7: Run integration tests**

Run: `pnpm vitest run tests/int/site-text-domain.int.spec.ts tests/int/site-text-catalog.int.spec.ts tests/int/site-text-service.int.spec.ts tests/int/site-text-api.int.spec.ts tests/int/api.int.spec.ts`

Expected: all tests pass.

- [ ] **Step 8: Commit service and security changes**

```bash
git add src/siteText src/app/'(payload)'/api/site-texts src/Header src/Footer src/PrivacyPolicy src/MembershipDocuments tests/int
git commit -m "feat: add secured site text publishing API"
```

### Task 5: Custom view Payload semplice e non cluttered

**Files:**
- Create: `src/components/SiteTextEditor/View.tsx`
- Create: `src/components/SiteTextEditor/Editor.client.tsx`
- Create: `src/components/SiteTextEditor/NavLink.client.tsx`
- Create: `src/components/SiteTextEditor/index.scss`
- Modify: `src/payload.config.ts`
- Test: `tests/int/site-text-editor-ui.int.spec.tsx`
- Test: `tests/e2e/site-text-editor.e2e.spec.ts`
- Modify: `tests/helpers/seedUser.ts`

**Interfaces:**
- Consumes: Task 4 API response types and Payload `useAuth`, `useConfig`, `toast`, `Button`, `TextInput`, `TextareaInput`.
- Produces: admin route `/control-room-h4g/testi-del-sito` and one navigation link visible only to `admin` and `eventsManager`.

- [ ] **Step 1: Write failing component tests for the compact interaction**

```tsx
// tests/int/site-text-editor-ui.int.spec.tsx
it('renders selectors, collapsible sections and only text controls', async () => {
  render(<SiteTextEditor initialIndex={fixtureIndex} />)
  await userEvent.selectOptions(screen.getByLabelText('Area'), 'Pagine')
  await userEvent.selectOptions(screen.getByLabelText('Contenuto'), 'pages:1')

  expect(await screen.findByRole('button', { name: 'Salva' })).toBeVisible()
  expect(screen.getByRole('textbox', { name: 'Titolo' })).toBeVisible()
  expect(screen.queryByLabelText(/colore/i)).not.toBeInTheDocument()
  expect(screen.queryByLabelText(/immagine/i)).not.toBeInTheDocument()
})

it('warns before leaving with unsaved changes', async () => {
  render(<SiteTextEditor initialIndex={fixtureIndex} />)
  await openFixtureDocument()
  await userEvent.type(screen.getByRole('textbox', { name: 'Titolo' }), ' nuovo')
  const event = new Event('beforeunload', { cancelable: true })
  window.dispatchEvent(event)
  expect(event.defaultPrevented).toBe(true)
})
```

- [ ] **Step 2: Run UI tests and verify they fail**

Run: `pnpm vitest run tests/int/site-text-editor-ui.int.spec.tsx`

Expected: FAIL because the editor components do not exist.

- [ ] **Step 3: Implement the server view and role gate**

`View.tsx` receives Payload `AdminViewServerProps`, checks `initPageResult.req.user.role`, and returns Payload's not-authorized/redirect behavior for any role other than `admin` and `eventsManager`. It renders a heading, one explanatory sentence, and `Editor.client.tsx`; no raw document is embedded in the initial HTML.

- [ ] **Step 4: Implement the client editor state machine**

States are `idle`, `loading`, `ready`, `saving`, `saved`, `error`, and `conflict`. Load the index once; load one document after selection; keep `originalValues` and `draftValues` maps. Send only changed `{ id, value }` entries. Disable Save when clean or saving.

Render:

```tsx
<main className="site-text-editor">
  <header className="site-text-editor__header">
    <div><h1>Testi del sito</h1><p>Modifica le parole senza cambiare la grafica.</p></div>
    <Button disabled={!dirty || saving} onClick={save}>Salva</Button>
  </header>
  <div className="site-text-editor__selectors">{/* Area, then document */}</div>
  <div className="site-text-editor__sections">{/* native details/summary groups */}</div>
</main>
```

Use native `<details>` for sections, opening the first section by default. Use a one-column layout capped at `900px`, a sticky Save area on desktop, and Payload CSS variables; do not introduce icons, dashboards, cards inside cards, per-field save buttons or a permanent secondary sidebar.

On `409`, retain typed values and show `Il contenuto è stato modificato da un altro utente. Ricarica prima di salvare.` with a `Ricarica` button. On other failures retain typed values. Register `beforeunload` while dirty and require confirmation before changing selectors.

- [ ] **Step 5: Add the custom route and navigation item**

```ts
// payload.config.ts inside admin.components
beforeNavLinks: ['@/components/SiteTextEditor/NavLink.client'],
views: {
  siteTexts: {
    Component: '@/components/SiteTextEditor/View',
    exact: true,
    path: '/testi-del-sito',
  },
},
```

`NavLink.client.tsx` uses `useAuth()` and `useConfig()` to build `${adminRoute}/testi-del-sito`; it returns `null` for unauthorized roles and renders the label `Testi del sito` with the same class conventions as Payload navigation links.

- [ ] **Step 6: Run component tests and accessibility-focused lint**

Run: `pnpm vitest run tests/int/site-text-editor-ui.int.spec.tsx`

Run: `pnpm exec eslint src/components/SiteTextEditor tests/int/site-text-editor-ui.int.spec.tsx`

Expected: both commands exit 0.

- [ ] **Step 7: Implement the browser test**

Seed an `eventsManager`, log in at `/control-room-h4g`, open `/control-room-h4g/testi-del-sito`, select the seeded Home page, change its title, save, assert the success message, then request `/` and verify the published copy. Also assert that the manager receives a denied/not-found response for `/control-room-h4g/collections/pages` and `/control-room-h4g/globals/privacyPolicy`.

```ts
await expect(page.getByRole('heading', { name: 'Testi del sito' })).toBeVisible()
await page.getByLabel('Area').selectOption({ label: 'Pagine' })
await page.getByLabel('Contenuto').selectOption({ label: 'Home' })
await page.getByRole('textbox', { name: 'Titolo' }).fill('Home aggiornata')
await page.getByRole('button', { name: 'Salva' }).click()
await expect(page.getByText('Testi pubblicati.')).toBeVisible()
```

- [ ] **Step 8: Run the focused e2e test**

Run: `pnpm playwright test tests/e2e/site-text-editor.e2e.spec.ts --project=chromium`

Expected: PASS with no console errors.

- [ ] **Step 9: Commit the custom view**

```bash
git add src/components/SiteTextEditor src/payload.config.ts tests/int/site-text-editor-ui.int.spec.tsx tests/e2e/site-text-editor.e2e.spec.ts tests/helpers/seedUser.ts
git commit -m "feat: add uncluttered site text editor view"
```

### Task 6: Migrazione, generazione Payload e verifica finale

**Files:**
- Create: `src/migrations/20260902_120000_site_copy.ts`
- Modify: `src/migrations/index.ts`
- Modify: `src/payload-types.ts`
- Modify: `src/app/(payload)/control-room-h4g/importMap.js`
- Modify: `tests/int/site-text-catalog.int.spec.ts`

**Interfaces:**
- Consumes: schema e componenti completati nei Task 1-5.
- Produces: schema PostgreSQL aggiornabile, tipi Payload finali e import map risolta.

- [ ] **Step 1: Generate and inspect the database migration**

Run: `pnpm payload migrate:create site-copy`

Expected: one migration under `src/migrations/` and a matching import/entry in `src/migrations/index.ts`. Rename the generated migration and its import to `20260902_120000_site_copy` before continuing. Inspect the SQL and confirm it creates only the `site_copy` Global fields and Payload metadata required by the adapter; it must not drop or rewrite existing page/event data.

- [ ] **Step 2: Generate Payload types and import map**

Run: `pnpm generate:types`

Run: `pnpm generate:importmap`

Expected: `SiteCopy` appears in `src/payload-types.ts`; `SiteTextEditor` view and nav component appear in `src/app/(payload)/control-room-h4g/importMap.js`.

- [ ] **Step 3: Add a schema regression assertion**

```ts
it('registers the site copy global and custom admin view', async () => {
  const config = await configPromise
  expect(config.globals.some(({ slug }) => slug === 'siteCopy')).toBe(true)
  expect(config.admin.components?.views?.siteTexts?.path).toBe('/testi-del-sito')
})
```

- [ ] **Step 4: Run formatting and static verification**

Run: `pnpm exec prettier --write src tests docs/superpowers/plans/2026-09-02-editor-testi-sito.md`

Run: `pnpm lint`

Run: `pnpm exec tsc --noEmit`

Expected: all commands exit 0.

- [ ] **Step 5: Run the complete test suite**

Run: `pnpm test:int`

Run: `pnpm test:e2e`

Expected: all Vitest and Playwright tests pass.

- [ ] **Step 6: Build the production application**

Run: `pnpm build`

Expected: Next.js production build and sitemap generation exit 0; `/control-room-h4g/testi-del-sito` is included without server/client import errors.

- [ ] **Step 7: Review the final diff against the security invariants**

Run: `git diff --check`

Run: `git status --short`

Verify from the diff that no generic manager update access remains on Pagine, Header, Footer, Privacy, Documenti soci or `siteCopy`; no endpoint accepts a client field path; link URL fields and all color fields remain unmarked.

- [ ] **Step 8: Commit generated artifacts and final fixes**

```bash
git add src/migrations src/payload-types.ts src/app/'(payload)'/control-room-h4g/importMap.js tests
git commit -m "chore: finalize site text editor schema"
```
