import configPromise from '@payload-config'
import { checkSubmissionRateLimit, isMeaningfulSubmission } from '@/utilities/formProtection'
import { buildMembershipEmail } from '@/utilities/inboundEmail'
import { getPayload } from 'payload'

export const dynamic = 'force-dynamic'

const MAX_FIELD_LENGTH = 500
const MAX_MESSAGE_LENGTH = 5000
const MAX_DOCUMENT_FILE_SIZE = 4 * 1024 * 1024
const MAX_DOCUMENT_TOTAL_SIZE = 16 * 1024 * 1024

type DocumentFileKey = 'identityDocument' | 'taxCodeDocument'

const documentFileLabels: Record<DocumentFileKey, string> = {
  identityDocument: "Carta d'identita",
  taxCodeDocument: 'Codice fiscale',
}

const getString = (value: unknown, maxLength = MAX_FIELD_LENGTH) =>
  typeof value === 'string' ? value.trim().slice(0, maxLength) : ''

const getFormBoolean = (value: unknown) => value === true || value === 'true'

const sanitizeFilename = (value: string) => value.replace(/[^\w.\-]+/g, '_').slice(0, 120)

const getDocumentFiles = (formData: FormData, key: DocumentFileKey) =>
  formData
    .getAll(key)
    .filter((value): value is File => value instanceof File && value.size > 0)
    .slice(0, 3)

export async function POST(request: Request) {
  const rateLimit = checkSubmissionRateLimit(request)

  if (!rateLimit.allowed) {
    return Response.json(
      { message: 'Too many requests. Please try again later.' },
      {
        headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) },
        status: 429,
      },
    )
  }

  let body: Record<string, unknown>
  let documentFiles: Record<DocumentFileKey, File[]>

  try {
    const contentType = request.headers.get('content-type') || ''

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()

      body = Object.fromEntries(formData.entries())
      documentFiles = {
        identityDocument: getDocumentFiles(formData, 'identityDocument'),
        taxCodeDocument: getDocumentFiles(formData, 'taxCodeDocument'),
      }
    } else {
      body = (await request.json()) as Record<string, unknown>
      documentFiles = {
        identityDocument: [],
        taxCodeDocument: [],
      }
    }
  } catch {
    return Response.json({ message: 'Invalid request body.' }, { status: 400 })
  }

  if (getString(body.website)) {
    return Response.json({ message: 'Application received.' })
  }

  const fields = {
    birthDate: getString(body.birthDate),
    birthPlace: getString(body.birthPlace),
    email: getString(body.email),
    firstName: getString(body.firstName),
    interestAreas: getString(body.interestAreas, MAX_MESSAGE_LENGTH),
    lastName: getString(body.lastName),
    motivation: getString(body.motivation, MAX_MESSAGE_LENGTH),
    phone: getString(body.phone),
    requestType: getString(body.requestType),
    residenceAddress: getString(body.residenceAddress),
  }
  const declarations = {
    privacyDeclaration: getFormBoolean(body.privacyDeclaration),
    purposeDeclaration: getFormBoolean(body.purposeDeclaration),
    statuteDeclaration: getFormBoolean(body.statuteDeclaration),
    truthDeclaration: getFormBoolean(body.truthDeclaration),
  }
  const emailSubjectPrefix = getString(body.emailSubjectPrefix) || 'Nuova candidatura associazione'
  const documentFileEntries = Object.entries(documentFiles) as [DocumentFileKey, File[]][]
  const uploadedDocumentFiles = documentFileEntries.flatMap(([key, files]) =>
    files.map((file, index) => ({ file, index, key })),
  )
  const hasTaxCodeDocument = documentFiles.taxCodeDocument.length > 0
  const hasIdentityDocument = documentFiles.identityDocument.length > 0

  if (
    !fields.firstName ||
    !fields.lastName ||
    !fields.birthDate ||
    !fields.birthPlace ||
    !fields.residenceAddress ||
    !fields.email ||
    !fields.phone ||
    !fields.requestType ||
    !fields.interestAreas ||
    !fields.motivation ||
    !declarations.statuteDeclaration ||
    !declarations.purposeDeclaration ||
    !declarations.truthDeclaration ||
    !declarations.privacyDeclaration ||
    !hasTaxCodeDocument ||
    !hasIdentityDocument
  ) {
    return Response.json({ message: 'Missing required fields.' }, { status: 400 })
  }

  if (!isMeaningfulSubmission(fields.motivation)) {
    return Response.json({ message: 'Invalid submission.' }, { status: 400 })
  }

  const totalDocumentSize = uploadedDocumentFiles.reduce((total, { file }) => total + file.size, 0)
  const invalidDocumentFile = uploadedDocumentFiles.find(
    ({ file }) => file.size > MAX_DOCUMENT_FILE_SIZE || !file.type.startsWith('image/'),
  )

  if (invalidDocumentFile || totalDocumentSize > MAX_DOCUMENT_TOTAL_SIZE) {
    return Response.json({ message: 'Invalid document upload.' }, { status: 400 })
  }

  const recipient =
    process.env.MEMBERSHIP_APPLICATION_TO ||
    process.env.CONTACT_MESSAGE_TO ||
    process.env.SMTP_TO ||
    process.env.SMTP_FROM_ADDRESS

  if (!recipient) {
    return Response.json({ message: 'Application recipient is not configured.' }, { status: 500 })
  }

  const payload = await getPayload({ config: configPromise })
  const emailContent = buildMembershipEmail({
    declarations,
    documents: uploadedDocumentFiles.map(({ file, key }) => ({
      label: documentFileLabels[key],
      name: file.name,
      size: file.size,
      type: file.type,
    })),
    fields,
    title: emailSubjectPrefix,
  })
  const attachments = await Promise.all(
    uploadedDocumentFiles.map(async ({ file, index, key }) => ({
      content: Buffer.from(await file.arrayBuffer()),
      contentType: file.type,
      filename: `${documentFileLabels[key]} ${index + 1} - ${sanitizeFilename(file.name)}`,
    })),
  )

  await payload.sendEmail({
    attachments,
    html: emailContent.html,
    replyTo: fields.email,
    subject: `${emailSubjectPrefix}: ${fields.firstName} ${fields.lastName}`,
    text: emailContent.text,
    to: recipient,
  })

  return Response.json({ message: 'Application sent.' })
}
