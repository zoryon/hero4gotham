import type { CollectionAfterChangeHook, CollectionSlug } from 'payload'

type VersionedCollection = Extract<CollectionSlug, 'pages' | 'posts'>

/**
 * Payload 3.84.1 can leave more than one version marked as `latest` when an
 * autosave and a publish overlap. Draft queries then return the same document
 * once per latest version, which produces duplicate rows in the admin table.
 */
export const normalizeLatestVersions =
  (collection: VersionedCollection): CollectionAfterChangeHook =>
  async ({ doc, req }) => {
    const { docs: latestVersions } = await req.payload.db.findVersions({
      collection,
      limit: 0,
      pagination: false,
      req,
      sort: ['-updatedAt', '-id'],
      where: {
        and: [{ parent: { equals: doc.id } }, { latest: { equals: true } }],
      },
    })

    for (const staleVersion of latestVersions.slice(1)) {
      await req.payload.db.updateVersion({
        collection,
        id: staleVersion.id,
        req,
        returning: false,
        versionData: {
          createdAt: staleVersion.createdAt,
          latest: false,
          parent: doc.id,
          updatedAt: staleVersion.updatedAt,
          version: staleVersion.version,
        },
      })
    }

    return doc
  }
