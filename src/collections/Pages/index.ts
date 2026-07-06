import type { CollectionConfig } from 'payload'

import { adminOnly, hideFromNonAdmins } from '@/access/roles'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { ActivitiesDetailGrid } from '../../blocks/ActivitiesDetailGrid/config'
import { ActivityChoiceCta } from '../../blocks/ActivityChoiceCta/config'
import { Archive } from '../../blocks/ArchiveBlock/config'
import { Arrow } from '../../blocks/Arrow/config'
import { CallToAction } from '../../blocks/CallToAction/config'
import { ContactMessage } from '@/blocks/ContactMessage/config'
import { Content } from '../../blocks/Content/config'
import { EventCalendar } from '../../blocks/EventSuite/EventCalendar/config'
import { EventFilters } from '../../blocks/EventFilters/config'
import { EventGallery } from '../../blocks/EventGallery/config'
import { EventList } from '../../blocks/EventSuite/EventList/config'
import { EventProposalCta } from '@/blocks/EventProposalCta/config'
import { FaqAccordion } from '@/blocks/FaqAccordion/config'
import { FeaturedEvent } from '../../blocks/EventSuite/FeaturedEvent/config'
import { FeatureGrid } from '../../blocks/FeatureGrid/config'
import { Flexbox } from '../../blocks/Flexbox/config'
import { FormBlock } from '../../blocks/Form/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { MembershipApplication } from '@/blocks/MembershipApplication/config'
import { PhotoGalleryStrip } from '@/blocks/PhotoGalleryStrip/config'
import { ProcessSteps } from '@/blocks/ProcessSteps/config'
import { QuoteBanner } from '../../blocks/QuoteBanner/config'
import { SocialFollowCta } from '@/blocks/SocialFollowCta/config'
import { Subtitle } from '../../blocks/Subtitle/config'
import { TextBackdrop } from '../../blocks/TextBackdrop/config'
import { Title } from '../../blocks/Title/config'
import { TornCards } from '../../blocks/TornCards/config'
import { ThreePanelShowcase } from '../../blocks/ThreePanelShowcase/config'
import { UpcomingEvents } from '../../blocks/UpcomingEvents/config'
import { UpcomingEventsCta } from '@/blocks/UpcomingEventsCta/config'
import { withBlockLayoutFields } from '@/fields/blockLayout'
import { hero } from '@/heros/config'
import { slugField } from 'payload'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { revalidateDelete, revalidatePage } from './hooks/revalidatePage'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

export const Pages: CollectionConfig<'pages'> = {
  slug: 'pages',
  access: {
    create: adminOnly,
    delete: adminOnly,
    read: authenticatedOrPublished,
    update: adminOnly,
  },
  // This config controls what's populated by default when a page is referenced
  // https://payloadcms.com/docs/queries/select#defaultpopulate-collection-config-property
  // Type safe if the collection slug generic is passed to `CollectionConfig` - `CollectionConfig<'pages'>
  defaultPopulate: {
    title: true,
    slug: true,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    hidden: hideFromNonAdmins,
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'pages',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'pages',
        req,
      }),
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [hero],
          label: 'Hero',
        },
        {
          label: 'Background',
          fields: [
            {
              name: 'backgroundImage',
              type: 'upload',
              label: 'Desktop background image',
              relationTo: 'media',
            },
            {
              name: 'bgTab',
              type: 'upload',
              label: 'Tablet background image',
              relationTo: 'media',
              admin: {
                description: 'Optional. Falls back to the desktop image if empty.',
              },
            },
            {
              name: 'bgMob',
              type: 'upload',
              label: 'Mobile background image',
              relationTo: 'media',
              admin: {
                description: 'Optional. Falls back to the tablet or desktop image if empty.',
              },
            },
            {
              type: 'collapsible',
              label: 'Background image rendering',
              admin: {
                initCollapsed: true,
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'imageQuality',
                      type: 'number',
                      defaultValue: 95,
                      label: 'Image quality',
                      min: 75,
                      max: 100,
                      admin: {
                        description:
                          'Higher values reduce compression artifacts. Use 95-100 for full-screen textured backgrounds.',
                        step: 1,
                        width: '25%',
                      },
                    },
                    {
                      name: 'imagePositionMobile',
                      type: 'select',
                      defaultValue: 'center',
                      label: 'Mobile position',
                      options: [
                        { label: 'Center', value: 'center' },
                        { label: 'Top', value: 'top' },
                        { label: 'Bottom', value: 'bottom' },
                        { label: 'Left', value: 'left' },
                        { label: 'Right', value: 'right' },
                        { label: 'Top left', value: 'topLeft' },
                        { label: 'Top right', value: 'topRight' },
                        { label: 'Bottom left', value: 'bottomLeft' },
                        { label: 'Bottom right', value: 'bottomRight' },
                      ],
                      admin: {
                        width: '25%',
                      },
                    },
                    {
                      name: 'imagePositionTablet',
                      type: 'select',
                      defaultValue: 'center',
                      label: 'Tablet position',
                      options: [
                        { label: 'Center', value: 'center' },
                        { label: 'Top', value: 'top' },
                        { label: 'Bottom', value: 'bottom' },
                        { label: 'Left', value: 'left' },
                        { label: 'Right', value: 'right' },
                        { label: 'Top left', value: 'topLeft' },
                        { label: 'Top right', value: 'topRight' },
                        { label: 'Bottom left', value: 'bottomLeft' },
                        { label: 'Bottom right', value: 'bottomRight' },
                      ],
                      admin: {
                        width: '25%',
                      },
                    },
                    {
                      name: 'imagePositionDesktop',
                      type: 'select',
                      defaultValue: 'center',
                      label: 'Desktop position',
                      options: [
                        { label: 'Center', value: 'center' },
                        { label: 'Top', value: 'top' },
                        { label: 'Bottom', value: 'bottom' },
                        { label: 'Left', value: 'left' },
                        { label: 'Right', value: 'right' },
                        { label: 'Top left', value: 'topLeft' },
                        { label: 'Top right', value: 'topRight' },
                        { label: 'Bottom left', value: 'bottomLeft' },
                        { label: 'Bottom right', value: 'bottomRight' },
                      ],
                      admin: {
                        width: '25%',
                      },
                    },
                  ],
                },
              ],
            },
            {
              name: 'overlay',
              type: 'select',
              defaultValue: 'medium',
              options: [
                { label: 'None', value: 'none' },
                { label: 'Light', value: 'light' },
                { label: 'Medium', value: 'medium' },
                { label: 'Strong', value: 'strong' },
              ],
            },
            {
              name: 'width',
              type: 'select',
              defaultValue: 'full',
              options: [
                { label: 'Full width', value: 'full' },
                { label: 'Contained', value: 'contained' },
              ],
            },
            {
              name: 'padding',
              type: 'select',
              defaultValue: 'medium',
              options: [
                { label: 'Small', value: 'small' },
                { label: 'Medium', value: 'medium' },
                { label: 'Large', value: 'large' },
              ],
            },
          ],
        },
        {
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              blocks: withBlockLayoutFields([
                ActivitiesDetailGrid,
                ActivityChoiceCta,
                Arrow,
                CallToAction,
                ContactMessage,
                Content,
                EventCalendar,
                EventFilters,
                EventGallery,
                EventList,
                EventProposalCta,
                FaqAccordion,
                FeaturedEvent,
                Title,
                Subtitle,
                TextBackdrop,
                Flexbox,
                FeatureGrid,
                ThreePanelShowcase,
                QuoteBanner,
                SocialFollowCta,
                TornCards,
                UpcomingEvents,
                UpcomingEventsCta,
                PhotoGalleryStrip,
                MediaBlock,
                MembershipApplication,
                ProcessSteps,
                Archive,
                FormBlock,
              ]),
              required: true,
              admin: {
                components: {
                  beforeInput: ['@/components/BlockClipboardControls#BlockClipboardControls'],
                },
                initCollapsed: true,
              },
            },
          ],
          label: 'Content',
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),

            MetaDescriptionField({}),
            PreviewField({
              // if the `generateUrl` function is configured
              hasGenerateFn: true,

              // field paths to match the target field for data
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    slugField(),
  ],
  hooks: {
    afterChange: [revalidatePage],
    beforeChange: [populatePublishedAt],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100, // We set this interval for optimal live preview
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
