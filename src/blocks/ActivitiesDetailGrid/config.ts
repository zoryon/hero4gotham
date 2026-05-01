import type { Block, Field } from 'payload'

import {
  typographyFontFamilyOptions,
  typographyFontWeightOptions,
  typographyLetterSpacingOptions,
  typographyVerticalScaleOptions,
} from '@/fields/typography'
import { textTransformOptions } from '@/fields/uiOptions'

const textStyleFields = (
  name: string,
  label: string,
  defaults: {
    color: string
    fontFamily: string
    fontSizeDesktop: number
    fontSizeMobile: number
    fontStyle: string
    fontWeight: string
    letterSpacing: string
    lineHeight: number
    textTransform: string
    verticalScale: string
  },
): Field => ({
  name,
  type: 'group',
  label,
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'fontFamily',
          type: 'select',
          dbName: 'ff',
          defaultValue: defaults.fontFamily,
          label: 'Font family',
          options: [...typographyFontFamilyOptions],
          admin: {
            width: '25%',
          },
        },
        {
          name: 'fontWeight',
          type: 'select',
          dbName: 'fw',
          defaultValue: defaults.fontWeight,
          label: 'Font weight',
          options: [...typographyFontWeightOptions],
          admin: {
            width: '25%',
          },
        },
        {
          name: 'fontStyle',
          type: 'select',
          dbName: 'fst',
          defaultValue: defaults.fontStyle,
          label: 'Font style',
          options: [
            {
              label: 'Normal',
              value: 'normal',
            },
            {
              label: 'Italic',
              value: 'italic',
            },
          ],
          admin: {
            width: '25%',
          },
        },
        {
          name: 'verticalScale',
          type: 'select',
          dbName: 'vs',
          defaultValue: defaults.verticalScale,
          label: 'Height stretch',
          options: [...typographyVerticalScaleOptions],
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
          name: 'fontSizeMobile',
          type: 'number',
          defaultValue: defaults.fontSizeMobile,
          label: 'Mobile size (px)',
          min: 8,
          max: 180,
          admin: {
            step: 1,
            width: '25%',
          },
        },
        {
          name: 'fontSizeDesktop',
          type: 'number',
          defaultValue: defaults.fontSizeDesktop,
          label: 'Desktop size (px)',
          min: 8,
          max: 220,
          admin: {
            step: 1,
            width: '25%',
          },
        },
        {
          name: 'lineHeight',
          type: 'number',
          defaultValue: defaults.lineHeight,
          label: 'Line height',
          min: 0.6,
          max: 3,
          admin: {
            step: 0.01,
            width: '25%',
          },
        },
        {
          name: 'letterSpacing',
          type: 'select',
          dbName: 'ls',
          defaultValue: defaults.letterSpacing,
          label: 'Letter spacing',
          options: [...typographyLetterSpacingOptions],
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
          name: 'textTransform',
          type: 'select',
          dbName: 'tt',
          defaultValue: defaults.textTransform,
          label: 'Text transform',
          options: [...textTransformOptions],
          admin: {
            width: '33%',
          },
        },
        {
          name: 'color',
          type: 'text',
          defaultValue: defaults.color,
          label: 'Text color',
          admin: {
            description: 'CSS color, e.g. #90a434, white, or rgba(255,255,255,0.85).',
            width: '34%',
          },
        },
        {
          name: 'maxWidth',
          type: 'number',
          defaultValue: 520,
          label: 'Max width (px)',
          min: 120,
          max: 1400,
          admin: {
            step: 1,
            width: '33%',
          },
        },
      ],
    },
  ],
})

const breakpointFields = (
  name: string,
  label: string,
  defaults: {
    columns: number
    rows: number
  },
): Field => ({
  name,
  type: 'group',
  label,
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'columns',
          type: 'number',
          admin: {
            step: 1,
            width: '50%',
          },
          defaultValue: defaults.columns,
          label: 'Columns',
          max: 8,
          min: 1,
          required: true,
        },
        {
          name: 'rows',
          type: 'number',
          admin: {
            step: 1,
            width: '50%',
          },
          defaultValue: defaults.rows,
          label: 'Rows',
          max: 12,
          min: 1,
          required: true,
        },
      ],
    },
  ],
})

const imagePositionOptions = [
  {
    label: 'Left',
    value: 'left',
  },
  {
    label: 'Right',
    value: 'right',
  },
  {
    label: 'Top',
    value: 'top',
  },
  {
    label: 'Bottom',
    value: 'bottom',
  },
]

export const ActivitiesDetailGrid: Block = {
  slug: 'activitiesDetailGrid',
  dbName: 'act_detail_grid',
  interfaceName: 'ActivitiesDetailGridBlock',
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Heading',
          fields: [
            {
              name: 'heading',
              type: 'text',
              defaultValue: 'Le nostre attività nel dettaglio',
              label: 'Heading text',
            },
            {
              name: 'headingBannerImage',
              type: 'upload',
              label: 'Heading banner image',
              relationTo: 'media',
            },
            {
              name: 'headingPaddingX',
              type: 'number',
              defaultValue: 34,
              label: 'Heading horizontal padding (px)',
              min: 0,
              max: 240,
              admin: {
                step: 1,
              },
            },
            {
              name: 'headingPaddingY',
              type: 'number',
              defaultValue: 8,
              label: 'Heading vertical padding (px)',
              min: 0,
              max: 120,
              admin: {
                step: 1,
              },
            },
            textStyleFields('headingStyle', 'Heading typography', {
              color: '#1b1b1b',
              fontFamily: 'cinzel',
              fontSizeDesktop: 22,
              fontSizeMobile: 16,
              fontStyle: 'normal',
              fontWeight: 'black',
              letterSpacing: 'wide',
              lineHeight: 1,
              textTransform: 'uppercase',
              verticalScale: 'normal',
            }),
          ],
        },
        {
          label: 'Activities',
          fields: [
            {
              name: 'source',
              type: 'radio',
              defaultValue: 'automatic',
              label: 'Activities source',
              options: [
                {
                  label: 'Automatic from Activities collection',
                  value: 'automatic',
                },
                {
                  label: 'Manual activities in this block',
                  value: 'manual',
                },
              ],
            },
            {
              name: 'activities',
              type: 'array',
              dbName: 'adg_acts',
              admin: {
                condition: (_, siblingData) => siblingData?.source === 'manual',
                initCollapsed: true,
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'image',
                      type: 'upload',
                      label: 'Activity image',
                      relationTo: 'media',
                      admin: {
                        width: '50%',
                      },
                    },
                    {
                      name: 'imagePosition',
                      type: 'select',
                      dbName: 'img_pos',
                      defaultValue: 'left',
                      label: 'Image position',
                      options: imagePositionOptions,
                      admin: {
                        width: '25%',
                      },
                    },
                    {
                      name: 'imageSize',
                      type: 'number',
                      defaultValue: 46,
                      label: 'Image area (%)',
                      min: 20,
                      max: 80,
                      admin: {
                        step: 1,
                        width: '25%',
                      },
                    },
                  ],
                },
                {
                  name: 'title',
                  type: 'text',
                  label: 'Title',
                  required: true,
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Description',
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
                  name: 'border',
                  type: 'checkbox',
                  defaultValue: false,
                  label: 'Scribble border',
                  admin: {
                    description: 'Adds the reusable vintage border to this single activity.',
                  },
                },
                {
                  name: 'details',
                  type: 'array',
                  dbName: 'adg_details',
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
                      label: 'Text',
                      required: true,
                    },
                  ],
                  labels: {
                    plural: 'Small labels',
                    singular: 'Small label',
                  },
                },
                {
                  type: 'collapsible',
                  label: 'Typography',
                  admin: {
                    initCollapsed: true,
                  },
                  fields: [
                    textStyleFields('titleStyle', 'Title typography', {
                      color: '#90a434',
                      fontFamily: 'cinzel',
                      fontSizeDesktop: 18,
                      fontSizeMobile: 16,
                      fontStyle: 'normal',
                      fontWeight: 'black',
                      letterSpacing: 'normal',
                      lineHeight: 1,
                      textTransform: 'uppercase',
                      verticalScale: 'normal',
                    }),
                    textStyleFields('descriptionStyle', 'Description typography', {
                      color: '#f7f0df',
                      fontFamily: 'geistSans',
                      fontSizeDesktop: 12,
                      fontSizeMobile: 12,
                      fontStyle: 'normal',
                      fontWeight: 'regular',
                      letterSpacing: 'tight',
                      lineHeight: 1.35,
                      textTransform: 'normal',
                      verticalScale: 'normal',
                    }),
                    textStyleFields('detailStyle', 'Small labels typography', {
                      color: '#d9d0c2',
                      fontFamily: 'geistSans',
                      fontSizeDesktop: 9,
                      fontSizeMobile: 9,
                      fontStyle: 'normal',
                      fontWeight: 'bold',
                      letterSpacing: 'tight',
                      lineHeight: 1.1,
                      textTransform: 'uppercase',
                      verticalScale: 'normal',
                    }),
                    textStyleFields('ctaStyle', 'CTA typography', {
                      color: '#f7f0df',
                      fontFamily: 'cinzel',
                      fontSizeDesktop: 10,
                      fontSizeMobile: 10,
                      fontStyle: 'normal',
                      fontWeight: 'black',
                      letterSpacing: 'tight',
                      lineHeight: 1,
                      textTransform: 'uppercase',
                      verticalScale: 'normal',
                    }),
                  ],
                },
              ],
              labels: {
                plural: 'Activities',
                singular: 'Activity',
              },
              minRows: 1,
              required: true,
            },
          ],
        },
        {
          label: 'Responsive',
          fields: [
            {
              name: 'responsive',
              type: 'group',
              label: false,
              fields: [
                breakpointFields('mobile', 'Mobile', {
                  columns: 1,
                  rows: 8,
                }),
                breakpointFields('tablet', 'Tablet', {
                  columns: 1,
                  rows: 8,
                }),
                breakpointFields('laptop', 'Laptop', {
                  columns: 2,
                  rows: 4,
                }),
                breakpointFields('desktop', 'Desktop', {
                  columns: 2,
                  rows: 4,
                }),
              ],
            },
          ],
        },
        {
          label: 'Style',
          fields: [
            {
              name: 'containerWidth',
              type: 'select',
              defaultValue: 'wide',
              label: 'Width',
              options: [
                {
                  label: 'Full width',
                  value: 'full',
                },
                {
                  label: 'Contained',
                  value: 'contained',
                },
                {
                  label: 'Wide',
                  value: 'wide',
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'automaticImagePosition',
                  type: 'select',
                  defaultValue: 'left',
                  label: 'Automatic image position',
                  options: imagePositionOptions,
                  admin: {
                    width: '25%',
                  },
                },
                {
                  name: 'automaticImageSize',
                  type: 'number',
                  defaultValue: 46,
                  label: 'Automatic image area (%)',
                  min: 20,
                  max: 80,
                  admin: {
                    step: 1,
                    width: '25%',
                  },
                },
                {
                  name: 'automaticBorder',
                  type: 'checkbox',
                  defaultValue: false,
                  label: 'Automatic cards scribble border',
                  admin: {
                    width: '25%',
                  },
                },
                {
                  name: 'automaticLimit',
                  type: 'number',
                  defaultValue: 8,
                  label: 'Automatic limit',
                  min: 1,
                  max: 8,
                  admin: {
                    description: 'Caps automatic fetches. The collection itself is also limited to 8.',
                    step: 1,
                    width: '25%',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'cellMinHeight',
                  type: 'number',
                  defaultValue: 240,
                  label: 'Cell minimum height (px)',
                  min: 0,
                  max: 600,
                  admin: {
                    step: 1,
                    width: '25%',
                  },
                },
                {
                  name: 'contentPadding',
                  type: 'number',
                  defaultValue: 22,
                  label: 'Content padding (px)',
                  min: 0,
                  max: 120,
                  admin: {
                    step: 1,
                    width: '25%',
                  },
                },
                {
                  name: 'imageFadeSize',
                  type: 'number',
                  defaultValue: 44,
                  label: 'Image fade size (px)',
                  min: 0,
                  max: 220,
                  admin: {
                    description:
                      'Creates the soft blend where image and content meet. No background color is added.',
                    step: 1,
                    width: '25%',
                  },
                },
                {
                  name: 'gridGap',
                  type: 'number',
                  defaultValue: 0,
                  label: 'Grid gap (px)',
                  min: 0,
                  max: 80,
                  admin: {
                    step: 1,
                    width: '25%',
                  },
                },
              ],
            },
            {
              type: 'collapsible',
              label: 'Automatic/manual shared typography',
              admin: {
                initCollapsed: true,
              },
              fields: [
                textStyleFields('titleStyle', 'Title typography', {
                  color: '#90a434',
                  fontFamily: 'cinzel',
                  fontSizeDesktop: 18,
                  fontSizeMobile: 16,
                  fontStyle: 'normal',
                  fontWeight: 'black',
                  letterSpacing: 'normal',
                  lineHeight: 1,
                  textTransform: 'uppercase',
                  verticalScale: 'normal',
                }),
                textStyleFields('descriptionStyle', 'Description typography', {
                  color: '#f7f0df',
                  fontFamily: 'geistSans',
                  fontSizeDesktop: 12,
                  fontSizeMobile: 12,
                  fontStyle: 'normal',
                  fontWeight: 'regular',
                  letterSpacing: 'tight',
                  lineHeight: 1.35,
                  textTransform: 'normal',
                  verticalScale: 'normal',
                }),
                textStyleFields('detailStyle', 'Small labels typography', {
                  color: '#d9d0c2',
                  fontFamily: 'geistSans',
                  fontSizeDesktop: 9,
                  fontSizeMobile: 9,
                  fontStyle: 'normal',
                  fontWeight: 'bold',
                  letterSpacing: 'tight',
                  lineHeight: 1.1,
                  textTransform: 'uppercase',
                  verticalScale: 'normal',
                }),
                textStyleFields('ctaStyle', 'CTA typography', {
                  color: '#f7f0df',
                  fontFamily: 'cinzel',
                  fontSizeDesktop: 10,
                  fontSizeMobile: 10,
                  fontStyle: 'normal',
                  fontWeight: 'black',
                  letterSpacing: 'tight',
                  lineHeight: 1,
                  textTransform: 'uppercase',
                  verticalScale: 'normal',
                }),
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'panelBg',
                  type: 'text',
                  label: 'Optional content background color',
                  admin: {
                    description:
                      'Leave empty for transparent. Use this only if you want the purple/dark panel color later.',
                    width: '50%',
                  },
                },
                {
                  name: 'dividerColor',
                  type: 'text',
                  label: 'Optional divider color',
                  admin: {
                    description: 'Leave empty for no hard-coded divider color.',
                    width: '50%',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  labels: {
    plural: 'Activities Detail Grids',
    singular: 'Activities Detail Grid',
  },
}
