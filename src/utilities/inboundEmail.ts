type ContactEmailData = {
  email: string
  message: string
  name: string
  subject: string
  title: string
}

type MembershipFields = {
  birthDate: string
  birthPlace: string
  email: string
  firstName: string
  interestAreas: string
  lastName: string
  motivation: string
  phone: string
  requestType: string
  residenceAddress: string
}

type MembershipDeclarations = {
  privacyDeclaration: boolean
  purposeDeclaration: boolean
  statuteDeclaration: boolean
  truthDeclaration: boolean
}

type MembershipDocument = {
  label: string
  name: string
  size: number
  type: string
}

type MembershipEmailData = {
  declarations: MembershipDeclarations
  documents: MembershipDocument[]
  fields: MembershipFields
  title: string
}

export const escapeEmailHTML = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')

const formatMultiline = (value: string) => escapeEmailHTML(value).replace(/\r?\n/g, '<br />')

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`

  return `${new Intl.NumberFormat('it-IT', { maximumFractionDigits: 1 }).format(bytes / 1024 / 1024)} MB`
}

const formatFileType = (mimeType: string) => {
  const subtype = mimeType.split('/')[1]
  return subtype ? subtype.replace('jpeg', 'JPEG').replace('png', 'PNG').toUpperCase() : 'FILE'
}

const detailRows = (rows: [string, string][]) =>
  rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:10px 12px;color:#725d69;font-size:13px;font-weight:700;vertical-align:top;width:34%;border-bottom:1px solid #eadfe5;">${escapeEmailHTML(label)}</td>
          <td style="padding:10px 12px;color:#251923;font-size:15px;line-height:1.5;border-bottom:1px solid #eadfe5;">${formatMultiline(value || '-')}</td>
        </tr>`,
    )
    .join('')

const section = (title: string, content: string) => `
  <tr>
    <td style="padding:0 28px 24px;">
      <h2 style="margin:0 0 10px;color:#3c2239;font-family:Arial,sans-serif;font-size:17px;line-height:1.3;">${escapeEmailHTML(title)}</h2>
      ${content}
    </td>
  </tr>`

const emailLayout = ({
  body,
  recipientEmail,
  recipientName,
  title,
}: {
  body: string
  recipientEmail: string
  recipientName: string
  title: string
}) => {
  const safeEmail = escapeEmailHTML(recipientEmail)
  const safeName = escapeEmailHTML(recipientName)
  const replyPreposition = /^[aàáâä]/iu.test(recipientName) ? 'ad' : 'a'

  return `<!doctype html>
<html lang="it">
  <body style="margin:0;padding:0;background:#f3edf0;color:#251923;font-family:Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3edf0;padding:24px 12px;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:680px;background:#fffdfb;border:1px solid #ddcbd4;border-radius:14px;overflow:hidden;box-shadow:0 8px 24px rgba(49,29,44,.10);">
          <tr>
            <td style="padding:28px;background:#2b1729;border-bottom:4px solid #b88a49;">
              <div style="color:#d9b978;font-size:12px;font-weight:800;letter-spacing:1.6px;text-transform:uppercase;">Hero 4 Gotham</div>
              <h1 style="margin:8px 0 0;color:#ffffff;font-size:25px;line-height:1.25;">${escapeEmailHTML(title)}</h1>
            </td>
          </tr>
          <tr><td style="height:24px;font-size:0;line-height:0;">&nbsp;</td></tr>
          ${body}
          <tr>
            <td style="padding:0 28px 30px;">
              <a href="mailto:${safeEmail}" style="display:inline-block;padding:12px 18px;background:#713d62;color:#ffffff;text-decoration:none;border-radius:8px;font-size:14px;font-weight:700;">Rispondi ${replyPreposition} ${safeName}</a>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 28px;background:#f5eef2;color:#7b6873;font-size:12px;line-height:1.5;">Messaggio inviato automaticamente dal sito Hero 4 Gotham.</td>
          </tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`
}

export const buildContactEmail = (data: ContactEmailData) => ({
  html: emailLayout({
    body: [
      section(
        'Contatto',
        `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eadfe5;border-radius:10px;border-collapse:separate;overflow:hidden;">${detailRows(
          [
            ['Nome', data.name],
            ['Email', data.email],
            ['Oggetto', data.subject],
          ],
        )}</table>`,
      ),
      section(
        'Messaggio',
        `<div style="padding:16px 18px;background:#faf6f8;border-left:4px solid #b88a49;border-radius:8px;color:#251923;font-size:15px;line-height:1.7;">${formatMultiline(data.message)}</div>`,
      ),
    ].join(''),
    recipientEmail: data.email,
    recipientName: data.name,
    title: data.title,
  }),
  text: [
    data.title,
    '',
    `Nome: ${data.name}`,
    `Email: ${data.email}`,
    `Oggetto: ${data.subject}`,
    '',
    data.message,
  ].join('\n'),
})

export const buildMembershipEmail = (data: MembershipEmailData) => {
  const { declarations, documents, fields } = data
  const documentHTML = documents
    .map(
      (document) => `
        <tr>
          <td style="padding:12px;border-bottom:1px solid #eadfe5;">
            <div style="color:#3c2239;font-size:14px;font-weight:700;">${escapeEmailHTML(document.label)}</div>
            <div style="margin-top:4px;color:#725d69;font-size:13px;">${escapeEmailHTML(document.name)} &middot; ${formatFileType(document.type)} &middot; ${formatFileSize(document.size)}</div>
          </td>
        </tr>`,
    )
    .join('')
  const declarationRows: [string, string][] = [
    ['Statuto e regolamento', declarations.statuteDeclaration ? 'Sì' : 'No'],
    ['Finalità associative', declarations.purposeDeclaration ? 'Sì' : 'No'],
    ['Dati veritieri', declarations.truthDeclaration ? 'Sì' : 'No'],
    ['Privacy', declarations.privacyDeclaration ? 'Sì' : 'No'],
  ]

  return {
    html: emailLayout({
      body: [
        section(
          'Dati personali',
          `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eadfe5;border-radius:10px;border-collapse:separate;overflow:hidden;">${detailRows(
            [
              ['Nome', fields.firstName],
              ['Cognome', fields.lastName],
              ['Data di nascita', fields.birthDate],
              ['Luogo di nascita', fields.birthPlace],
              ['Indirizzo di residenza', fields.residenceAddress],
              ['Email', fields.email],
              ['Telefono', fields.phone],
            ],
          )}</table>`,
        ),
        section(
          'Documenti allegati',
          `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eadfe5;border-radius:10px;border-collapse:separate;overflow:hidden;">${documentHTML}</table>`,
        ),
        section(
          'Candidatura',
          `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eadfe5;border-radius:10px;border-collapse:separate;overflow:hidden;">${detailRows(
            [
              ['Tipo di richiesta', fields.requestType],
              ['Aree di interesse', fields.interestAreas],
            ],
          )}</table>`,
        ),
        section(
          'Motivazione',
          `<div style="padding:16px 18px;background:#faf6f8;border-left:4px solid #b88a49;border-radius:8px;color:#251923;font-size:15px;line-height:1.7;">${formatMultiline(fields.motivation)}</div>`,
        ),
        section(
          'Dichiarazioni',
          `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eadfe5;border-radius:10px;border-collapse:separate;overflow:hidden;">${detailRows(declarationRows)}</table>`,
        ),
      ].join(''),
      recipientEmail: fields.email,
      recipientName: `${fields.firstName} ${fields.lastName}`,
      title: data.title,
    }),
    text: [
      data.title,
      '',
      'Dati personali',
      `Nome: ${fields.firstName}`,
      `Cognome: ${fields.lastName}`,
      `Data di nascita: ${fields.birthDate}`,
      `Luogo di nascita: ${fields.birthPlace}`,
      `Indirizzo di residenza: ${fields.residenceAddress}`,
      `Email: ${fields.email}`,
      `Telefono: ${fields.phone || '-'}`,
      '',
      'Documenti allegati',
      ...documents.map(
        (document) =>
          `${document.label}: ${document.name} (${formatFileType(document.type)}, ${formatFileSize(document.size)})`,
      ),
      '',
      'Candidatura',
      `Tipo di richiesta: ${fields.requestType}`,
      `Aree di interesse: ${fields.interestAreas || '-'}`,
      '',
      'Motivazione',
      fields.motivation,
      '',
      'Dichiarazioni',
      ...declarationRows.map(([label, value]) => `${label}: ${value}`),
    ].join('\n'),
  }
}
