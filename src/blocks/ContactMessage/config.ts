import type { Block } from 'payload'

import { labelImageField, textStyleField } from '@/blocks/EventSuite/shared'

export const ContactMessage: Block = {
  slug: 'contactMessage',
  dbName: 'contact_msg',
  interfaceName: 'ContactMessageBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Invia un messaggio',
      label: 'Heading',
      required: true,
    },
    labelImageField('headingBackgroundImage', 'Heading background image'),
    {
      name: 'introText',
      type: 'textarea',
      defaultValue: 'Compila il modulo e raccontaci il tuo caos. Ti risponderemo al piu presto.',
      label: 'Intro text',
    },
    {
      name: 'namePlaceholder',
      type: 'text',
      defaultValue: 'Nome e Cognome',
      label: 'Name placeholder',
      required: true,
    },
    {
      name: 'emailPlaceholder',
      type: 'text',
      defaultValue: 'Email',
      label: 'Email placeholder',
      required: true,
    },
    {
      name: 'subjectPlaceholder',
      type: 'text',
      defaultValue: 'Oggetto',
      label: 'Subject placeholder',
      required: true,
    },
    {
      name: 'messagePlaceholder',
      type: 'text',
      defaultValue: 'Messaggio',
      label: 'Message placeholder',
      required: true,
    },
    {
      name: 'privacyLabel',
      type: 'text',
      defaultValue: "Ho letto l'informativa sulla privacy e acconsento al trattamento dei dati.",
      label: 'Privacy label',
      required: true,
    },
    {
      name: 'submitLabel',
      type: 'text',
      defaultValue: 'Invia messaggio',
      label: 'Submit label',
      required: true,
    },
    labelImageField('submitBackgroundImage', 'Submit background image'),
    {
      name: 'successMessage',
      type: 'text',
      defaultValue: 'Messaggio inviato. Ti risponderemo presto.',
      label: 'Success message',
      required: true,
    },
    {
      name: 'errorMessage',
      type: 'text',
      defaultValue: 'Non siamo riusciti a inviare il messaggio. Riprova tra poco.',
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
          defaultValue: 'Nuovo messaggio dal sito',
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
        textStyleField('introStyle', 'Intro typography', {
          colorTheme: 'secondary',
          fontFamily: 'geistSans',
          fontSizeDesktop: 13,
          fontSizeMobile: 12,
          fontWeight: 'regular',
        }),
        textStyleField('fieldStyle', 'Field typography', {
          colorTheme: 'secondary',
          fontFamily: 'geistSans',
          fontSizeDesktop: 12,
          fontSizeMobile: 11,
          fontWeight: 'regular',
        }),
        textStyleField('privacyStyle', 'Privacy typography', {
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
        textStyleField('statusStyle', 'Status typography', {
          colorTheme: 'green',
          fontFamily: 'geistSans',
          fontSizeDesktop: 13,
          fontSizeMobile: 12,
          fontWeight: 'semibold',
        }),
      ],
    },
  ],
  labels: {
    plural: 'Contact Message Blocks',
    singular: 'Contact Message Block',
  },
}
