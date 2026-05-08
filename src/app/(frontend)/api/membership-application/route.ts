import configPromise from '@payload-config'
import { getPayload } from 'payload'

export const dynamic = 'force-dynamic'

const MAX_FIELD_LENGTH = 500
const MAX_MESSAGE_LENGTH = 5000

const escapeHTML = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')

const getString = (value: unknown, maxLength = MAX_FIELD_LENGTH) =>
  typeof value === 'string' ? value.trim().slice(0, maxLength) : ''

const getBoolean = (value: unknown) => value === true

export async function POST(request: Request) {
  let body: Record<string, unknown>

  try {
    body = (await request.json()) as Record<string, unknown>
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
    fiscalCode: getString(body.fiscalCode).toUpperCase(),
    interestAreas: getString(body.interestAreas, MAX_MESSAGE_LENGTH),
    lastName: getString(body.lastName),
    motivation: getString(body.motivation, MAX_MESSAGE_LENGTH),
    phone: getString(body.phone),
    requestType: getString(body.requestType),
    residenceAddress: getString(body.residenceAddress),
  }
  const declarations = {
    mediaConsent: getBoolean(body.mediaConsent),
    privacyDeclaration: getBoolean(body.privacyDeclaration),
    purposeDeclaration: getBoolean(body.purposeDeclaration),
    statuteDeclaration: getBoolean(body.statuteDeclaration),
    truthDeclaration: getBoolean(body.truthDeclaration),
  }
  const emailSubjectPrefix = getString(body.emailSubjectPrefix) || 'Nuova candidatura associazione'

  if (
    !fields.firstName ||
    !fields.lastName ||
    !fields.birthDate ||
    !fields.birthPlace ||
    !fields.fiscalCode ||
    !fields.residenceAddress ||
    !fields.email ||
    !fields.requestType ||
    !fields.motivation ||
    !declarations.statuteDeclaration ||
    !declarations.purposeDeclaration ||
    !declarations.truthDeclaration ||
    !declarations.privacyDeclaration
  ) {
    return Response.json({ message: 'Missing required fields.' }, { status: 400 })
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
  const escaped = Object.fromEntries(
    Object.entries(fields).map(([key, value]) => [key, escapeHTML(value).replace(/\n/g, '<br />')]),
  ) as Record<keyof typeof fields, string>

  const declarationRows = [
    ['Statuto e regolamento', declarations.statuteDeclaration],
    ['Finalita associative', declarations.purposeDeclaration],
    ['Dati veritieri', declarations.truthDeclaration],
    ['Privacy', declarations.privacyDeclaration],
    ['Foto/video eventi', declarations.mediaConsent],
  ]

  await payload.sendEmail({
    html: `
      <h2>${escapeHTML(emailSubjectPrefix)}</h2>
      <h3>Dati personali</h3>
      <table cellpadding="8" cellspacing="0" style="border-collapse:collapse">
        <tr><td><strong>Nome</strong></td><td>${escaped.firstName}</td></tr>
        <tr><td><strong>Cognome</strong></td><td>${escaped.lastName}</td></tr>
        <tr><td><strong>Data di nascita</strong></td><td>${escaped.birthDate}</td></tr>
        <tr><td><strong>Luogo di nascita</strong></td><td>${escaped.birthPlace}</td></tr>
        <tr><td><strong>Codice fiscale</strong></td><td>${escaped.fiscalCode}</td></tr>
        <tr><td><strong>Indirizzo di residenza</strong></td><td>${escaped.residenceAddress}</td></tr>
        <tr><td><strong>Email</strong></td><td>${escaped.email}</td></tr>
        <tr><td><strong>Telefono</strong></td><td>${escaped.phone || '-'}</td></tr>
      </table>
      <h3>Candidatura</h3>
      <table cellpadding="8" cellspacing="0" style="border-collapse:collapse">
        <tr><td><strong>Tipo di richiesta</strong></td><td>${escaped.requestType}</td></tr>
        <tr><td><strong>Aree di interesse</strong></td><td>${escaped.interestAreas || '-'}</td></tr>
      </table>
      <p><strong>Motivazione</strong></p>
      <p>${escaped.motivation}</p>
      <h3>Dichiarazioni</h3>
      <table cellpadding="8" cellspacing="0" style="border-collapse:collapse">
        ${declarationRows
          .map(
            ([label, value]) =>
              `<tr><td><strong>${escapeHTML(String(label))}</strong></td><td>${value ? 'Si' : 'No'}</td></tr>`,
          )
          .join('')}
      </table>
    `,
    replyTo: fields.email,
    subject: `${emailSubjectPrefix}: ${fields.firstName} ${fields.lastName}`,
    text: [
      emailSubjectPrefix,
      '',
      'Dati personali',
      `Nome: ${fields.firstName}`,
      `Cognome: ${fields.lastName}`,
      `Data di nascita: ${fields.birthDate}`,
      `Luogo di nascita: ${fields.birthPlace}`,
      `Codice fiscale: ${fields.fiscalCode}`,
      `Indirizzo di residenza: ${fields.residenceAddress}`,
      `Email: ${fields.email}`,
      `Telefono: ${fields.phone || '-'}`,
      '',
      'Candidatura',
      `Tipo di richiesta: ${fields.requestType}`,
      `Aree di interesse: ${fields.interestAreas || '-'}`,
      '',
      fields.motivation,
      '',
      'Dichiarazioni',
      ...declarationRows.map(([label, value]) => `${label}: ${value ? 'Si' : 'No'}`),
    ].join('\n'),
    to: recipient,
  })

  return Response.json({ message: 'Application sent.' })
}
