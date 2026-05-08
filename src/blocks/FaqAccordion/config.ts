import type { Block } from 'payload'

import { labelImageField, textStyleField } from '@/blocks/EventSuite/shared'

export const FaqAccordion: Block = {
  slug: 'faqAccordion',
  dbName: 'faq_accordion',
  interfaceName: 'FaqAccordionBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Domande frequenti',
      label: 'Heading',
      required: true,
    },
    {
      name: 'iconLabel',
      type: 'text',
      defaultValue: '?',
      label: 'Icon label',
      required: true,
    },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      defaultValue: [
        {
          answer:
            'Puoi partecipare prenotando una delle attivita in programma o contattandoci per ricevere maggiori informazioni.',
          question: 'Come posso partecipare alle attivita?',
        },
        {
          answer:
            'Si. Raccontaci la tua idea e valuteremo insieme come trasformarla in una proposta concreta.',
          question: "Posso proporre un progetto o un'idea?",
        },
        {
          answer:
            'Le attivita sono pensate per accogliere pubblici diversi. Eventuali requisiti specifici vengono indicati nella scheda evento.',
          question: 'Le attivita sono adatte a tutti?',
        },
        {
          answer:
            'Scrivici dal modulo contatti: ti risponderemo con le possibilita aperte e i prossimi passi.',
          question: 'Come posso diventare volontario?',
        },
      ],
      fields: [
        {
          name: 'question',
          type: 'text',
          required: true,
        },
        {
          name: 'answer',
          type: 'textarea',
          required: true,
        },
      ],
      labels: {
        plural: 'FAQ items',
        singular: 'FAQ item',
      },
    },
    {
      type: 'collapsible',
      label: 'Images',
      admin: {
        initCollapsed: true,
      },
      fields: [labelImageField('backgroundImage', 'Panel background image')],
    },
    {
      type: 'collapsible',
      label: 'Colors',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'iconBackgroundColor',
              type: 'text',
              defaultValue: '#8a2d86',
              label: 'Icon background',
            },
            {
              name: 'iconTextColor',
              type: 'text',
              defaultValue: '#161016',
              label: 'Icon text color',
            },
            {
              name: 'dividerColor',
              type: 'text',
              defaultValue: 'rgb(126 88 53 / 0.45)',
              label: 'Divider color',
            },
            {
              name: 'chevronColor',
              type: 'text',
              defaultValue: '#84cc16',
              label: 'Chevron color',
            },
          ],
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
          colorTheme: 'purple',
          fontFamily: 'cinzel',
          fontSizeDesktop: 25,
          fontSizeMobile: 20,
          fontWeight: 'black',
          textTransform: 'uppercase',
        }),
        textStyleField('questionStyle', 'Question typography', {
          colorTheme: 'secondary',
          fontFamily: 'geistSans',
          fontSizeDesktop: 13,
          fontSizeMobile: 12,
          fontWeight: 'black',
        }),
        textStyleField('answerStyle', 'Answer typography', {
          colorTheme: 'secondary',
          fontFamily: 'geistSans',
          fontSizeDesktop: 13,
          fontSizeMobile: 12,
          fontWeight: 'regular',
        }),
      ],
    },
  ],
  labels: {
    plural: 'FAQ Accordions',
    singular: 'FAQ Accordion',
  },
}
