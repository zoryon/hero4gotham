import type { Field } from 'payload'

import { applySiteTextChanges, extractSiteTextControls } from '@/siteText/traverse'
import { siteTextField } from '@/siteText/field'
import { describe, expect, it } from 'vitest'

const fields: Field[] = [
  siteTextField(
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      label: 'Titolo',
      section: 'Contenuto',
    },
  ),
  {
    name: 'textColor',
    type: 'text',
  },
  {
    name: 'image',
    relationTo: 'media',
    type: 'upload',
  },
]

describe('site text domain', () => {
  it('extracts only explicitly marked visitor text', () => {
    const controls = extractSiteTextControls(fields, {
      image: 12,
      textColor: '#ffffff',
      title: 'Titolo originale',
    })

    expect(controls).toEqual([
      expect.objectContaining({
        control: 'text',
        label: 'Titolo',
        required: true,
        section: 'Contenuto',
        value: 'Titolo originale',
      }),
    ])
    expect(JSON.stringify(controls)).not.toContain('textColor')
    expect(JSON.stringify(controls)).not.toContain('#ffffff')
  })

  it('applies known ids without mutating or replacing unexposed values', () => {
    const original = {
      image: 12,
      textColor: '#ffffff',
      title: 'Prima',
    }
    const [control] = extractSiteTextControls(fields, original)

    const updated = applySiteTextChanges(fields, original, [
      {
        id: control.id,
        value: 'Dopo',
      },
    ])

    expect(updated).toEqual({
      image: 12,
      textColor: '#ffffff',
      title: 'Dopo',
    })
    expect(original.title).toBe('Prima')
  })

  it('rejects ids that are not present in the current catalog', () => {
    expect(() =>
      applySiteTextChanges(fields, { title: 'Prima' }, [{ id: 'forged', value: '#000000' }]),
    ).toThrow('Campo di testo non valido')
  })

  it('rejects duplicate ids instead of applying an ambiguous update', () => {
    const [control] = extractSiteTextControls(fields, { title: 'Prima' })

    expect(() =>
      applySiteTextChanges(fields, { title: 'Prima' }, [
        { id: control.id, value: 'Uno' },
        { id: control.id, value: 'Due' },
      ]),
    ).toThrow('Campo di testo duplicato')
  })

  it('changes Lexical words without changing nodes, formats, or links', () => {
    const richFields: Field[] = [
      siteTextField(
        {
          name: 'body',
          type: 'richText',
        },
        {
          label: 'Testo',
          section: 'Contenuto',
        },
      ),
    ]
    const body = {
      root: {
        children: [
          {
            children: [
              { format: 1, text: 'Apri', type: 'text' },
              {
                children: [{ format: 2, text: 'il link', type: 'text' }],
                fields: { url: 'https://example.com' },
                type: 'link',
              },
            ],
            type: 'paragraph',
          },
        ],
        type: 'root',
      },
    }
    const controls = extractSiteTextControls(richFields, { body })

    const updated = applySiteTextChanges(richFields, { body }, [
      {
        id: controls[1].id,
        value: 'la pagina',
      },
    ]) as { body: typeof body }

    expect(updated.body.root.children[0].children[1]).toEqual({
      children: [{ format: 2, text: 'la pagina', type: 'text' }],
      fields: { url: 'https://example.com' },
      type: 'link',
    })
    const originalLink = body.root.children[0]!.children[1] as {
      children: Array<{ text: string }>
    }
    expect(originalLink.children[0]!.text).toBe('il link')
  })

  it('preserves array order and block structure while editing nested text', () => {
    const nestedFields: Field[] = [
      {
        name: 'items',
        type: 'array',
        fields: [
          siteTextField({ name: 'label', type: 'text' }, { label: 'Etichetta', section: 'Voci' }),
          { name: 'color', type: 'text' },
        ],
      },
    ]
    const original = {
      items: [
        { color: '#111111', id: 'row-a', label: 'Prima' },
        { color: '#222222', id: 'row-b', label: 'Seconda' },
      ],
    }
    const controls = extractSiteTextControls(nestedFields, original)

    const updated = applySiteTextChanges(nestedFields, original, [
      { id: controls[1].id, value: 'Aggiornata' },
    ])

    expect(updated).toEqual({
      items: [
        { color: '#111111', id: 'row-a', label: 'Prima' },
        { color: '#222222', id: 'row-b', label: 'Aggiornata' },
      ],
    })
  })

  it('keeps control ids tied to existing row ids when rows are reordered', () => {
    const nestedFields: Field[] = [
      {
        name: 'items',
        type: 'array',
        fields: [
          siteTextField({ name: 'label', type: 'text' }, { label: 'Etichetta', section: 'Voci' }),
        ],
      },
    ]
    const before = extractSiteTextControls(nestedFields, {
      items: [
        { id: 'row-a', label: 'Prima' },
        { id: 'row-b', label: 'Seconda' },
      ],
    })
    const after = extractSiteTextControls(nestedFields, {
      items: [
        { id: 'row-b', label: 'Seconda' },
        { id: 'row-a', label: 'Prima' },
      ],
    })

    expect(Object.fromEntries(after.map(({ id, value }) => [value, id]))).toEqual(
      Object.fromEntries(before.map(({ id, value }) => [value, id])),
    )
  })
})
