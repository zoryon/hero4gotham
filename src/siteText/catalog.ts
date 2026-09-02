import type { Config, Field, Plugin } from 'payload'

import { siteTextField } from './field'

type SourcePolicy = {
  fields: ReadonlySet<string>
}

const pageFields = new Set([
  'accentText',
  'allEventsLabel',
  'allVenuesLabel',
  'answer',
  'applicationTitle',
  'ariaLabel',
  'birthDateLabel',
  'birthPlaceLabel',
  'body',
  'bottomText',
  'content',
  'cta',
  'ctaAccentLabel',
  'ctaFallbackLabel',
  'ctaLabel',
  'ctaLinkFallbackLabel',
  'ctaText',
  'ctaTitle',
  'dateLabel',
  'declarationsTitle',
  'description',
  'descriptionLinkText',
  'emailLabel',
  'emailPlaceholder',
  'emptyEventsText',
  'emptyEventsTitle',
  'emptyStateLabel',
  'errorMessage',
  'eventLinkFallbackLabel',
  'eventLinkLabel',
  'filterByLabel',
  'firstNameLabel',
  'fiscalCodeLabel',
  'heading',
  'headingBottom',
  'headingTop',
  'iconLabel',
  'interestAreasLabel',
  'introContent',
  'introText',
  'label',
  'lastNameLabel',
  'loadMoreLabel',
  'messagePlaceholder',
  'motivationLabel',
  'namePlaceholder',
  'numberLabel',
  'personalDataTitle',
  'phoneLabel',
  'privacyDeclarationLabel',
  'privacyLabel',
  'purposeDeclarationLabel',
  'question',
  'quote',
  'requestTypeLabel',
  'residenceAddressLabel',
  'richText',
  'searchPlaceholder',
  'statuteDeclarationLabel',
  'subjectPlaceholder',
  'submitLabel',
  'subtitle',
  'successMessage',
  'text',
  'title',
  'topText',
  'truthDeclarationLabel',
  'typeLabel',
  'venueLabel',
  'word',
])

const policies: Record<string, SourcePolicy> = {
  activities: {
    fields: new Set(['cta', 'description', 'shortName', 'text', 'title']),
  },
  categories: {
    fields: new Set(['title']),
  },
  events: {
    fields: new Set([
      'audience',
      'caption',
      'description',
      'firstName',
      'lastName',
      'longDescription',
      'time',
      'title',
      'venue',
      'venueAddress',
    ]),
  },
  footer: {
    fields: new Set(['brandName', 'description', 'eyebrow', 'label', 'legalNote']),
  },
  forms: {
    fields: new Set([
      'buttonLabel',
      'confirmationMessage',
      'description',
      'errorMessage',
      'label',
      'message',
      'placeholder',
      'submitButtonLabel',
      'successMessage',
      'title',
    ]),
  },
  header: {
    fields: new Set(['label']),
  },
  media: {
    fields: new Set(['alt', 'caption']),
  },
  membershipDocuments: {
    fields: new Set(['description', 'title']),
  },
  pages: {
    fields: pageFields,
  },
  posts: {
    fields: new Set(['content', 'description', 'title']),
  },
  privacyPolicy: {
    fields: new Set([
      'content',
      'intro',
      'lastUpdatedLabel',
      'metaDescription',
      'metaTitle',
      'title',
    ]),
  },
  variables: {
    fields: new Set(['value']),
  },
}

const labelText = (label: unknown, fallback: string) =>
  typeof label === 'string' && label.trim() ? label : fallback

const markFields = (fields: Field[], policy: SourcePolicy, section = 'Contenuto'): Field[] =>
  fields.map((field) => {
    if (field.type === 'tabs') {
      return {
        ...field,
        tabs: field.tabs.map((tab) => ({
          ...tab,
          fields: markFields(tab.fields, policy, labelText(tab.label, section)),
        })),
      }
    }

    if (field.type === 'row' || field.type === 'collapsible') {
      return {
        ...field,
        fields: markFields(
          field.fields,
          policy,
          field.type === 'collapsible' ? labelText(field.label, section) : section,
        ),
      }
    }

    if (field.type === 'group' || field.type === 'array') {
      return {
        ...field,
        fields: markFields(field.fields, policy, labelText(field.label, section)),
      }
    }

    if (field.type === 'blocks') {
      return {
        ...field,
        blocks: field.blocks.map((block) => ({
          ...block,
          fields: markFields(
            block.fields,
            policy,
            labelText(block.labels?.singular, labelText(block.labels?.plural, block.slug)),
          ),
        })),
      }
    }

    if (
      'name' in field &&
      typeof field.name === 'string' &&
      (field.type === 'text' || field.type === 'textarea' || field.type === 'richText') &&
      policy.fields.has(field.name)
    ) {
      const label = 'label' in field && typeof field.label === 'string' ? field.label : undefined

      return siteTextField(field, {
        ...(label ? { label } : {}),
        section,
      })
    }

    return field
  })

const applyCatalog = (config: Config): Config => ({
  ...config,
  collections: config.collections?.map((collection) => {
    const policy = policies[collection.slug]
    return policy ? { ...collection, fields: markFields(collection.fields, policy) } : collection
  }),
  globals: config.globals?.map((global) => {
    const policy = policies[global.slug]
    return policy ? { ...global, fields: markFields(global.fields, policy) } : global
  }),
})

export const siteTextCatalogPlugin: Plugin = (config) => applyCatalog(config)
