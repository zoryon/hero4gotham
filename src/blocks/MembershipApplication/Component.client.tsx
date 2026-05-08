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

type RequestTypeOption = {
  id?: null | string
  label?: null | string
}

type Props = {
  applicationTitle?: null | string
  backgroundImage?: EventSuiteMedia | number | null
  birthDateLabel?: null | string
  birthPlaceLabel?: null | string
  checkboxStyle?: EventSuiteTextStyle | null
  declarationsTitle?: null | string
  decorativeImage?: EventSuiteMedia | number | null
  emailLabel?: null | string
  emailSubjectPrefix?: null | string
  errorMessage?: null | string
  fieldStyle?: EventSuiteTextStyle | null
  firstNameLabel?: null | string
  fiscalCodeLabel?: null | string
  heading?: null | string
  headingBackgroundImage?: EventSuiteMedia | number | null
  headingStyle?: EventSuiteTextStyle | null
  interestAreasLabel?: null | string
  introStyle?: EventSuiteTextStyle | null
  introText?: null | string
  lastNameLabel?: null | string
  mediaConsentLabel?: null | string
  motivationLabel?: null | string
  optionalConsentsTitle?: null | string
  personalDataTitle?: null | string
  phoneLabel?: null | string
  privacyDeclarationLabel?: null | string
  purposeDeclarationLabel?: null | string
  requestTypeLabel?: null | string
  requestTypes?: null | RequestTypeOption[]
  residenceAddressLabel?: null | string
  sectionTitleStyle?: EventSuiteTextStyle | null
  statuteDeclarationLabel?: null | string
  statusStyle?: EventSuiteTextStyle | null
  submitBackgroundImage?: EventSuiteMedia | number | null
  submitLabel?: null | string
  submitStyle?: EventSuiteTextStyle | null
  successMessage?: null | string
  truthDeclarationLabel?: null | string
}

type SubmitState = 'error' | 'idle' | 'sending' | 'success'

const fallbackRequestTypes = [
  'Domanda di ammissione come socio',
  'Candidatura come volontario',
  'Proposta di collaborazione',
]

const initialFormState = {
  birthDate: '',
  birthPlace: '',
  email: '',
  firstName: '',
  fiscalCode: '',
  interestAreas: '',
  lastName: '',
  mediaConsent: false,
  motivation: '',
  phone: '',
  privacyDeclaration: false,
  purposeDeclaration: false,
  requestType: '',
  residenceAddress: '',
  statuteDeclaration: false,
  truthDeclaration: false,
  website: '',
}

const srLabel = (label: null | string | undefined, fallback: string) =>
  (label || fallback).replace(/\s*\*+\s*$/, '')

export const MembershipApplicationBlock: React.FC<Props> = ({
  applicationTitle = 'Candidatura',
  backgroundImage,
  birthDateLabel = 'Data di nascita *',
  birthPlaceLabel = 'Luogo di nascita *',
  checkboxStyle,
  declarationsTitle = 'Dichiarazioni',
  decorativeImage,
  emailLabel = 'Email *',
  emailSubjectPrefix = 'Nuova candidatura associazione',
  errorMessage = 'Non siamo riusciti a inviare la candidatura. Riprova tra poco.',
  fieldStyle,
  firstNameLabel = 'Nome *',
  fiscalCodeLabel = 'Codice fiscale *',
  heading = "Domanda di ammissione all'associazione",
  headingBackgroundImage,
  headingStyle,
  interestAreasLabel = 'Aree di interesse',
  introStyle,
  introText = 'Compila la candidatura con i tuoi dati. Ti ricontatteremo dopo averla ricevuta.',
  lastNameLabel = 'Cognome *',
  mediaConsentLabel = "Acconsento all'uso di foto/video in cui appaio durante eventi associativi.",
  motivationLabel = "Perche vuoi entrare nell'associazione? *",
  optionalConsentsTitle = 'Consensi facoltativi',
  personalDataTitle = 'Dati personali',
  phoneLabel = 'Telefono',
  privacyDeclarationLabel = "Ho letto l'informativa privacy. *",
  purposeDeclarationLabel = "Dichiaro di condividere le finalita dell'associazione. *",
  requestTypeLabel = 'Tipo di richiesta *',
  requestTypes,
  residenceAddressLabel = 'Indirizzo di residenza *',
  sectionTitleStyle,
  statuteDeclarationLabel = "Dichiaro di aver letto e accettare lo statuto e il regolamento dell'associazione. *",
  statusStyle,
  submitBackgroundImage,
  submitLabel = 'Invia candidatura',
  submitStyle,
  successMessage = 'Candidatura inviata. Ti ricontatteremo presto.',
  truthDeclarationLabel = 'Dichiaro che i dati inseriti sono veritieri. *',
}) => {
  const [formState, setFormState] = useState(initialFormState)
  const [submitState, setSubmitState] = useState<SubmitState>('idle')
  const [feedback, setFeedback] = useState('')

  const requestTypeOptions =
    requestTypes?.map((item) => item.label).filter((label): label is string => Boolean(label)) ||
    fallbackRequestTypes

  const fieldClassName = getEventSuiteTextClassName(fieldStyle, 'regular')
  const fieldTextStyle = getEventSuiteTextStyle(fieldStyle, {
    fontFamily: 'geistSans',
    fontSizeDesktop: 12,
    fontSizeMobile: 11,
    fontWeight: 'regular',
    lineHeight: 1.2,
  })
  const checkboxClassName = getEventSuiteTextClassName(checkboxStyle, 'regular')
  const checkboxTextStyle = getEventSuiteTextStyle(checkboxStyle, {
    fontFamily: 'geistSans',
    fontSizeDesktop: 12,
    fontSizeMobile: 11,
    fontWeight: 'regular',
    lineHeight: 1.3,
  })
  const sectionTitleClassName = getEventSuiteTextClassName(sectionTitleStyle, 'black')
  const sectionTitleTextStyle = getEventSuiteTextStyle(sectionTitleStyle, {
    fontFamily: 'cinzel',
    fontSizeDesktop: 16,
    fontSizeMobile: 14,
    fontWeight: 'black',
    lineHeight: 1,
  })

  const updateField = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
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
      const response = await fetch('/api/membership-application', {
        body: JSON.stringify({
          ...formState,
          emailSubjectPrefix,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Membership application failed')
      }

      setSubmitState('success')
      setFeedback(successMessage || 'Candidatura inviata.')
      setFormState(initialFormState)
    } catch {
      setSubmitState('error')
      setFeedback(errorMessage || 'Candidatura non inviata.')
    }
  }

  const renderSectionTitle = (title: null | string | undefined) =>
    title ? (
      <h3
        className={cn(sectionTitleClassName, 'membership-application-section-title')}
        style={sectionTitleTextStyle}
      >
        {title}
      </h3>
    ) : null

  const renderTextField = ({
    autoComplete,
    label,
    name,
    required = true,
    type = 'text',
  }: {
    autoComplete?: string
    label: null | string | undefined
    name: keyof typeof initialFormState
    required?: boolean
    type?: string
  }) => (
    <label className="contact-message-field scribble-border relative block min-w-0">
      <span className="sr-only">{srLabel(label, name)}</span>
      <input
        autoComplete={autoComplete}
        className={cn('contact-message-input', fieldClassName)}
        name={name}
        onChange={updateField}
        placeholder={label || name}
        required={required}
        style={fieldTextStyle}
        type={type}
        value={String(formState[name])}
      />
    </label>
  )

  const renderCheckbox = ({
    label,
    name,
    required = false,
  }: {
    label: null | string | undefined
    name: keyof typeof initialFormState
    required?: boolean
  }) => (
    <label className="membership-application-checkbox-row flex items-start gap-2">
      <span className="contact-message-checkbox scribble-border relative mt-[0.1rem] inline-flex size-4 shrink-0">
        <input
          checked={Boolean(formState[name])}
          className="relative z-10 size-full cursor-pointer appearance-none bg-transparent"
          name={name}
          onChange={updateField}
          required={required}
          type="checkbox"
        />
      </span>
      <span className={checkboxClassName} style={checkboxTextStyle}>
        {label}
      </span>
    </label>
  )

  return (
    <section className="w-full">
      <div
        className="contact-message-panel membership-application-panel scribble-border relative isolate mx-auto w-full max-w-4xl overflow-visible px-5 py-5 md:px-9 md:py-7"
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
              className={cn(getEventSuiteTextClassName(introStyle, 'regular'), 'mt-4 max-w-lg')}
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

        <form className="relative z-20 mt-5 grid gap-5" onSubmit={submitForm}>
          <input
            aria-hidden="true"
            autoComplete="off"
            className="hidden"
            name="website"
            onChange={updateField}
            tabIndex={-1}
            value={formState.website}
          />

          <div className="grid gap-3">
            {renderSectionTitle(personalDataTitle)}
            <div className="grid gap-3 md:grid-cols-2">
              {renderTextField({
                autoComplete: 'given-name',
                label: firstNameLabel,
                name: 'firstName',
              })}
              {renderTextField({
                autoComplete: 'family-name',
                label: lastNameLabel,
                name: 'lastName',
              })}
              {renderTextField({ label: birthDateLabel, name: 'birthDate', type: 'date' })}
              {renderTextField({ label: birthPlaceLabel, name: 'birthPlace' })}
              {renderTextField({
                autoComplete: 'off',
                label: fiscalCodeLabel,
                name: 'fiscalCode',
              })}
              {renderTextField({
                autoComplete: 'street-address',
                label: residenceAddressLabel,
                name: 'residenceAddress',
              })}
              {renderTextField({
                autoComplete: 'email',
                label: emailLabel,
                name: 'email',
                type: 'email',
              })}
              {renderTextField({
                autoComplete: 'tel',
                label: phoneLabel,
                name: 'phone',
                required: false,
                type: 'tel',
              })}
            </div>
          </div>

          <div className="grid gap-3">
            {renderSectionTitle(applicationTitle)}
            <label className="contact-message-field scribble-border relative block min-w-0">
              <span className="sr-only">{srLabel(requestTypeLabel, 'Tipo di richiesta')}</span>
              <select
                className={cn('contact-message-input', fieldClassName)}
                name="requestType"
                onChange={updateField}
                required
                style={fieldTextStyle}
                value={formState.requestType}
              >
                <option value="">{requestTypeLabel || 'Tipo di richiesta *'}</option>
                {requestTypeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="contact-message-field contact-message-field--textarea scribble-border relative block min-w-0">
              <span className="sr-only">{srLabel(motivationLabel, 'Motivazione')}</span>
              <textarea
                className={cn('contact-message-input min-h-28 resize-y', fieldClassName)}
                name="motivation"
                onChange={updateField}
                placeholder={motivationLabel || 'Motivazione *'}
                required
                style={fieldTextStyle}
                value={formState.motivation}
              />
            </label>

            <label className="contact-message-field contact-message-field--textarea scribble-border relative block min-w-0">
              <span className="sr-only">{srLabel(interestAreasLabel, 'Aree di interesse')}</span>
              <textarea
                className={cn('contact-message-input min-h-20 resize-y', fieldClassName)}
                name="interestAreas"
                onChange={updateField}
                placeholder={interestAreasLabel || 'Aree di interesse'}
                style={fieldTextStyle}
                value={formState.interestAreas}
              />
            </label>
          </div>

          <div className="grid gap-3">
            {renderSectionTitle(declarationsTitle)}
            <div className="grid gap-2">
              {renderCheckbox({
                label: statuteDeclarationLabel,
                name: 'statuteDeclaration',
                required: true,
              })}
              {renderCheckbox({
                label: purposeDeclarationLabel,
                name: 'purposeDeclaration',
                required: true,
              })}
              {renderCheckbox({
                label: truthDeclarationLabel,
                name: 'truthDeclaration',
                required: true,
              })}
              {renderCheckbox({
                label: privacyDeclarationLabel,
                name: 'privacyDeclaration',
                required: true,
              })}
            </div>
          </div>

          <div className="grid gap-3">
            {renderSectionTitle(optionalConsentsTitle)}
            {renderCheckbox({ label: mediaConsentLabel, name: 'mediaConsent' })}
          </div>

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
    </section>
  )
}
