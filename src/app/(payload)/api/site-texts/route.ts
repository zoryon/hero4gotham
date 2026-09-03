import config from '@payload-config'
import { getPayload, type Payload } from 'payload'

import {
  listSiteTextDocuments,
  readSiteTextDocument,
  saveSiteTextDocument,
  SiteTextServiceError,
} from '@/siteText/service'
import type { SaveSiteTextDocumentInput } from '@/siteText/types'

const errorResponse = (error: unknown, payload: Payload) => {
  if (error instanceof SiteTextServiceError) {
    return Response.json({ code: error.code, message: error.message }, { status: error.status })
  }

  if (
    error &&
    typeof error === 'object' &&
    'status' in error &&
    (error as { status?: unknown }).status === 404
  ) {
    return Response.json({ code: 'NOT_FOUND', message: 'Contenuto non trovato' }, { status: 404 })
  }

  if (
    error &&
    typeof error === 'object' &&
    'status' in error &&
    (error as { status?: unknown }).status === 400
  ) {
    return Response.json(
      { code: 'VALIDATION_ERROR', message: 'Controlla i testi inseriti e riprova.' },
      { status: 400 },
    )
  }

  payload.logger.error({ err: error, message: 'Errore nella gestione dei testi del sito' })
  return Response.json(
    { code: 'INTERNAL_ERROR', message: 'Errore interno del server' },
    { status: 500 },
  )
}

export async function handleGetSiteTexts(
  request: Request,
  payload: Payload,
  user: unknown,
): Promise<Response> {
  if (!user) {
    return Response.json({ code: 'UNAUTHORIZED', message: 'Sessione non valida' }, { status: 401 })
  }

  try {
    const sourceID = new URL(request.url).searchParams.get('sourceID')
    if (sourceID) {
      return Response.json({ document: await readSiteTextDocument(payload, user, sourceID) })
    }

    return Response.json({ documents: await listSiteTextDocuments(payload, user) })
  } catch (error) {
    return errorResponse(error, payload)
  }
}

export async function handlePatchSiteTexts(
  request: Request,
  payload: Payload,
  user: unknown,
): Promise<Response> {
  if (!user) {
    return Response.json({ code: 'UNAUTHORIZED', message: 'Sessione non valida' }, { status: 401 })
  }

  try {
    const input = (await request.json()) as SaveSiteTextDocumentInput
    return Response.json({
      document: await saveSiteTextDocument(payload, user, input),
      message: 'Testi pubblicati.',
    })
  } catch (error) {
    if (error instanceof SyntaxError) {
      return Response.json(
        { code: 'INVALID_CHANGES', message: 'Richiesta non valida' },
        { status: 400 },
      )
    }

    return errorResponse(error, payload)
  }
}

export async function GET(request: Request): Promise<Response> {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: request.headers })
  return handleGetSiteTexts(request, payload, user)
}

export async function PATCH(request: Request): Promise<Response> {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: request.headers })
  return handlePatchSiteTexts(request, payload, user)
}
