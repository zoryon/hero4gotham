import configPromise from '@payload-config'
import { getPayload } from 'payload'

export const dynamic = 'force-dynamic'

const MAX_FIELD_LENGTH = 300
const MAX_MESSAGE_LENGTH = 4000

const escapeHTML = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')

const getString = (value: unknown, maxLength = MAX_FIELD_LENGTH) =>
  typeof value === 'string' ? value.trim().slice(0, maxLength) : ''

export async function POST(request: Request) {
  let body: Record<string, unknown>

  try {
    body = (await request.json()) as Record<string, unknown>
  } catch {
    return Response.json({ message: 'Invalid request body.' }, { status: 400 })
  }

  if (getString(body.website)) {
    return Response.json({ message: 'Message received.' })
  }

  const name = getString(body.name)
  const email = getString(body.email)
  const subject = getString(body.subject)
  const message = getString(body.message, MAX_MESSAGE_LENGTH)
  const emailSubjectPrefix = getString(body.emailSubjectPrefix) || 'Nuovo messaggio dal sito'
  const privacy = body.privacy === true

  if (!name || !email || !subject || !message || !privacy) {
    return Response.json({ message: 'Missing required fields.' }, { status: 400 })
  }

  const recipient =
    process.env.CONTACT_MESSAGE_TO || process.env.SMTP_TO || process.env.SMTP_FROM_ADDRESS

  if (!recipient) {
    return Response.json({ message: 'Contact recipient is not configured.' }, { status: 500 })
  }

  const payload = await getPayload({ config: configPromise })
  const escaped = {
    email: escapeHTML(email),
    message: escapeHTML(message).replace(/\n/g, '<br />'),
    name: escapeHTML(name),
    subject: escapeHTML(subject),
  }

  await payload.sendEmail({
    html: `
      <h2>${escapeHTML(emailSubjectPrefix)}</h2>
      <table cellpadding="8" cellspacing="0" style="border-collapse:collapse">
        <tr><td><strong>Nome</strong></td><td>${escaped.name}</td></tr>
        <tr><td><strong>Email</strong></td><td>${escaped.email}</td></tr>
        <tr><td><strong>Oggetto</strong></td><td>${escaped.subject}</td></tr>
      </table>
      <p>${escaped.message}</p>
    `,
    replyTo: email,
    subject: `${emailSubjectPrefix}: ${subject}`,
    text: [
      `${emailSubjectPrefix}`,
      `Nome: ${name}`,
      `Email: ${email}`,
      `Oggetto: ${subject}`,
      '',
      message,
    ].join('\n'),
    to: recipient,
  })

  return Response.json({ message: 'Message sent.' })
}
