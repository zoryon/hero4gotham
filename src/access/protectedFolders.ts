import type {
  Access,
  CollectionBeforeValidateHook,
  CollectionConfig,
  FieldAccess,
  PayloadRequest,
  Where,
} from 'payload'

type AppRole = 'admin' | 'eventsManager' | null
type FolderRecord = {
  folder?: number | string | { id?: number | string } | null
  id: number | string
  protectedFromEventsManagers?: boolean | null
}

const protectedFolderIDsContextKey = 'protectedFolderIDsForEventsManagers'
const protectedMediaIDsContextKey = 'protectedMediaIDsForEventsManagers'

const getRole = (user: unknown): AppRole => {
  if (!user || typeof user !== 'object' || !('role' in user)) return null
  const role = user.role
  return role === 'admin' || role === 'eventsManager' ? role : null
}

const getRelationshipID = (value: FolderRecord['folder']) => {
  if (typeof value === 'number' || typeof value === 'string') return value
  if (value && typeof value === 'object') return value.id
  return null
}

const getProtectedFolderIDs = async (req: PayloadRequest): Promise<(number | string)[]> => {
  const context = req.context as Record<string, unknown>
  const cached = context[protectedFolderIDsContextKey]

  if (cached instanceof Promise) return cached as Promise<(number | string)[]>
  if (Array.isArray(cached)) return cached as (number | string)[]

  const query = (async () => {
    const result = await req.payload.find({
      collection: 'payload-folders',
      depth: 0,
      overrideAccess: true,
      pagination: false,
      req,
      select: {
        folder: true,
        protectedFromEventsManagers: true,
      },
    })
    const folders = result.docs as FolderRecord[]
    const protectedIDs = new Set<number | string>(
      folders.filter((folder) => folder.protectedFromEventsManagers).map((folder) => folder.id),
    )
    const childrenByParent = new Map<number | string, (number | string)[]>()

    folders.forEach((folder) => {
      const parentID = getRelationshipID(folder.folder)
      if (parentID === null || parentID === undefined) return

      const children = childrenByParent.get(parentID) || []
      children.push(folder.id)
      childrenByParent.set(parentID, children)
    })

    const pending = [...protectedIDs]

    while (pending.length) {
      const parentID = pending.shift()
      if (parentID === undefined) continue

      for (const childID of childrenByParent.get(parentID) || []) {
        if (protectedIDs.has(childID)) continue
        protectedIDs.add(childID)
        pending.push(childID)
      }
    }

    const ids = [...protectedIDs]
    context[protectedFolderIDsContextKey] = ids
    return ids
  })()

  context[protectedFolderIDsContextKey] = query
  return query
}

const folderIsNotProtected = (protectedIDs: (number | string)[]): Where => ({
  id: {
    not_in: protectedIDs,
  },
})

const getProtectedMediaIDs = async (
  req: PayloadRequest,
  protectedFolderIDs: (number | string)[],
): Promise<(number | string)[]> => {
  const context = req.context as Record<string, unknown>
  const cached = context[protectedMediaIDsContextKey]

  if (cached instanceof Promise) return cached as Promise<(number | string)[]>
  if (Array.isArray(cached)) return cached as (number | string)[]

  const query = (async () => {
    const result = await req.payload.find({
      collection: 'media',
      depth: 0,
      overrideAccess: true,
      pagination: false,
      req,
      where: {
        folder: {
          in: protectedFolderIDs,
        },
      },
    })
    const ids = result.docs.map((media) => media.id)
    context[protectedMediaIDsContextKey] = ids
    return ids
  })()

  context[protectedMediaIDsContextKey] = query
  return query
}

const mediaIsVisibleToCurrentUser = async (req: PayloadRequest): Promise<Where | true> => {
  const protectedFolderIDs = await getProtectedFolderIDs(req)
  if (!protectedFolderIDs.length) return true

  const protectedMediaIDs = await getProtectedMediaIDs(req, protectedFolderIDs)
  return protectedMediaIDs.length ? folderIsNotProtected(protectedMediaIDs) : true
}

export const foldersVisibleToCurrentUser: Access = async ({ req }) => {
  const role = getRole(req.user)
  if (role === 'admin') return true
  if (role !== 'eventsManager') return false

  const protectedIDs = await getProtectedFolderIDs(req)
  return protectedIDs.length ? folderIsNotProtected(protectedIDs) : true
}

export const mediaVisibleToCurrentUser: Access = async ({ req }) => {
  const role = getRole(req.user)
  if (role !== 'eventsManager') return true

  return mediaIsVisibleToCurrentUser(req)
}

export const mediaEditableByCurrentUser: Access = async ({ req }) => {
  const role = getRole(req.user)
  if (role === 'admin') return true
  if (role !== 'eventsManager') return false

  return mediaIsVisibleToCurrentUser(req)
}

export const protectedFolderFieldAccess: FieldAccess = ({ req }) => getRole(req.user) === 'admin'

export const preventProtectedFolderAssignment: CollectionBeforeValidateHook = async ({
  data,
  req,
}) => {
  if (getRole(req.user) !== 'eventsManager' || !data || !('folder' in data)) return data

  const folderID = getRelationshipID(data.folder as FolderRecord['folder'])
  if (folderID === null || folderID === undefined) return data

  const protectedIDs = await getProtectedFolderIDs(req)

  if (protectedIDs.includes(folderID)) {
    throw new Error('Non puoi usare una cartella protetta.')
  }

  return data
}

export const protectedFolderCollectionOverride = ({
  collection,
}: {
  collection: Omit<CollectionConfig, 'trash'>
}): Omit<CollectionConfig, 'trash'> => ({
  ...collection,
  access: {
    ...collection.access,
    delete: foldersVisibleToCurrentUser,
    read: foldersVisibleToCurrentUser,
    update: foldersVisibleToCurrentUser,
  },
  fields: [
    ...collection.fields,
    {
      name: 'protectedFromEventsManagers',
      type: 'checkbox',
      access: {
        create: protectedFolderFieldAccess,
        read: protectedFolderFieldAccess,
        update: protectedFolderFieldAccess,
      },
      admin: {
        description:
          'Se attiva, i gestori eventi non vedranno questa cartella, le sottocartelle e i media contenuti.',
        position: 'sidebar',
      },
      defaultValue: false,
      index: true,
      label: 'Protetta dai gestori eventi',
    },
  ],
  hooks: {
    ...collection.hooks,
    beforeValidate: [...(collection.hooks?.beforeValidate || []), preventProtectedFolderAssignment],
  },
})
