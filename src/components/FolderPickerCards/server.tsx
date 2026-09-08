import { getFolderResultsComponentAndDataHandler } from '@payloadcms/ui/utilities/getFolderResultsComponentAndData'
import React from 'react'

import { FolderPickerCards } from './index'

// Keep Payload's queries, access control, breadcrumbs and selection provider.
// Only the destination picker needs tap targets instead of draggable cards:
// Payload 3.84.1 starts a drag after 3px and does not clean up pointercancel.
export const getTouchSafeFolderResults: typeof getFolderResultsComponentAndDataHandler = async (
  args,
) => {
  const result = await getFolderResultsComponentAndDataHandler(args)
  const folders = args.req.payload.config.folders
  const isFolderPicker =
    folders &&
    args.browseByFolder === false &&
    args.displayAs === 'grid' &&
    args.collectionsToDisplay?.length === 1 &&
    args.collectionsToDisplay[0] === folders.slug

  if (!isFolderPicker || !result.subfolders) return result

  return {
    ...result,
    FolderResultsComponent: (
      <FolderPickerCards items={[...result.subfolders, ...(result.documents || [])]} />
    ),
  }
}
