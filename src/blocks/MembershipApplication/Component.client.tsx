'use client'

import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { CheckCircle2, Download, FileText, RefreshCw, Trash2, Upload, X } from 'lucide-react'

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

type PrivacyDocument = {
  description?: null | string
  document?: EventSuiteMedia | number | null
  id?: null | string
  title?: null | string
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
  enablePrivacyTriggerLink?: boolean | null
  enablePurposeDeclarationTriggerLink?: boolean | null
  enableStatuteDeclarationTriggerLink?: boolean | null
  enableTruthDeclarationTriggerLink?: boolean | null
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
  motivationLabel?: null | string
  personalDataTitle?: null | string
  phoneLabel?: null | string
  privacyDeclarationLabel?: null | string
  privacyDocuments?: null | PrivacyDocument[]
  privacyTriggerLinkUrl?: null | string
  purposeDeclarationLabel?: null | string
  purposeDeclarationTriggerLinkUrl?: null | string
  requestTypeLabel?: null | string
  requestTypes?: null | RequestTypeOption[]
  residenceAddressLabel?: null | string
  sectionTitleStyle?: EventSuiteTextStyle | null
  statuteDeclarationLabel?: null | string
  statuteDeclarationTriggerLinkUrl?: null | string
  statusStyle?: EventSuiteTextStyle | null
  submitBackgroundImage?: EventSuiteMedia | number | null
  submitLabel?: null | string
  submitStyle?: EventSuiteTextStyle | null
  successMessage?: null | string
  truthDeclarationLabel?: null | string
  truthDeclarationTriggerLinkUrl?: null | string
}

type SubmitState = 'error' | 'idle' | 'sending' | 'success'

type PendingDownload = {
  label: string
  url: string
}

type DocumentFileKey = 'identityDocument' | 'taxCodeDocument'
type DocumentSelectionMode = 'append' | 'replace'

const documentFileLabels: Record<DocumentFileKey, string> = {
  identityDocument: "Carta d'identita",
  taxCodeDocument: 'Codice fiscale',
}

const emptyDocumentFiles: Record<DocumentFileKey, File[]> = {
  identityDocument: [],
  taxCodeDocument: [],
}

const maxDocumentFileSize = 4 * 1024 * 1024
const maxDocumentFileSizeLabel = '4 MB'
const maxDocumentFilesPerDocument = 3

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
  interestAreas: '',
  lastName: '',
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

const requiredLabel = (label: null | string | undefined, fallback: string) => {
  const value = label || fallback

  return /\*\s*$/.test(value) ? value : `${value} *`
}

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
  enablePrivacyTriggerLink = false,
  enablePurposeDeclarationTriggerLink = false,
  enableStatuteDeclarationTriggerLink = false,
  enableTruthDeclarationTriggerLink = false,
  errorMessage = 'Non siamo riusciti a inviare la candidatura. Riprova tra poco.',
  fieldStyle,
  firstNameLabel = 'Nome *',
  heading = "Domanda di ammissione all'associazione",
  headingBackgroundImage,
  headingStyle,
  interestAreasLabel = 'Aree di interesse *',
  introStyle,
  introText = 'Compila la candidatura con i tuoi dati. Ti ricontatteremo dopo averla ricevuta.',
  lastNameLabel = 'Cognome *',
  motivationLabel = "Perche vuoi entrare nell'associazione? *",
  personalDataTitle = 'Dati personali',
  phoneLabel = 'Telefono *',
  privacyDeclarationLabel = "Ho letto l'informativa privacy. *",
  privacyDocuments,
  privacyTriggerLinkUrl,
  purposeDeclarationLabel = "Dichiaro di condividere le finalita dell'associazione. *",
  purposeDeclarationTriggerLinkUrl,
  requestTypeLabel = 'Tipo di richiesta *',
  requestTypes,
  residenceAddressLabel = 'Indirizzo di residenza *',
  sectionTitleStyle,
  statuteDeclarationLabel = "Dichiaro di aver letto e accettare lo statuto e il regolamento dell'associazione. *",
  statuteDeclarationTriggerLinkUrl,
  statusStyle,
  submitBackgroundImage,
  submitLabel = 'Invia candidatura',
  submitStyle,
  successMessage = 'Candidatura inviata. Ti ricontatteremo presto.',
  truthDeclarationLabel = 'Dichiaro che i dati inseriti sono veritieri. *',
  truthDeclarationTriggerLinkUrl,
}) => {
  const [formState, setFormState] = useState(initialFormState)
  const [submitState, setSubmitState] = useState<SubmitState>('idle')
  const [feedback, setFeedback] = useState('')
  const [pendingDownload, setPendingDownload] = useState<PendingDownload | null>(null)
  const [documentFiles, setDocumentFiles] =
    useState<Record<DocumentFileKey, File[]>>(emptyDocumentFiles)
  const [activeDateField, setActiveDateField] = useState<keyof typeof initialFormState | null>(null)
  const cancelDownloadButtonRef = useRef<HTMLButtonElement>(null)
  const documentInputRefs = useRef<Record<DocumentFileKey, HTMLInputElement | null>>({
    identityDocument: null,
    taxCodeDocument: null,
  })
  const documentSelectionModes = useRef<Record<DocumentFileKey, DocumentSelectionMode>>({
    identityDocument: 'append',
    taxCodeDocument: 'append',
  })
  const identityDocumentInputId = React.useId()
  const taxCodeDocumentInputId = React.useId()
  const documentInputIds: Record<DocumentFileKey, string> = {
    identityDocument: identityDocumentInputId,
    taxCodeDocument: taxCodeDocumentInputId,
  }

  useEffect(() => {
    if (!pendingDownload) return

    const previousFocusedElement =
      document.activeElement instanceof HTMLElement ? document.activeElement : null
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setPendingDownload(null)
      }
    }

    const previousOverflow = document.body.style.overflow

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', closeOnEscape)
    window.setTimeout(() => cancelDownloadButtonRef.current?.focus(), 0)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeOnEscape)
      previousFocusedElement?.focus()
    }
  }, [pendingDownload])

  const requestTypeOptions =
    requestTypes?.map((item) => item.label).filter((label): label is string => Boolean(label)) ||
    fallbackRequestTypes
  const downloadablePrivacyDocuments =
    privacyDocuments?.filter(
      (item) => item?.document && typeof item.document === 'object' && item.document.url,
    ) || []

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
  const getTriggerLinkUrl = (
    enabled: boolean | null | undefined,
    url: null | string | undefined,
  ) => (enabled && url ? url : '')
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

  const updateDocumentFile =
    (name: DocumentFileKey) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(event.target.files || [])
      const oversizedFile = selectedFiles.find((file) => file.size > maxDocumentFileSize)
      const selectionMode = documentSelectionModes.current[name]

      documentSelectionModes.current[name] = 'append'
      event.target.value = ''

      setFeedback('')

      if (oversizedFile) {
        setSubmitState('error')
        setFeedback(
          `Il file "${oversizedFile.name}" supera il limite di ${maxDocumentFileSizeLabel}.`,
        )
        return
      }

      const currentFiles = selectionMode === 'append' ? documentFiles[name] : []
      const uniqueFiles = [...currentFiles, ...selectedFiles].filter(
        (file, index, files) =>
          files.findIndex(
            (candidate) =>
              candidate.name === file.name &&
              candidate.size === file.size &&
              candidate.lastModified === file.lastModified,
          ) === index,
      )
      const nextFiles = uniqueFiles.slice(0, maxDocumentFilesPerDocument)

      setDocumentFiles((current) => ({ ...current, [name]: nextFiles }))
      setSubmitState('idle')

      if (uniqueFiles.length > maxDocumentFilesPerDocument) {
        setSubmitState('error')
        setFeedback(`Puoi caricare al massimo ${maxDocumentFilesPerDocument} foto per documento.`)
      }
    }

  const clearDocumentFiles = (name: DocumentFileKey) => {
    setDocumentFiles((current) => ({ ...current, [name]: [] }))
    documentSelectionModes.current[name] = 'append'

    const input = documentInputRefs.current[name]

    if (input) input.value = ''

    setFeedback('')
    setSubmitState('idle')
  }

  const replaceDocumentFiles = (name: DocumentFileKey) => {
    documentSelectionModes.current[name] = 'replace'
    documentInputRefs.current[name]?.click()
  }

  const submitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (submitState === 'sending') return

    setSubmitState('sending')
    setFeedback('')

    try {
      const hasTaxCodeDocument = documentFiles.taxCodeDocument.length > 0
      const hasIdentityDocument = documentFiles.identityDocument.length > 0

      if (!hasTaxCodeDocument || !hasIdentityDocument) {
        setSubmitState('error')
        setFeedback('Carica codice fiscale e carta identita: foto completa oppure fronte e retro.')
        return
      }

      const formData = new FormData()

      Object.entries({
        ...formState,
        emailSubjectPrefix,
      }).forEach(([key, value]) => {
        formData.append(key, String(value))
      })

      Object.entries(documentFiles).forEach(([key, file]) => {
        file.forEach((file) => {
          formData.append(key, file)
        })
      })

      const response = await fetch('/api/membership-application', {
        body: formData,
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Membership application failed')
      }

      setSubmitState('success')
      setFeedback(successMessage || 'Candidatura inviata.')
      setFormState(initialFormState)
      setDocumentFiles(emptyDocumentFiles)
      Object.values(documentInputRefs.current).forEach((input) => {
        if (input) input.value = ''
      })
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
    inputMode,
    label,
    maxLength,
    name,
    pattern,
    required = true,
    spellCheck,
    type = 'text',
  }: {
    autoComplete?: string
    inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode']
    label: null | string | undefined
    maxLength?: number
    name: keyof typeof initialFormState
    pattern?: string
    required?: boolean
    spellCheck?: boolean
    type?: string
  }) => {
    const isDateField = type === 'date'
    const inputType = isDateField && !formState[name] && activeDateField !== name ? 'text' : type

    return (
      <label
        className={cn(
          'contact-message-field scribble-border relative block min-w-0',
          isDateField && 'contact-message-field--date',
        )}
      >
        <span className="sr-only">{srLabel(label, name)}</span>
        <input
          autoComplete={autoComplete}
          className={cn('contact-message-input', fieldClassName)}
          inputMode={inputMode}
          maxLength={maxLength}
          name={name}
          onBlur={() => {
            if (isDateField && !formState[name]) {
              setActiveDateField(null)
            }
          }}
          onChange={updateField}
          onFocus={() => {
            if (isDateField) {
              setActiveDateField(name)
            }
          }}
          placeholder={label || name}
          pattern={pattern}
          required={required}
          spellCheck={spellCheck}
          style={fieldTextStyle}
          type={inputType}
          value={String(formState[name])}
        />
      </label>
    )
  }

  const renderDocumentUpload = (name: DocumentFileKey) => {
    const files = documentFiles[name]
    const selectedCountLabel = `${files.length} ${files.length === 1 ? 'foto selezionata' : 'foto selezionate'}`
    const selectedLabel = files.length
      ? files.map((file) => file.name).join(', ')
      : 'Nessuna foto selezionata'

    return (
      <div className="contact-message-field membership-application-upload-field scribble-border relative">
        <input
          accept="image/*"
          className="sr-only"
          id={documentInputIds[name]}
          multiple
          name={name}
          onChange={updateDocumentFile(name)}
          ref={(input) => {
            documentInputRefs.current[name] = input
          }}
          type="file"
        />
        <label
          className="membership-application-upload-selector"
          htmlFor={documentInputIds[name]}
          onClick={() => {
            documentSelectionModes.current[name] = 'append'
          }}
        >
          <span className="membership-application-upload-icon">
            <Upload aria-hidden className="size-3.5" />
          </span>
          <span className="membership-application-upload-copy">
            <span className="membership-application-upload-label">
              {documentFileLabels[name]} *
            </span>
            <span className="membership-application-upload-hint">
              Foto fronte retro, max {maxDocumentFilesPerDocument} foto da{' '}
              {maxDocumentFileSizeLabel}
            </span>
          </span>
          <span className="membership-application-upload-cta">
            <Upload aria-hidden className="size-3.5" />
            {files.length ? 'Aggiungi altre foto' : 'Aggiungi foto'}
          </span>
        </label>
        {files.length ? (
          <div className="membership-application-upload-selected">
            <div className="membership-application-upload-selected-info">
              <CheckCircle2 aria-hidden className="membership-application-upload-selected-icon" />
              <span className="membership-application-upload-selected-copy">
                <span className="membership-application-upload-selected-count">
                  {selectedCountLabel}
                </span>
                <span className="membership-application-upload-name">{selectedLabel}</span>
              </span>
            </div>
            <div className="membership-application-upload-actions">
              <button
                aria-label={`Sostituisci le foto per ${documentFileLabels[name]}`}
                className="membership-application-upload-action membership-application-upload-action--replace"
                disabled={submitState === 'sending'}
                onClick={() => replaceDocumentFiles(name)}
                type="button"
              >
                <RefreshCw aria-hidden className="size-3.5" />
                Sostituisci
              </button>
              <button
                aria-label={`Rimuovi le foto per ${documentFileLabels[name]}`}
                className="membership-application-upload-action membership-application-upload-action--remove"
                disabled={submitState === 'sending'}
                onClick={() => clearDocumentFiles(name)}
                type="button"
              >
                <Trash2 aria-hidden className="size-3.5" />
                Rimuovi
              </button>
            </div>
          </div>
        ) : null}
      </div>
    )
  }

  const renderIdentityUploads = () => (
    <div className="membership-application-upload-group md:col-span-2 xl:col-span-2">
      <div className="grid gap-3">
        {renderDocumentUpload('taxCodeDocument')}
        {renderDocumentUpload('identityDocument')}
      </div>
    </div>
  )

  const renderCheckbox = ({
    label,
    name,
    required = false,
    triggerLinkOnNewLine = false,
    triggerLinkUrl,
  }: {
    label: null | string | undefined
    name: keyof typeof initialFormState
    required?: boolean
    triggerLinkOnNewLine?: boolean
    triggerLinkUrl?: string
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
        {triggerLinkUrl ? (
          <>
            {' '}
            <a
              className={cn(
                'form-declaration-trigger-link',
                triggerLinkOnNewLine && 'membership-application-privacy-link',
              )}
              href={triggerLinkUrl}
              onClick={(event) => event.stopPropagation()}
              rel="noreferrer"
              target="_blank"
            >
              Clicca qui per visualizzare
            </a>
          </>
        ) : null}
      </span>
    </label>
  )

  const requestDownload = (url: null | string | undefined, label: string) => {
    if (!url) return

    setPendingDownload({ label, url })
  }

  const downloadPendingDocument = () => {
    if (!pendingDownload) return
    const link = document.createElement('a')

    link.download = ''
    link.href = pendingDownload.url
    link.rel = 'noreferrer'
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    link.remove()
    setPendingDownload(null)
  }

  const renderPrivacyDocuments = () =>
    downloadablePrivacyDocuments.length ? (
      <div className="mt-3 grid gap-2">
        {downloadablePrivacyDocuments.map((item, index) => {
          const document = item.document as EventSuiteMedia
          const label = item.title || document.alt || document.filename || `Documento ${index + 1}`

          return (
            <div
              className={cn(checkboxClassName, 'membership-application-document-row')}
              key={item.id || `${label}-${index}`}
              style={{
                ...checkboxTextStyle,
                display: 'flex',
              }}
            >
              <FileText aria-hidden className="membership-application-document-icon" />
              <span className="membership-application-document-title font-semibold">{label}</span>
              <button
                aria-label={`Scarica ${label}`}
                className="membership-application-document-download-button"
                onClick={() => requestDownload(document.url, label)}
                type="button"
              >
                <Download aria-hidden className="membership-application-document-download-icon" />
              </button>
            </div>
          )
        })}
      </div>
    ) : null

  return (
    <section className="w-full px-4 md:px-0">
      <div className="contact-message-panel-frame scribble-border relative isolate mx-auto w-full max-w-4xl overflow-visible">
        <div
          className="contact-message-panel membership-application-panel vintage-surface relative isolate overflow-hidden px-5 py-5 md:px-9 md:py-7"
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
                'inline-flex bg-transparent bg-center bg-no-repeat px-7 py-5.5 md:px-9 md:py-5',
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

            <div className="membership-application-quadrants grid gap-5 lg:grid-cols-2">
              <div className="membership-application-quadrant grid min-w-0 content-start gap-3">
                {renderSectionTitle(personalDataTitle)}
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  {renderTextField({
                    autoComplete: 'given-name',
                    label: requiredLabel(firstNameLabel, 'Nome'),
                    name: 'firstName',
                  })}
                  {renderTextField({
                    autoComplete: 'family-name',
                    label: requiredLabel(lastNameLabel, 'Cognome'),
                    name: 'lastName',
                  })}
                  {renderTextField({
                    label: requiredLabel(birthDateLabel, 'Data di nascita'),
                    name: 'birthDate',
                    type: 'date',
                  })}
                  {renderTextField({
                    label: requiredLabel(birthPlaceLabel, 'Luogo di nascita'),
                    name: 'birthPlace',
                  })}
                  {renderTextField({
                    autoComplete: 'street-address',
                    label: requiredLabel(residenceAddressLabel, 'Indirizzo di residenza'),
                    name: 'residenceAddress',
                  })}
                  {renderTextField({
                    autoComplete: 'email',
                    label: requiredLabel(emailLabel, 'Email'),
                    name: 'email',
                    type: 'email',
                  })}
                  {renderTextField({
                    autoComplete: 'tel',
                    label: requiredLabel(phoneLabel, 'Telefono'),
                    name: 'phone',
                    type: 'tel',
                  })}
                  {renderIdentityUploads()}
                </div>
              </div>

              <div className="membership-application-quadrant grid min-w-0 content-start gap-3">
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
                    <option value="">{requiredLabel(requestTypeLabel, 'Tipo di richiesta')}</option>
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
                    placeholder={requiredLabel(motivationLabel, 'Motivazione')}
                    required
                    style={fieldTextStyle}
                    value={formState.motivation}
                  />
                </label>

                <label className="contact-message-field contact-message-field--textarea scribble-border relative block min-w-0">
                  <span className="sr-only">
                    {srLabel(interestAreasLabel, 'Aree di interesse')}
                  </span>
                  <textarea
                    className={cn('contact-message-input min-h-20 resize-y', fieldClassName)}
                    name="interestAreas"
                    onChange={updateField}
                    placeholder={requiredLabel(interestAreasLabel, 'Aree di interesse')}
                    required
                    style={fieldTextStyle}
                    value={formState.interestAreas}
                  />
                </label>
              </div>

              <div className="membership-application-quadrant grid min-w-0 content-start gap-3 lg:col-span-2">
                {renderSectionTitle(declarationsTitle)}
                <div className="grid gap-2">
                  {renderCheckbox({
                    label: statuteDeclarationLabel,
                    name: 'statuteDeclaration',
                    required: true,
                    triggerLinkUrl: getTriggerLinkUrl(
                      enableStatuteDeclarationTriggerLink,
                      statuteDeclarationTriggerLinkUrl,
                    ),
                  })}
                  {renderCheckbox({
                    label: purposeDeclarationLabel,
                    name: 'purposeDeclaration',
                    required: true,
                    triggerLinkUrl: getTriggerLinkUrl(
                      enablePurposeDeclarationTriggerLink,
                      purposeDeclarationTriggerLinkUrl,
                    ),
                  })}
                  {renderCheckbox({
                    label: truthDeclarationLabel,
                    name: 'truthDeclaration',
                    required: true,
                    triggerLinkUrl: getTriggerLinkUrl(
                      enableTruthDeclarationTriggerLink,
                      truthDeclarationTriggerLinkUrl,
                    ),
                  })}
                  {renderCheckbox({
                    label: privacyDeclarationLabel,
                    name: 'privacyDeclaration',
                    required: true,
                    triggerLinkOnNewLine: true,
                    triggerLinkUrl:
                      getTriggerLinkUrl(enablePrivacyTriggerLink, privacyTriggerLinkUrl) ||
                      '/privacy-policy',
                  })}
                </div>
                {renderPrivacyDocuments()}
              </div>
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
      </div>

      {pendingDownload
        ? createPortal(
            <div
              aria-labelledby="membership-download-modal-title"
              aria-modal="true"
              className="membership-application-download-modal"
              onClick={() => setPendingDownload(null)}
              role="dialog"
            >
              <div
                className="membership-application-download-modal-panel vintage-surface"
                onClick={(event) => event.stopPropagation()}
              >
                <button
                  aria-label="Chiudi conferma download"
                  className="membership-application-download-modal-close"
                  onClick={() => setPendingDownload(null)}
                  type="button"
                >
                  <X aria-hidden className="size-4" />
                </button>

                <div aria-hidden className="membership-application-download-modal-icon-wrap">
                  <FileText className="membership-application-download-modal-icon" />
                </div>

                <div className="membership-application-download-modal-content">
                  <span className="membership-application-download-modal-eyebrow">Area soci</span>
                  <h3
                    className={cn(
                      sectionTitleClassName,
                      'membership-application-download-modal-title',
                    )}
                    id="membership-download-modal-title"
                    style={sectionTitleTextStyle}
                  >
                    Scarica documento
                  </h3>
                  <div className="membership-application-download-modal-file">
                    <FileText aria-hidden className="size-4" />
                    <span>{pendingDownload.label}</span>
                  </div>
                </div>

                <div className="membership-application-download-modal-actions">
                  <button
                    className="membership-application-download-modal-button membership-application-download-modal-button--ghost"
                    onClick={() => setPendingDownload(null)}
                    ref={cancelDownloadButtonRef}
                    type="button"
                  >
                    Annulla
                  </button>
                  <button
                    className="membership-application-download-modal-button membership-application-download-modal-button--primary"
                    onClick={downloadPendingDocument}
                    type="button"
                  >
                    <Download aria-hidden className="size-4" />
                    Scarica
                  </button>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </section>
  )
}
