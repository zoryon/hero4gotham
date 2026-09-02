import configPromise from '@payload-config'
import { checkSubmissionRateLimit, isMeaningfulSubmission } from '@/utilities/formProtection'
import { buildContactEmail } from '@/utilities/inboundEmail'
import { getPayload } from 'payload'

export const dynamic = 'force-dynamic'

const MAX_FIELD_LENGTH = 300
const MAX_MESSAGE_LENGTH = 4000

const getString = (value: unknown, maxLength = MAX_FIELD_LENGTH) =>
  typeof value === 'string' ? value.trim().slice(0, maxLength) : ''

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

  if (!isMeaningfulSubmission(message)) {
    return Response.json({ message: 'Invalid submission.' }, { status: 400 })
  }

  const recipient =
    process.env.CONTACT_MESSAGE_TO || process.env.SMTP_TO || process.env.SMTP_FROM_ADDRESS

  if (!recipient) {
    return Response.json({ message: 'Contact recipient is not configured.' }, { status: 500 })
  }

  const payload = await getPayload({ config: configPromise })
  const emailContent = buildContactEmail({
    email,
    message,
    name,
    subject,
    title: emailSubjectPrefix,
  })

  await payload.sendEmail({
    html: emailContent.html,
    replyTo: email,
    subject: `${emailSubjectPrefix}: ${subject}`,
    text: emailContent.text,
    to: recipient,
  })

  return Response.json({ message: 'Message sent.' })
}
