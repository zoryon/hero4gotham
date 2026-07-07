import configPromise from '@payload-config'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'

type CmsVariable = {
  name: string
  type: 'boolean' | 'date' | 'number' | 'text'
  value: string
}

type CmsVariableValues = Record<string, string>

const variableTokenPattern = /{{\s*([a-z][a-z0-9_]*)\s*}}/g

const formatVariableValue = ({ type, value }: CmsVariable) => {
  const normalizedValue = value.trim()

  if (type === 'number') {
    const numberValue = Number(normalizedValue)
    return Number.isFinite(numberValue)
      ? new Intl.NumberFormat('it-IT', { maximumFractionDigits: 20 }).format(numberValue)
      : normalizedValue
  }

  if (type === 'date') {
    const date = new Date(`${normalizedValue}T00:00:00Z`)
    return Number.isNaN(date.getTime())
      ? normalizedValue
      : new Intl.DateTimeFormat('it-IT', { timeZone: 'UTC' }).format(date)
  }

  if (type === 'boolean') {
    return ['sì', 'si', 'true', '1'].includes(normalizedValue.toLowerCase()) ? 'Sì' : 'No'
  }

  return value
}

const loadCmsVariableValues = unstable_cache(
  async (): Promise<CmsVariableValues> => {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'variables',
      depth: 0,
      limit: 500,
      pagination: false,
      select: {
        name: true,
        type: true,
        value: true,
      },
    })

    return Object.fromEntries(
      (result.docs as CmsVariable[]).map((variable) => [
        variable.name,
        formatVariableValue(variable),
      ]),
    )
  },
  ['cms-variables'],
  {
    revalidate: 300,
    tags: ['cms-variables'],
  },
)

const containsVariableToken = (value: unknown): boolean => {
  if (typeof value === 'string') return /{{\s*[a-z][a-z0-9_]*\s*}}/.test(value)
  if (Array.isArray(value)) return value.some(containsVariableToken)
  if (!value || typeof value !== 'object') return false

  return Object.values(value).some(containsVariableToken)
}

const replaceVariableTokens = (value: string, variables: CmsVariableValues) =>
  value.replace(variableTokenPattern, (token, name: string) => variables[name] ?? token)

const resolveValue = <T>(value: T, variables: CmsVariableValues): T => {
  if (typeof value === 'string') return replaceVariableTokens(value, variables) as T
  if (Array.isArray(value)) return value.map((item) => resolveValue(item, variables)) as T
  if (!value || typeof value !== 'object') return value

  return Object.fromEntries(
    Object.entries(value).map(([key, nestedValue]) => [key, resolveValue(nestedValue, variables)]),
  ) as T
}

export const resolveCmsVariables = async <T>(value: T): Promise<T> => {
  if (!containsVariableToken(value)) return value

  return resolveValue(value, await loadCmsVariableValues())
}
