import type { Block } from 'payload'

import { labelImageField, textStyleField } from '@/blocks/EventSuite/shared'

const requestTypeFields = [
  {
    name: 'label',
    type: 'text',
    required: true,
  },
] as const

export const MembershipApplication: Block = {
  slug: 'membershipApplication',
  dbName: 'member_app',
  interfaceName: 'MembershipApplicationBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: "Domanda di ammissione all'associazione",
      label: 'Heading',
      required: true,
    },
    labelImageField('headingBackgroundImage', 'Heading background image'),
    {
      name: 'introText',
      type: 'textarea',
      defaultValue:
        'Compila la candidatura con i tuoi dati. Ti ricontatteremo dopo averla ricevuta.',
      label: 'Intro text',
    },
    {
      type: 'collapsible',
      label: 'Form labels',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'personalDataTitle',
          type: 'text',
          defaultValue: 'Dati personali',
          required: true,
        },
        {
          name: 'applicationTitle',
          type: 'text',
          defaultValue: 'Candidatura',
          required: true,
        },
        {
          name: 'declarationsTitle',
          type: 'text',
          defaultValue: 'Dichiarazioni',
          required: true,
        },
        {
          type: 'row',
          fields: [
            {
              name: 'firstNameLabel',
              type: 'text',
              defaultValue: 'Nome *',
              required: true,
              admin: {
                width: '50%',
              },
            },
            {
              name: 'lastNameLabel',
              type: 'text',
              defaultValue: 'Cognome *',
              required: true,
              admin: {
                width: '50%',
              },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'birthDateLabel',
              type: 'text',
              defaultValue: 'Data di nascita *',
              required: true,
              admin: {
                width: '50%',
              },
            },
            {
              name: 'birthPlaceLabel',
              type: 'text',
              defaultValue: 'Luogo di nascita *',
              required: true,
              admin: {
                width: '50%',
              },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'fiscalCodeLabel',
              type: 'text',
              defaultValue: 'Codice fiscale *',
              required: true,
              admin: {
                width: '50%',
              },
            },
            {
              name: 'residenceAddressLabel',
              type: 'text',
              defaultValue: 'Indirizzo di residenza *',
              required: true,
              admin: {
                width: '50%',
              },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'emailLabel',
              type: 'text',
              defaultValue: 'Email *',
              required: true,
              admin: {
                width: '50%',
              },
            },
            {
              name: 'phoneLabel',
              type: 'text',
              defaultValue: 'Telefono *',
              required: true,
              admin: {
                width: '50%',
              },
            },
          ],
        },
        {
          name: 'requestTypeLabel',
          type: 'text',
          defaultValue: 'Tipo di richiesta *',
          required: true,
        },
        {
          name: 'motivationLabel',
          type: 'text',
          defaultValue: "Perche vuoi entrare nell'associazione? *",
          required: true,
        },
        {
          name: 'interestAreasLabel',
          type: 'text',
          defaultValue: 'Aree di interesse *',
          required: true,
        },
      ],
    },
    {
      name: 'requestTypes',
      type: 'array',
      defaultValue: [
        { label: 'Domanda di ammissione come socio' },
        { label: 'Candidatura come volontario' },
        { label: 'Proposta di collaborazione' },
      ],
      fields: [...requestTypeFields],
      label: 'Request type options',
      minRows: 1,
    },
    {
      type: 'collapsible',
      label: 'Declaration labels',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'statuteDeclarationLabel',
          type: 'text',
          defaultValue:
            "Dichiaro di aver letto e accettare lo statuto e il regolamento dell'associazione. *",
          required: true,
        },
        {
          name: 'enableStatuteDeclarationTriggerLink',
          type: 'checkbox',
          defaultValue: false,
          label: 'Show statute declaration trigger link',
        },
        {
          name: 'statuteDeclarationTriggerLinkUrl',
          type: 'text',
          label: 'Statute declaration trigger link URL',
          admin: {
            condition: (_, siblingData) => Boolean(siblingData?.enableStatuteDeclarationTriggerLink),
          },
        },
        {
          name: 'purposeDeclarationLabel',
          type: 'text',
          defaultValue: "Dichiaro di condividere le finalita dell'associazione. *",
          required: true,
        },
        {
          name: 'enablePurposeDeclarationTriggerLink',
          type: 'checkbox',
          defaultValue: false,
          label: 'Show purpose declaration trigger link',
        },
        {
          name: 'purposeDeclarationTriggerLinkUrl',
          type: 'text',
          label: 'Purpose declaration trigger link URL',
          admin: {
            condition: (_, siblingData) => Boolean(siblingData?.enablePurposeDeclarationTriggerLink),
          },
        },
        {
          name: 'truthDeclarationLabel',
          type: 'text',
          defaultValue: 'Dichiaro che i dati inseriti sono veritieri. *',
          required: true,
        },
        {
          name: 'enableTruthDeclarationTriggerLink',
          type: 'checkbox',
          defaultValue: false,
          label: 'Show truth declaration trigger link',
        },
        {
          name: 'truthDeclarationTriggerLinkUrl',
          type: 'text',
          label: 'Truth declaration trigger link URL',
          admin: {
            condition: (_, siblingData) => Boolean(siblingData?.enableTruthDeclarationTriggerLink),
          },
        },
        {
          name: 'privacyDeclarationLabel',
          type: 'text',
          defaultValue: "Ho letto l'informativa privacy. *",
          required: true,
        },
        {
          name: 'enablePrivacyTriggerLink',
          type: 'checkbox',
          defaultValue: false,
          label: 'Show privacy trigger link',
        },
        {
          name: 'privacyTriggerLinkUrl',
          type: 'text',
          label: 'Privacy trigger link URL',
          admin: {
            condition: (_, siblingData) => Boolean(siblingData?.enablePrivacyTriggerLink),
          },
        },
      ],
    },
    {
      name: 'submitLabel',
      type: 'text',
      defaultValue: 'Invia candidatura',
      label: 'Submit label',
      required: true,
    },
    labelImageField('submitBackgroundImage', 'Submit background image'),
    {
      name: 'successMessage',
      type: 'text',
      defaultValue: 'Candidatura inviata. Ti ricontatteremo presto.',
      label: 'Success message',
      required: true,
    },
    {
      name: 'errorMessage',
      type: 'text',
      defaultValue: 'Non siamo riusciti a inviare la candidatura. Riprova tra poco.',
      label: 'Error message',
      required: true,
    },
    {
      type: 'collapsible',
      label: 'Images',
      admin: {
        initCollapsed: true,
      },
      fields: [
        labelImageField('backgroundImage', 'Panel background image'),
        labelImageField('decorativeImage', 'Decorative image'),
      ],
    },
    {
      type: 'collapsible',
      label: 'Form behavior',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'emailSubjectPrefix',
          type: 'text',
          defaultValue: 'Nuova candidatura associazione',
          label: 'Email subject prefix',
          required: true,
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Typography',
      admin: {
        initCollapsed: true,
      },
      fields: [
        textStyleField('headingStyle', 'Heading typography', {
          colorTheme: 'primary',
          fontFamily: 'cinzel',
          fontSizeDesktop: 22,
          fontSizeMobile: 18,
          fontWeight: 'black',
          textTransform: 'uppercase',
        }),
        textStyleField('fieldStyle', 'Field typography', {
          colorTheme: 'secondary',
          fontFamily: 'geistSans',
          fontSizeDesktop: 12,
          fontSizeMobile: 11,
          fontWeight: 'regular',
        }),
        textStyleField('submitStyle', 'Submit typography', {
          colorTheme: 'green',
          fontFamily: 'cinzel',
          fontSizeDesktop: 13,
          fontSizeMobile: 12,
          fontWeight: 'black',
          textTransform: 'uppercase',
        }),
      ],
    },
  ],
  labels: {
    plural: 'Membership Application Blocks',
    singular: 'Membership Application Block',
  },
}
