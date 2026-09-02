export type SiteTextPath = Array<number | string>

type LexicalTextLeaf = {
  path: SiteTextPath
  value: string
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value)

export const extractLexicalTextLeaves = (
  value: unknown,
  basePath: SiteTextPath = [],
): LexicalTextLeaf[] => {
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => extractLexicalTextLeaves(item, [...basePath, index]))
  }

  if (!isRecord(value)) return []

  if (value.type === 'text' && typeof value.text === 'string') {
    return [{ path: [...basePath, 'text'], value: value.text }]
  }

  return Object.entries(value).flatMap(([key, child]) =>
    extractLexicalTextLeaves(child, [...basePath, key]),
  )
}
