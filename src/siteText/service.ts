import type { Field, Payload } from 'payload'

import { getSiteTextSource, siteTextSources, type SiteTextSource } from './sources'
import { buildSiteTextPatch, extractSiteTextControls } from './traverse'
import type { SaveSiteTextDocumentInput, SiteTextDocument, SiteTextDocumentSummary } from './types'

type DataRecord = Record<string, unknown>
type SiteTextRole = 'admin' | 'eventsManager'
type SiteTextUser = { role?: null | SiteTextRole }

type ConfiguredCollection = {
  fields: Field[]
  slug: string
  versions?: { drafts?: unknown } | null
}

type ConfiguredGlobal = {
  fields: Field[]
  slug: string
  versions?: { drafts?: unknown } | null
}

type LoadedDocument = {
  data: DataRecord
  fields: Field[]
  source: SiteTextSource
}

export type SiteTextErrorCode = 'FORBIDDEN' | 'INVALID_CHANGES' | 'INVALID_SOURCE' | 'STALE_VERSION'

export class SiteTextServiceError extends Error {
  code: SiteTextErrorCode
  status: number

  constructor(status: number, code: SiteTextErrorCode, message: string) {
    super(message)
    this.code = code
    this.name = 'SiteTextServiceError'
    this.status = status
  }
}

const isRecord = (value: unknown): value is DataRecord =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value)

function assertCanManageSiteText(user: unknown): asserts user is SiteTextUser {
  const role = isRecord(user) ? user.role : null
  if (role !== 'admin' && role !== 'eventsManager') {
    throw new SiteTextServiceError(403, 'FORBIDDEN', 'Accesso non autorizzato')
  }
}

const collectionConfig = (payload: Payload, slug: string) =>
  (payload.config.collections as ConfiguredCollection[]).find(
    (collection) => collection.slug === slug,
  )

const globalConfig = (payload: Payload, slug: string) =>
  (payload.config.globals as ConfiguredGlobal[]).find((global) => global.slug === slug)

const configuredSource = (payload: Payload, source: SiteTextSource) =>
  source.kind === 'collection'
    ? Boolean(collectionConfig(payload, source.slug))
    : Boolean(globalConfig(payload, source.slug))

const sourceIDFor = (source: SiteTextSource, id?: unknown) =>
  source.kind === 'global'
    ? `global:${source.slug}`
    : `collection:${source.slug}:${encodeURIComponent(String(id))}`

const parseSourceID = (sourceID: string): { id?: string; source: SiteTextSource } => {
  const [kind, slug, encodedID, ...extra] = sourceID.split(':')
  if (extra.length || (kind !== 'collection' && kind !== 'global')) {
    throw new SiteTextServiceError(400, 'INVALID_SOURCE', 'Sorgente non valida')
  }

  const source = getSiteTextSource(slug, kind)
  if (!source || (kind === 'collection' && !encodedID) || (kind === 'global' && encodedID)) {
    throw new SiteTextServiceError(400, 'INVALID_SOURCE', 'Sorgente non valida')
  }

  try {
    return {
      id: encodedID ? decodeURIComponent(encodedID) : undefined,
      source,
    }
  } catch {
    throw new SiteTextServiceError(400, 'INVALID_SOURCE', 'Sorgente non valida')
  }
}

const versionOf = (data: DataRecord) => {
  if (typeof data.updatedAt !== 'string' || !data.updatedAt) {
    throw new Error('Versione del contenuto non disponibile')
  }

  return data.updatedAt
}

const titleOf = (source: SiteTextSource, data: DataRecord) => {
  if (source.kind === 'global') return source.title
  const title = data[source.titleField]
  return typeof title === 'string' && title.trim() ? title : `Documento ${String(data.id)}`
}

const accessOptions = (source: SiteTextSource, user: SiteTextUser) =>
  source.kind === 'collection' && source.respectAccess
    ? { overrideAccess: false, user }
    : { overrideAccess: true }

const loadDocument = async (
  payload: Payload,
  user: SiteTextUser,
  sourceID: string,
): Promise<LoadedDocument> => {
  const { id, source } = parseSourceID(sourceID)
  if (!configuredSource(payload, source)) {
    throw new SiteTextServiceError(400, 'INVALID_SOURCE', 'Sorgente non configurata')
  }

  if (source.kind === 'collection') {
    const config = collectionConfig(payload, source.slug)
    const data = await payload.findByID({
      collection: source.slug,
      depth: 0,
      id: id as string,
      ...accessOptions(source, user),
    } as never)

    if (!config || !isRecord(data)) {
      throw new SiteTextServiceError(400, 'INVALID_SOURCE', 'Documento non valido')
    }

    return { data, fields: config.fields, source }
  }

  const config = globalConfig(payload, source.slug)
  const data = await payload.findGlobal({
    depth: 0,
    slug: source.slug,
    overrideAccess: true,
  } as never)

  if (!config || !isRecord(data)) {
    throw new SiteTextServiceError(400, 'INVALID_SOURCE', 'Documento non valido')
  }

  return { data, fields: config.fields, source }
}

const presentDocument = ({ data, fields, source }: LoadedDocument): SiteTextDocument => ({
  area: source.area,
  controls: extractSiteTextControls(fields, data),
  sourceID: sourceIDFor(source, data.id),
  title: titleOf(source, data),
  version: versionOf(data),
})

export const listSiteTextDocuments = async (
  payload: Payload,
  user: unknown,
): Promise<SiteTextDocumentSummary[]> => {
  assertCanManageSiteText(user)
  const summaries: SiteTextDocumentSummary[] = []

  for (const source of siteTextSources.filter((item) => configuredSource(payload, item))) {
    if (source.kind === 'global') {
      const data = await payload.findGlobal({
        depth: 0,
        overrideAccess: true,
        slug: source.slug,
      } as never)
      if (!isRecord(data)) continue
      summaries.push({
        area: source.area,
        sourceID: sourceIDFor(source),
        title: source.title,
        version: versionOf(data),
      })
      continue
    }

    const result = await payload.find({
      collection: source.slug,
      depth: 0,
      limit: 500,
      pagination: false,
      select: { [source.titleField]: true, updatedAt: true },
      sort: source.titleField,
      ...accessOptions(source, user),
    } as never)
    const documents = isRecord(result) && Array.isArray(result.docs) ? result.docs : []

    for (const data of documents) {
      if (!isRecord(data)) continue
      summaries.push({
        area: source.area,
        sourceID: sourceIDFor(source, data.id),
        title: titleOf(source, data),
        version: versionOf(data),
      })
    }
  }

  return summaries.sort(
    (left, right) =>
      left.area.localeCompare(right.area, 'it') || left.title.localeCompare(right.title, 'it'),
  )
}

export const readSiteTextDocument = async (
  payload: Payload,
  user: unknown,
  sourceID: string,
): Promise<SiteTextDocument> => {
  assertCanManageSiteText(user)
  return presentDocument(await loadDocument(payload, user, sourceID))
}

export const saveSiteTextDocument = async (
  payload: Payload,
  user: unknown,
  input: SaveSiteTextDocumentInput,
): Promise<SiteTextDocument> => {
  assertCanManageSiteText(user)
  if (!input || typeof input.sourceID !== 'string' || typeof input.version !== 'string') {
    throw new SiteTextServiceError(400, 'INVALID_CHANGES', 'Richiesta non valida')
  }

  const loaded = await loadDocument(payload, user, input.sourceID)
  if (versionOf(loaded.data) !== input.version) {
    throw new SiteTextServiceError(
      409,
      'STALE_VERSION',
      'Il contenuto è stato modificato da un altro utente. Ricarica la pagina.',
    )
  }

  let patch: DataRecord
  try {
    patch = buildSiteTextPatch(loaded.fields, loaded.data, input.changes)
  } catch (error) {
    throw new SiteTextServiceError(
      400,
      'INVALID_CHANGES',
      error instanceof Error ? error.message : 'Modifiche non valide',
    )
  }

  let updated: unknown
  if (loaded.source.kind === 'collection') {
    const config = collectionConfig(payload, loaded.source.slug)
    if (config?.versions?.drafts) patch._status = 'published'
    updated = await payload.update({
      collection: loaded.source.slug,
      context: { siteTextEditor: true },
      data: patch,
      draft: false,
      id: parseSourceID(input.sourceID).id as string,
      ...accessOptions(loaded.source, user),
    } as never)
  } else {
    updated = await payload.updateGlobal({
      context: { siteTextEditor: true },
      data: patch,
      draft: false,
      overrideAccess: true,
      slug: loaded.source.slug,
    } as never)
  }

  if (!isRecord(updated)) {
    throw new SiteTextServiceError(400, 'INVALID_CHANGES', 'Risposta di salvataggio non valida')
  }

  return presentDocument({ ...loaded, data: updated })
}
