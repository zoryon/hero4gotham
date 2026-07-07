import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  CollectionBeforeValidateHook,
  CollectionConfig,
} from 'payload'

import { adminOnly, hideFromNonAdmins } from '@/access/roles'
import { revalidateTag } from 'next/cache'

export const activityColorPalette = [
  '#f04e4e',
  '#f5b642',
  '#90a434',
  '#32b6a6',
  '#4f8df7',
  '#9d67ff',
  '#e955a5',
  '#f27d42',
] as const

const getRandomPaletteColor = () =>
  activityColorPalette[Math.floor(Math.random() * activityColorPalette.length)]

const assignActivityColor: CollectionBeforeValidateHook = async ({ data, originalDoc, req }) => {
  if (!data) return data

  if (typeof originalDoc?.color === 'string' && originalDoc.color.trim()) {
    data.color = originalDoc.color
    return data
  }

  if (typeof data.color === 'string' && data.color.trim()) return data

  const existing = await req.payload.find({
    collection: 'activities',
    depth: 0,
    limit: activityColorPalette.length,
    pagination: false,
    select: {
      color: true,
    },
  })
  const usedColors = new Set(
    existing.docs
      .map((activity) => activity.color)
      .filter((color): color is string => typeof color === 'string' && color.trim().length > 0),
  )
  const availableColors = activityColorPalette.filter((color) => !usedColors.has(color))

  data.color =
    availableColors.length > 0
      ? availableColors[Math.floor(Math.random() * availableColors.length)]
      : getRandomPaletteColor()

  return data
}

const revalidateActivities = (
  payload: Parameters<CollectionAfterChangeHook>[0]['req']['payload'],
) => {
  payload.logger.info(`Revalidating activities`)
  revalidateTag('activities', 'max')
  revalidateTag('events', 'max')
}

const revalidateActivitiesAfterChange: CollectionAfterChangeHook = ({
  doc,
  req: { context, payload },
}) => {
  if (!context.disableRevalidate) {
    revalidateActivities(payload)
  }

  return doc
}

const revalidateActivitiesAfterDelete: CollectionAfterDeleteHook = ({
  doc,
  req: { context, payload },
}) => {
  if (!context.disableRevalidate) {
    revalidateActivities(payload)
  }

  return doc
}

const enforceActivitiesLimit: CollectionBeforeValidateHook = async ({ data, operation, req }) => {
  if (operation !== 'create') return data

  const existing = await req.payload.count({
    collection: 'activities',
  })

  if (existing.totalDocs >= 8) {
    throw new Error('Puoi creare al massimo 8 attività.')
  }

  return data
}

export const Activities: CollectionConfig<'activities'> = {
  slug: 'activities',
  access: {
    create: adminOnly,
    delete: adminOnly,
    read: () => true,
    update: adminOnly,
  },
  admin: {
    defaultColumns: ['title', 'shortName', 'color', 'order', 'updatedAt'],
    group: 'Content',
    hidden: hideFromNonAdmins,
    useAsTitle: 'title',
  },
  defaultPopulate: {
    cta: true,
    ctaImage: true,
    description: true,
    details: true,
    color: true,
    image: true,
    order: true,
    shortName: true,
    title: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'shortName',
      type: 'text',
      admin: {
        description: 'Short label used by event filter buttons.',
      },
      label: 'Short Name',
      required: true,
    },
    {
      name: 'color',
      type: 'text',
      admin: {
        description:
          'Colore randomico fisso usato dai marker e dalla legenda del calendario eventi. Generato automaticamente.',
        readOnly: true,
      },
      index: true,
      label: 'Colore calendario',
      validate: (value: unknown) =>
        !value || (typeof value === 'string' && /^#[0-9a-fA-F]{6}$/.test(value))
          ? true
          : 'Usa un colore esadecimale, per esempio #32b6a6.',
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'image',
      type: 'upload',
      label: 'Activity image',
      relationTo: 'media',
    },
    {
      name: 'cta',
      type: 'text',
      label: 'CTA label',
    },
    {
      name: 'ctaImage',
      type: 'upload',
      label: 'CTA strip image',
      relationTo: 'media',
    },
    {
      name: 'details',
      type: 'array',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'icon',
          type: 'upload',
          label: 'Icon',
          relationTo: 'media',
        },
        {
          name: 'text',
          type: 'text',
          required: true,
        },
      ],
      labels: {
        plural: 'Small labels',
        singular: 'Small label',
      },
      maxRows: 4,
    },
    {
      name: 'order',
      type: 'number',
      admin: {
        description: 'Lower numbers appear first in automatic activity blocks.',
        step: 1,
      },
      defaultValue: 0,
      index: true,
      label: 'Display order',
      min: 0,
    },
  ],
  hooks: {
    afterChange: [revalidateActivitiesAfterChange],
    afterDelete: [revalidateActivitiesAfterDelete],
    beforeValidate: [assignActivityColor, enforceActivitiesLimit],
  },
  labels: {
    plural: 'Activities',
    singular: 'Activity',
  },
}
