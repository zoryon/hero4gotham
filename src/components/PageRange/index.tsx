'use client'

import React from 'react'
import { useSiteCopy } from '@/providers/SiteCopy'

const defaultLabels = {
  plural: 'Docs',
  singular: 'Doc',
}

const defaultCollectionLabels = {
  posts: {
    plural: 'Posts',
    singular: 'Post',
  },
}

export const PageRange: React.FC<{
  className?: string
  collection?: keyof typeof defaultCollectionLabels
  collectionLabels?: {
    plural?: string
    singular?: string
  }
  currentPage?: number
  limit?: number
  totalDocs?: number
}> = (props) => {
  const copy = useSiteCopy()
  const {
    className,
    collection,
    collectionLabels: collectionLabelsFromProps,
    currentPage,
    limit,
    totalDocs,
  } = props

  let indexStart = (currentPage ? currentPage - 1 : 1) * (limit || 1) + 1
  if (totalDocs && indexStart > totalDocs) indexStart = 0

  let indexEnd = (currentPage || 1) * (limit || 1)
  if (totalDocs && indexEnd > totalDocs) indexEnd = totalDocs

  const { plural, singular } =
    collectionLabelsFromProps ||
    (collection === 'posts'
      ? { plural: copy.posts.pluralLabel, singular: copy.posts.singularLabel }
      : collection
        ? defaultCollectionLabels[collection]
        : undefined) ||
    defaultLabels ||
    {}

  return (
    <div className={[className, 'font-semibold'].filter(Boolean).join(' ')}>
      {(typeof totalDocs === 'undefined' || totalDocs === 0) && copy.posts.rangeEmpty}
      {typeof totalDocs !== 'undefined' &&
        totalDocs > 0 &&
        copy.posts.rangeSummary
          .replace('{start}', String(indexStart))
          .replace('{end}', String(indexEnd))
          .replace('{total}', String(totalDocs))
          .replace('{label}', totalDocs > 1 ? plural || '' : singular || '')}
    </div>
  )
}
