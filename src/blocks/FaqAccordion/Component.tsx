import React from 'react'

import type { FaqAccordionBlock as FaqAccordionBlockProps } from '@/payload-types'

import {
  getEventSuiteTextClassName,
  getEventSuiteTextStyle,
  resolveMediaBackground,
} from '@/blocks/EventSuite/shared'
import { ChevronDown } from 'lucide-react'

export const FaqAccordionBlock: React.FC<FaqAccordionBlockProps> = ({
  answerStyle,
  backgroundImage,
  chevronColor = '#84cc16',
  dividerColor = 'rgb(126 88 53 / 0.45)',
  heading = 'Domande frequenti',
  headingStyle,
  iconBackgroundColor = '#8a2d86',
  iconLabel = '?',
  iconTextColor = '#161016',
  items,
  questionStyle,
}) => {
  const faqs = items || []

  return (
    <section className="w-full px-4 md:px-0">
      <div
        className="faq-accordion-panel-frame scribble-border relative isolate mx-auto w-full max-w-3xl overflow-visible"
        style={
          {
            '--faq-chevron-color': chevronColor || '#84cc16',
            '--faq-divider-color': dividerColor || 'rgb(126 88 53 / 0.45)',
          } as React.CSSProperties
        }
      >
        <div
          className="faq-accordion-panel vintage-surface relative isolate overflow-hidden px-6 py-9 md:px-8 md:py-20"
          style={
            {
              backgroundImage: resolveMediaBackground(backgroundImage),
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: backgroundImage ? 'cover' : undefined,
            } as React.CSSProperties
          }
        >
          <div className="relative z-10 flex items-center gap-3">
            <span
              className="faq-accordion-icon inline-flex size-11 shrink-0 items-center justify-center rounded-full"
              style={{
                backgroundColor: iconBackgroundColor || '#8a2d86',
                color: iconTextColor || '#161016',
              }}
            >
              {iconLabel}
            </span>
            <h2
              className={getEventSuiteTextClassName(headingStyle, 'black')}
              style={getEventSuiteTextStyle(headingStyle, {
                fontFamily: 'cinzel',
                fontSizeDesktop: 25,
                fontSizeMobile: 20,
                fontWeight: 'black',
                lineHeight: 1,
              })}
            >
              {heading}
            </h2>
          </div>

          <div className="relative z-10 mt-5 min-w-0">
            {faqs.map((item, index) => (
              <details className="faq-accordion-item group min-w-0" key={item.id || index}>
                <summary className="faq-accordion-summary grid cursor-pointer list-none grid-cols-[minmax(0,1fr)_1rem] items-center gap-4 py-4">
                  <span
                    className={`${getEventSuiteTextClassName(questionStyle, 'black')} min-w-0`}
                    style={getEventSuiteTextStyle(questionStyle, {
                      fontFamily: 'geistSans',
                      fontSizeDesktop: 13,
                      fontSizeMobile: 12,
                      fontWeight: 'black',
                      lineHeight: 1.25,
                    })}
                  >
                    {item.question}
                  </span>
                  <ChevronDown
                    aria-hidden
                    className="faq-accordion-chevron size-4 shrink-0 transition-transform duration-200 group-open:rotate-180"
                  />
                </summary>
                <div className="min-w-0 pb-4 pr-8">
                  <p
                    className={`${getEventSuiteTextClassName(answerStyle, 'regular')} max-w-full`}
                    style={
                      {
                        ...getEventSuiteTextStyle(answerStyle, {
                          fontFamily: 'geistSans',
                          fontSizeDesktop: 13,
                          fontSizeMobile: 12,
                          fontWeight: 'regular',
                          lineHeight: 1.35,
                        }),
                        display: 'block',
                      } as React.CSSProperties
                    }
                  >
                    {item.answer}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
