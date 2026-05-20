import type { Field, GlobalConfig } from 'payload'

import {
  typographyFontFamilyOptions,
  typographyFontWeightOptions,
  typographyVerticalScaleOptions,
} from '@/fields/typography'
import { textTransformOptions } from '@/fields/uiOptions'
import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'
import { adminOnly, hideFromNonAdmins } from '@/access/roles'

const socialPlatformOptions = [
  {
    label: 'Facebook',
    value: 'facebook',
  },
  {
    label: 'Instagram',
    value: 'instagram',
  },
  {
    label: 'Email',
    value: 'email',
  },
  {
    label: 'Custom',
    value: 'custom',
  },
] as const

const headerTypographyField = (
  name: string,
  label: string,
  defaults: {
    fontFamily: string
    fontSize: number
    fontWeight: string
    letterSpacing: number
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
          defaultValue: defaults.fontFamily,
          label: 'Font family',
          options: [...typographyFontFamilyOptions],
          admin: {
            width: '25%',
          },
        },
        {
          name: 'fontSize',
          type: 'number',
          defaultValue: defaults.fontSize,
          label: 'Font size (px)',
          min: 6,
          max: 96,
          admin: {
            width: '25%',
          },
        },
        {
          name: 'fontWeight',
          type: 'select',
          defaultValue: defaults.fontWeight,
          label: 'Font weight',
          options: [...typographyFontWeightOptions],
          admin: {
            width: '25%',
          },
        },
        {
          name: 'verticalScale',
          type: 'select',
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
          name: 'letterSpacing',
          type: 'number',
          defaultValue: defaults.letterSpacing,
          label: 'Letter spacing (em)',
          min: 0,
          max: 1,
          admin: {
            step: 0.01,
            width: '33%',
          },
        },
        {
          name: 'lineHeight',
          type: 'number',
          defaultValue: defaults.lineHeight,
          label: 'Line height',
          min: 0.6,
          max: 2,
          admin: {
            step: 0.01,
            width: '33%',
          },
        },
        {
          name: 'textTransform',
          type: 'select',
          defaultValue: defaults.textTransform,
          label: 'Text transform',
          options: [...textTransformOptions],
          admin: {
            width: '34%',
          },
        },
      ],
    },
  ],
})

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
    update: adminOnly,
  },
  admin: {
    hidden: hideFromNonAdmins,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Brand',
          fields: [
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              label: 'Logo mark',
            },
            // {
            //   type: 'row',
            //   fields: [
            //     {
            //       name: 'eyebrow',
            //       type: 'text',
            //       defaultValue: 'ASSOCIAZIONE CULTURALE',
            //       admin: {
            //         width: '50%',
            //       },
            //     },
            //     {
            //       name: 'brandName',
            //       type: 'text',
            //       defaultValue: 'IL SORRISO STORTO',
            //       admin: {
            //         width: '50%',
            //       },
            //     },
            //   ],
            // },
            // {
            //   name: 'tagline',
            //   type: 'text',
            //   defaultValue: 'IDEA. CAOS. ARTE.',
            // },
          ],
        },
        {
          label: 'Navigation',
          fields: [
            {
              name: 'navItems',
              type: 'array',
              fields: [
                link({
                  appearances: false,
                }),
              ],
              maxRows: 8,
              admin: {
                initCollapsed: true,
                components: {
                  RowLabel: '@/Header/RowLabel#RowLabel',
                },
              },
            },
          ],
        },
        {
          label: 'Social',
          fields: [
            {
              name: 'socialItems',
              type: 'array',
              maxRows: 6,
              admin: {
                initCollapsed: true,
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'platform',
                      type: 'select',
                      defaultValue: 'custom',
                      options: [...socialPlatformOptions],
                      required: true,
                      admin: {
                        width: '33%',
                      },
                    },
                    {
                      name: 'label',
                      type: 'text',
                      defaultValue: 'Social',
                      required: true,
                      admin: {
                        width: '33%',
                      },
                    },
                    {
                      name: 'url',
                      type: 'text',
                      required: true,
                      admin: {
                        width: '34%',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Style',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'textColor',
                  type: 'text',
                  defaultValue: '#f4f0dc',
                  admin: {
                    width: '33%',
                  },
                },
                {
                  name: 'accentColor',
                  type: 'text',
                  defaultValue: '#a6bd17',
                  admin: {
                    width: '33%',
                  },
                },
                {
                  name: 'backgroundColor',
                  type: 'text',
                  defaultValue: 'transparent',
                  admin: {
                    width: '34%',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'maxWidth',
                  type: 'number',
                  defaultValue: 1240,
                  min: 320,
                  max: 2200,
                  admin: {
                    width: '33%',
                  },
                },
                {
                  name: 'height',
                  type: 'number',
                  defaultValue: 92,
                  min: 56,
                  max: 180,
                  admin: {
                    width: '33%',
                  },
                },
                {
                  name: 'logoWidth',
                  type: 'number',
                  defaultValue: 82,
                  min: 24,
                  max: 220,
                  admin: {
                    width: '34%',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Typography',
          fields: [
            // headerTypographyField('eyebrowTypography', 'Eyebrow typography', {
            //   fontFamily: 'cinzel',
            //   fontSize: 13,
            //   fontWeight: 'black',
            //   letterSpacing: 0.1,
            //   lineHeight: 0.95,
            //   textTransform: 'uppercase',
            //   verticalScale: 'normal',
            // }),
            // headerTypographyField('brandTypography', 'Brand name typography', {
            //   fontFamily: 'cinzel',
            //   fontSize: 27,
            //   fontWeight: 'black',
            //   letterSpacing: 0.03,
            //   lineHeight: 0.95,
            //   textTransform: 'uppercase',
            //   verticalScale: 'normal',
            // }),
            // headerTypographyField('taglineTypography', 'Tagline typography', {
            //   fontFamily: 'cinzel',
            //   fontSize: 16,
            //   fontWeight: 'black',
            //   letterSpacing: 0.12,
            //   lineHeight: 0.95,
            //   textTransform: 'uppercase',
            //   verticalScale: 'normal',
            // }),
            headerTypographyField('navTypography', 'Navigation typography', {
              fontFamily: 'cinzel',
              fontSize: 14,
              fontWeight: 'black',
              letterSpacing: 0.03,
              lineHeight: 1,
              textTransform: 'uppercase',
              verticalScale: 'normal',
            }),
            headerTypographyField('socialTypography', 'Social icon/text typography', {
              fontFamily: 'sans',
              fontSize: 18,
              fontWeight: 'black',
              letterSpacing: 0,
              lineHeight: 1,
              textTransform: 'normal',
              verticalScale: 'normal',
            }),
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
