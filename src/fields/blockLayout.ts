import type { Block, Field } from 'payload'

import { paddingOptions, spacingOptions } from '@/fields/uiOptions'
import { cn } from '@/utilities/ui'

export type BlockLayoutSpacing = 'default' | 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type BlockLayoutPadding = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type BlockLayoutSize = 'default' | 'full' | 'wide' | 'extraWide' | 'container' | 'narrow'

export type BlockLayoutSettings = {
  size?: BlockLayoutSize | null
  marginTop?: BlockLayoutSpacing | null
  marginRight?: BlockLayoutSpacing | null
  marginBottom?: BlockLayoutSpacing | null
  marginLeft?: BlockLayoutSpacing | null
  paddingTop?: BlockLayoutPadding | null
  paddingRight?: BlockLayoutPadding | null
  paddingBottom?: BlockLayoutPadding | null
  paddingLeft?: BlockLayoutPadding | null
  scribbleBorder?: boolean | null
}

export const blockLayoutField = (): Field => ({
  type: 'collapsible',
  label: 'Layout',
  admin: {
    initCollapsed: true,
  },
  fields: [
    {
      name: 'layout',
      type: 'group',
      label: false,
      fields: [
        {
          name: 'size',
          type: 'select',
          dbName: 'sz',
          defaultValue: 'default',
          label: 'Size',
          options: [
            {
              label: 'Default',
              value: 'default',
            },
            {
              label: 'Full width',
              value: 'full',
            },
            {
              label: 'Wide',
              value: 'wide',
            },
            {
              label: 'Extra wide',
              value: 'extraWide',
            },
            {
              label: 'Container',
              value: 'container',
            },
            {
              label: 'Narrow',
              value: 'narrow',
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'marginTop',
              type: 'select',
              dbName: 'mt',
              defaultValue: 'default',
              label: 'Margin top',
              options: [...spacingOptions],
              admin: {
                width: '25%',
              },
            },
            {
              name: 'marginRight',
              type: 'select',
              dbName: 'mr',
              defaultValue: 'default',
              label: 'Margin right',
              options: [...spacingOptions],
              admin: {
                width: '25%',
              },
            },
            {
              name: 'marginBottom',
              type: 'select',
              dbName: 'mb',
              defaultValue: 'default',
              label: 'Margin bottom',
              options: [...spacingOptions],
              admin: {
                width: '25%',
              },
            },
            {
              name: 'marginLeft',
              type: 'select',
              dbName: 'ml',
              defaultValue: 'default',
              label: 'Margin left',
              options: [...spacingOptions],
              admin: {
                width: '25%',
              },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'paddingTop',
              type: 'select',
              dbName: 'pt',
              defaultValue: 'none',
              label: 'Padding top',
              options: [...paddingOptions],
              admin: {
                width: '25%',
              },
            },
            {
              name: 'paddingRight',
              type: 'select',
              dbName: 'pr',
              defaultValue: 'none',
              label: 'Padding right',
              options: [...paddingOptions],
              admin: {
                width: '25%',
              },
            },
            {
              name: 'paddingBottom',
              type: 'select',
              dbName: 'pb',
              defaultValue: 'none',
              label: 'Padding bottom',
              options: [...paddingOptions],
              admin: {
                width: '25%',
              },
            },
            {
              name: 'paddingLeft',
              type: 'select',
              dbName: 'pl',
              defaultValue: 'none',
              label: 'Padding left',
              options: [...paddingOptions],
              admin: {
                width: '25%',
              },
            },
          ],
        },
        {
          name: 'scribbleBorder',
          type: 'checkbox',
          defaultValue: false,
          label: 'Scribble border',
          admin: {
            description: 'Adds the reusable yellow hand-drawn border around this block.',
          },
        },
      ],
    },
  ],
})

export const withBlockLayout = (fields: Field[]): Field[] => [...fields, blockLayoutField()]

export const withBlockLayoutField = <T extends Block>(block: T): T => ({
  ...block,
  fields: withBlockLayout(block.fields || []),
})

export const withBlockLayoutFields = <T extends Block>(blocks: T[]): T[] =>
  blocks.map((block) => withBlockLayoutField(block))

const sizeClasses = {
  container: 'container',
  default: '',
  full: 'w-full',
  narrow: 'mx-auto w-full max-w-3xl px-4 md:px-8',
  extraWide: 'mx-auto w-full max-w-[88rem] px-4 md:px-8',
  wide: 'mx-auto w-full max-w-7xl px-4 md:px-8',
} satisfies Record<BlockLayoutSize, string>

const marginTopClasses = {
  default: '',
  lg: 'mt-20',
  md: 'mt-16',
  none: 'mt-0',
  sm: 'mt-10',
  xl: 'mt-28',
  xs: 'mt-6',
} satisfies Record<BlockLayoutSpacing, string>

const marginRightClasses = {
  default: '',
  lg: 'mr-20',
  md: 'mr-16',
  none: 'mr-0',
  sm: 'mr-10',
  xl: 'mr-28',
  xs: 'mr-6',
} satisfies Record<BlockLayoutSpacing, string>

const marginBottomClasses = {
  default: '',
  lg: 'mb-20',
  md: 'mb-16',
  none: 'mb-0',
  sm: 'mb-10',
  xl: 'mb-28',
  xs: 'mb-6',
} satisfies Record<BlockLayoutSpacing, string>

const marginLeftClasses = {
  default: '',
  lg: 'ml-20',
  md: 'ml-16',
  none: 'ml-0',
  sm: 'ml-10',
  xl: 'ml-28',
  xs: 'ml-6',
} satisfies Record<BlockLayoutSpacing, string>

const paddingTopClasses = {
  lg: 'pt-20',
  md: 'pt-16',
  none: 'pt-0',
  sm: 'pt-10',
  xl: 'pt-28',
  xs: 'pt-6',
} satisfies Record<BlockLayoutPadding, string>

const paddingRightClasses = {
  lg: 'pr-20',
  md: 'pr-16',
  none: 'pr-0',
  sm: 'pr-10',
  xl: 'pr-28',
  xs: 'pr-6',
} satisfies Record<BlockLayoutPadding, string>

const paddingBottomClasses = {
  lg: 'pb-20',
  md: 'pb-16',
  none: 'pb-0',
  sm: 'pb-10',
  xl: 'pb-28',
  xs: 'pb-6',
} satisfies Record<BlockLayoutPadding, string>

const paddingLeftClasses = {
  lg: 'pl-20',
  md: 'pl-16',
  none: 'pl-0',
  sm: 'pl-10',
  xl: 'pl-28',
  xs: 'pl-6',
} satisfies Record<BlockLayoutPadding, string>

export const getBlockLayoutClasses = (
  layout?: BlockLayoutSettings | null,
  fallbackClassName?: string,
) => {
  if (!layout) return fallbackClassName

  return cn(
    fallbackClassName,
    layout.size ? sizeClasses[layout.size] : undefined,
    layout.marginTop === 'default' ? undefined : marginTopClasses[layout.marginTop || 'default'],
    layout.marginRight === 'default'
      ? undefined
      : marginRightClasses[layout.marginRight || 'default'],
    layout.marginBottom === 'default'
      ? undefined
      : marginBottomClasses[layout.marginBottom || 'default'],
    layout.marginLeft === 'default' ? undefined : marginLeftClasses[layout.marginLeft || 'default'],
    paddingTopClasses[layout.paddingTop || 'none'],
    paddingRightClasses[layout.paddingRight || 'none'],
    paddingBottomClasses[layout.paddingBottom || 'none'],
    paddingLeftClasses[layout.paddingLeft || 'none'],
    layout.scribbleBorder && 'scribble-border',
  )
}

export const stripBlockSpacing = (
  layout?: BlockLayoutSettings | null,
): BlockLayoutSettings | null => {
  return {
    ...(layout || {}),
    marginBottom: 'none',
    marginLeft: 'none',
    marginRight: 'none',
    marginTop: 'none',
    paddingBottom: 'none',
    paddingLeft: 'none',
    paddingRight: 'none',
    paddingTop: 'none',
    scribbleBorder: false,
  }
}
