'use client'

import React, { useState } from 'react'

import type { EventSuiteMedia, EventSuiteTextStyle } from '@/blocks/EventSuite/shared'

import {
  getEventSuiteTextClassName,
  getEventSuiteTextStyle,
  resolveMediaBackground,
} from '@/blocks/EventSuite/shared'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

type Props = {
  backgroundImage?: EventSuiteMedia | number | null
  decorativeImage?: EventSuiteMedia | number | null
  emailPlaceholder?: null | string
  emailSubjectPrefix?: null | string
  errorMessage?: null | string
  fieldStyle?: EventSuiteTextStyle | null
  heading?: null | string
  headingBackgroundImage?: EventSuiteMedia | number | null
  headingStyle?: EventSuiteTextStyle | null
  introStyle?: EventSuiteTextStyle | null
  introText?: null | string
  messagePlaceholder?: null | string
  namePlaceholder?: null | string
  privacyLabel?: null | string
  privacyStyle?: EventSuiteTextStyle | null
  statusStyle?: EventSuiteTextStyle | null
  subjectPlaceholder?: null | string
  submitBackgroundImage?: EventSuiteMedia | number | null
  submitLabel?: null | string
  submitStyle?: EventSuiteTextStyle | null
  successMessage?: null | string
}

type SubmitState = 'error' | 'idle' | 'sending' | 'success'

const initialFormState = {
  email: '',
  message: '',
  name: '',
  privacy: false,
  subject: '',
  website: '',
}

export const ContactMessageBlock: React.FC<Props> = ({
  backgroundImage,
  decorativeImage,
  emailPlaceholder = 'Email',
  emailSubjectPrefix = 'Nuovo messaggio dal sito',
  errorMessage = 'Non siamo riusciti a inviare il messaggio. Riprova tra poco.',
  fieldStyle,
  heading = 'Invia un messaggio',
  headingBackgroundImage,
  headingStyle,
  introStyle,
  introText = 'Compila il modulo e raccontaci il tuo caos. Ti risponderemo al piu presto.',
  messagePlaceholder = 'Messaggio',
  namePlaceholder = 'Nome e Cognome',
  privacyLabel = "Ho letto l'informativa sulla privacy e acconsento al trattamento dei dati.",
  privacyStyle,
  statusStyle,
  subjectPlaceholder = 'Oggetto',
  submitBackgroundImage,
  submitLabel = 'Invia messaggio',
  submitStyle,
  successMessage = 'Messaggio inviato. Ti risponderemo presto.',
}) => {
  const [formState, setFormState] = useState(initialFormState)
  const [submitState, setSubmitState] = useState<SubmitState>('idle')
  const [feedback, setFeedback] = useState('')

  const fieldClassName = getEventSuiteTextClassName(fieldStyle, 'regular')
  const fieldTextStyle = getEventSuiteTextStyle(fieldStyle, {
    fontFamily: 'geistSans',
    fontSizeDesktop: 12,
    fontSizeMobile: 11,
    fontWeight: 'regular',
    lineHeight: 1.2,
  })

  const updateField = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, type, value } = event.target

    setFormState((current) => ({
      ...current,
      [name]:
        type === 'checkbox' && event.target instanceof HTMLInputElement
          ? event.target.checked
          : value,
    }))
  }

  const submitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (submitState === 'sending') return

    setSubmitState('sending')
    setFeedback('')

    try {
      const response = await fetch('/api/contact-message', {
        body: JSON.stringify({
          email: formState.email,
          emailSubjectPrefix,
          message: formState.message,
          name: formState.name,
          privacy: formState.privacy,
          subject: formState.subject,
          website: formState.website,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Contact message failed')
      }

      setSubmitState('success')
      setFeedback(successMessage || 'Messaggio inviato.')
      setFormState(initialFormState)
    } catch {
      setSubmitState('error')
      setFeedback(errorMessage || 'Messaggio non inviato.')
    }
  }

  return (
    <section className="w-full">
      <div className="contact-message-panel-frame scribble-border relative isolate mx-auto w-full max-w-3xl overflow-visible">
        <div
          className="contact-message-panel vintage-surface relative isolate overflow-hidden px-5 py-5 md:px-9 md:py-7"
          style={{
            backgroundImage: resolveMediaBackground(backgroundImage),
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: backgroundImage ? 'cover' : undefined,
          }}
        >
          {decorativeImage && typeof decorativeImage === 'object' ? (
            <div className="pointer-events-none absolute right-4 top-3 z-10 h-24 w-24 opacity-90 md:right-6 md:top-4 md:h-32 md:w-32">
              <Media
                fill
                imgClassName="object-contain"
                pictureClassName="absolute inset-0"
                resource={decorativeImage}
                size="(max-width: 767px) 6rem, 8rem"
              />
            </div>
          ) : null}

          <div className="relative z-20 max-w-[calc(100%-5.5rem)] md:max-w-[calc(100%-8rem)]">
            <div
              className={cn(
                'inline-flex bg-transparent bg-center bg-no-repeat px-7 py-4 md:px-9 md:py-5',
                !headingBackgroundImage && 'px-0 py-0',
              )}
              style={{
                backgroundColor: 'transparent',
                backgroundImage: resolveMediaBackground(headingBackgroundImage),
                backgroundSize: headingBackgroundImage ? '100% 100%' : undefined,
              }}
            >
              <h2
                className={getEventSuiteTextClassName(headingStyle, 'black')}
                style={getEventSuiteTextStyle(headingStyle, {
                  fontFamily: 'cinzel',
                  fontSizeDesktop: 22,
                  fontSizeMobile: 18,
                  fontWeight: 'black',
                  lineHeight: 1,
                })}
              >
                {heading}
              </h2>
            </div>

            {introText ? (
              <p
                className={cn(getEventSuiteTextClassName(introStyle, 'regular'), 'mt-4 max-w-sm')}
                style={getEventSuiteTextStyle(introStyle, {
                  fontFamily: 'geistSans',
                  fontSizeDesktop: 13,
                  fontSizeMobile: 12,
                  fontWeight: 'regular',
                  lineHeight: 1.25,
                })}
              >
                {introText}
              </p>
            ) : null}
          </div>

          <form className="relative z-20 mt-5 grid gap-3" onSubmit={submitForm}>
            <input
              aria-hidden="true"
              autoComplete="off"
              className="hidden"
              name="website"
              onChange={updateField}
              tabIndex={-1}
              value={formState.website}
            />

            <div className="grid gap-3 md:grid-cols-2">
              <label className="contact-message-field scribble-border relative block min-w-0">
                <span className="sr-only">{namePlaceholder || 'Nome'}</span>
                <input
                  autoComplete="name"
                  className={cn('contact-message-input', fieldClassName)}
                  name="name"
                  onChange={updateField}
                  placeholder={namePlaceholder || 'Nome e Cognome'}
                  required
                  style={fieldTextStyle}
                  value={formState.name}
                />
              </label>

              <label className="contact-message-field scribble-border relative block min-w-0">
                <span className="sr-only">{emailPlaceholder || 'Email'}</span>
                <input
                  autoComplete="email"
                  className={cn('contact-message-input', fieldClassName)}
                  name="email"
                  onChange={updateField}
                  placeholder={emailPlaceholder || 'Email'}
                  required
                  style={fieldTextStyle}
                  type="email"
                  value={formState.email}
                />
              </label>
            </div>

            <label className="contact-message-field scribble-border relative block min-w-0">
              <span className="sr-only">{subjectPlaceholder || 'Oggetto'}</span>
              <input
                className={cn('contact-message-input', fieldClassName)}
                name="subject"
                onChange={updateField}
                placeholder={subjectPlaceholder || 'Oggetto'}
                required
                style={fieldTextStyle}
                value={formState.subject}
              />
            </label>

            <label className="contact-message-field contact-message-field--textarea scribble-border relative block min-w-0">
              <span className="sr-only">{messagePlaceholder || 'Messaggio'}</span>
              <textarea
                className={cn('contact-message-input min-h-28 resize-y', fieldClassName)}
                name="message"
                onChange={updateField}
                placeholder={messagePlaceholder || 'Messaggio'}
                required
                style={fieldTextStyle}
                value={formState.message}
              />
            </label>

            <label className="mt-1 flex items-start gap-2">
              <span className="contact-message-checkbox scribble-border relative mt-[0.1rem] inline-flex size-4 shrink-0">
                <input
                  checked={formState.privacy}
                  className="relative z-10 size-full cursor-pointer appearance-none bg-transparent"
                  name="privacy"
                  onChange={updateField}
                  required
                  type="checkbox"
                />
              </span>
              <span
                className={getEventSuiteTextClassName(privacyStyle, 'regular')}
                style={getEventSuiteTextStyle(privacyStyle, {
                  fontFamily: 'geistSans',
                  fontSizeDesktop: 12,
                  fontSizeMobile: 11,
                  fontWeight: 'regular',
                  lineHeight: 1.3,
                })}
              >
                {privacyLabel}
              </span>
            </label>

            <div className="mt-1 flex flex-wrap items-center gap-4">
              <button
                className={cn(
                  getEventSuiteTextClassName(submitStyle, 'black'),
                  'contact-message-submit inline-flex min-h-11 min-w-44 items-center justify-center bg-transparent bg-center bg-no-repeat px-7 py-3 disabled:cursor-wait disabled:opacity-65',
                )}
                disabled={submitState === 'sending'}
                style={{
                  ...getEventSuiteTextStyle(submitStyle, {
                    fontFamily: 'cinzel',
                    fontSizeDesktop: 13,
                    fontSizeMobile: 12,
                    fontWeight: 'black',
                    lineHeight: 1,
                  }),
                  backgroundColor: 'transparent',
                  backgroundImage: resolveMediaBackground(submitBackgroundImage),
                  backgroundSize: submitBackgroundImage ? '100% 100%' : undefined,
                  display: 'inline-flex',
                  transformOrigin: 'center',
                }}
                type="submit"
              >
                {submitState === 'sending' ? 'Invio...' : submitLabel}
              </button>

              {feedback ? (
                <p
                  className={getEventSuiteTextClassName(statusStyle, 'semibold')}
                  style={getEventSuiteTextStyle(statusStyle, {
                    fontFamily: 'geistSans',
                    fontSizeDesktop: 13,
                    fontSizeMobile: 12,
                    fontWeight: 'semibold',
                    lineHeight: 1.25,
                  })}
                >
                  {feedback}
                </p>
              ) : null}
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
