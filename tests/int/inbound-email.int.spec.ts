// @vitest-environment node

import { buildContactEmail, buildMembershipEmail } from '@/utilities/inboundEmail'
import { describe, expect, it } from 'vitest'

describe('inbound email templates', () => {
  it('renders a readable contact email and escapes visitor content', () => {
    const email = buildContactEmail({
      email: 'mario@example.com',
      message: 'Vorrei informazioni.\n<script>alert(1)</script>',
      name: 'Mario Rossi',
      subject: 'Prossimo evento',
      title: 'Nuovo messaggio dal sito',
    })

    expect(email.html).toContain('Hero 4 Gotham')
    expect(email.html).toContain('Rispondi a Mario Rossi')
    expect(email.html).toContain('mailto:mario@example.com')
    expect(email.html).toContain('Vorrei informazioni.<br')
    expect(email.html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;')
    expect(email.html).not.toContain('<script>alert(1)</script>')
    expect(email.text).toContain('Nome: Mario Rossi')
  })

  it('presents membership documents with file type and human-readable size', () => {
    const email = buildMembershipEmail({
      declarations: {
        privacyDeclaration: true,
        purposeDeclaration: true,
        statuteDeclaration: true,
        truthDeclaration: true,
      },
      documents: [
        {
          label: "Carta d'identita",
          name: 'documento-fronte.jpg',
          size: 1_572_864,
          type: 'image/jpeg',
        },
      ],
      fields: {
        birthDate: '1990-01-01',
        birthPlace: 'Roma',
        email: 'anna@example.com',
        firstName: 'Anna',
        interestAreas: 'Eventi e volontariato',
        lastName: 'Verdi',
        motivation: 'Vorrei contribuire alle iniziative.',
        phone: '+39 333 0000000',
        requestType: 'Nuova iscrizione',
        residenceAddress: 'Via Roma 1',
      },
      title: 'Nuova candidatura associazione',
    })

    expect(email.html).toContain('Documenti allegati')
    expect(email.html).toContain('documento-fronte.jpg')
    expect(email.html).toContain('JPEG')
    expect(email.html).toContain('1,5 MB')
    expect(email.html).toContain('Rispondi ad Anna Verdi')
    expect(email.text).toContain("Carta d'identita: documento-fronte.jpg (JPEG, 1,5 MB)")
  })
})
