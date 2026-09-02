export const siteCopyDefaults = {
  accessibility: {
    closeNavigation: 'Chiudi navigazione',
    downloadNamed: 'Scarica {label}',
    loadingPhotos: 'Caricamento foto…',
    morePages: 'Altre pagine',
    openAlbumNamed: "Apri l'album {title}",
    openCallToAction: 'Apri call to action',
    openNavigation: 'Apri navigazione',
    primaryNavigation: 'Navigazione principale',
    removePhotosNamed: 'Rimuovi le foto per {label}',
    replacePhotosNamed: 'Sostituisci le foto per {label}',
    search: 'Cerca',
    socialFallback: 'Social',
    socialLinks: 'Link social',
    scrollToTop: 'Torna in alto',
  },
  common: {
    loading: 'Caricamento, attendi...',
    undefinedValue: 'Da definire',
  },
  cookie: {
    acceptAll: 'Accetta tutto',
    analyticsDescription: 'Statistiche anonime e miglioramento del sito',
    analyticsLabel: 'Analytics',
    categoriesLabel: 'Categorie cookie',
    description:
      'Usiamo cookie tecnici necessari al funzionamento del sito. Con il tuo consenso possiamo usare anche cookie analytics e marketing. Puoi accettare tutti i cookie, rifiutare quelli non necessari o scegliere le categorie da abilitare. Puoi modificare le preferenze in qualsiasi momento dal link nel footer.',
    dialogLabel: 'Preferenze cookie',
    eyebrow: 'Preferenze cookie',
    marketingDescription: 'Contenuti e strumenti promozionali esterni',
    marketingLabel: 'Marketing',
    necessaryDescription: 'Sempre attivi',
    necessaryLabel: 'Necessari',
    policyLabel: 'Leggi Privacy e Cookie Policy',
    rejectOptional: 'Rifiuta non necessari',
    savePreferences: 'Salva preferenze',
    title: 'Gestisci i cookie',
  },
  eventDetail: {
    artistsEyebrow: 'Sul palco',
    artistsTitle: 'Artisti ed ospiti',
    audienceLabel: 'Pubblico',
    backLabel: 'Eventi',
    dateLabel: 'Data',
    descriptionTitle: 'Descrizione',
    fallbackMetaTitle: 'Evento | Hero 4 Gotham',
    galleryLoadMore: 'Carica altre foto',
    galleryLoadMoreAlbums: 'Carica altri album',
    galleryEmpty: 'Nessuna foto trovata',
    scheduleEyebrow: 'Programma',
    scheduleTitle: 'La scaletta',
    timeLabel: 'Orario',
    usefulInfoEyebrow: 'Prima di venire',
    usefulInfoTitle: 'Informazioni utili',
    venueLabel: 'Luogo',
  },
  eventSuite: {
    calendarNextMonth: 'Mese successivo',
    calendarNextYear: 'Anno successivo',
    calendarPreviousMonth: 'Mese precedente',
    calendarPreviousYear: 'Anno precedente',
    featuredComingSoon: 'Prossimamente',
    featuredEmptyDescription: 'Non ci sono eventi imminenti al momento. Torna a trovarci presto.',
    featuredEmptyTitle: 'Nessun evento imminente',
    featuredEventsLink: 'Vai agli eventi',
    listNext: 'Successiva',
    listNextAriaLabel: 'Pagina successiva',
    listPaginationLabel: 'Paginazione eventi',
    listPageStatus: 'Pagina {page} di {total}',
    listPinnedEvent: 'Evento fissato in cima',
    listPrevious: 'Precedente',
    listPreviousAriaLabel: 'Pagina precedente',
  },
  footer: {
    informationTitle: 'Informazioni',
    instagramLabel: 'Instagram',
    linkedinLabel: 'LinkedIn',
    privacyPolicyLabel: 'Privacy Policy',
    privacyPreferencesLabel: 'Le tue preferenze relative alla privacy',
    legalNavigationLabel: 'Link legali',
    socialNavigationLabel: 'Link social',
    socialTitle: 'Seguici',
    twitterLabel: 'X(Twitter)',
  },
  forms: {
    closeDownloadConfirmation: 'Chiudi conferma download',
    contactDocumentsEyebrow: 'Documenti',
    genericError: 'Qualcosa è andato storto.',
    loading: 'Caricamento, attendi...',
    membershipDocumentsEyebrow: 'Area soci',
    requiredError: 'Questo campo è obbligatorio',
    requiredLabel: 'obbligatorio',
    serverError: 'Errore interno del server',
  },
  notFound: {
    goHome: 'Torna alla home',
    message: 'Questa pagina non è stata trovata.',
  },
  pagination: {
    navigationLabel: 'Paginazione',
    next: 'Successiva',
    nextAriaLabel: 'Vai alla pagina successiva',
    previous: 'Precedente',
    previousAriaLabel: 'Vai alla pagina precedente',
  },
  posts: {
    authorLabel: 'Autore',
    datePublishedLabel: 'Data di pubblicazione',
    missingImage: 'Nessuna immagine',
    title: 'Articoli',
    untitledCategory: 'Categoria senza titolo',
    rangeEmpty: 'La ricerca non ha prodotto risultati.',
    rangeSummary: 'Visualizzati {start} - {end} di {total} {label}',
    pluralLabel: 'Articoli',
    singularLabel: 'Articolo',
  },
  privacy: {
    defaultSection: 'Introduzione',
    eyebrow: 'Informativa privacy',
    fallbackDescription: 'Informativa privacy sul trattamento dei dati personali del sito.',
    fallbackTitle: 'Privacy Policy',
    lastUpdatedFallback: 'Ultimo aggiornamento',
    sectionLabel: 'Sezione',
    sectionsAriaLabel: 'Sezioni privacy policy',
    tableOfContentsAriaLabel: 'Indice privacy policy',
  },
  search: {
    empty: 'Nessun risultato trovato.',
    placeholder: 'Cerca',
    submit: 'Cerca',
    title: 'Ricerca',
  },
  seo: {
    defaultDescription:
      'Hero 4 Gotham, associazione culturale dedicata ad arte, creatività, eventi e partecipazione.',
    eventFallbackTitle: 'Evento | Hero 4 Gotham',
    postsPageTitle: 'Articoli - Pagina {page} | Hero 4 Gotham',
    postsTitle: 'Articoli | Hero 4 Gotham',
    searchTitle: 'Ricerca | Hero 4 Gotham',
    siteName: 'Hero 4 Gotham',
  },
} as const

export type SiteCopyData = {
  [Group in keyof typeof siteCopyDefaults]: {
    [Key in keyof (typeof siteCopyDefaults)[Group]]: string
  }
}

export const mergeSiteCopy = (stored: unknown): SiteCopyData => {
  const storedRecord =
    stored && typeof stored === 'object' ? (stored as Record<string, unknown>) : {}

  return Object.fromEntries(
    Object.entries(siteCopyDefaults).map(([groupName, defaults]) => {
      const storedGroup =
        storedRecord[groupName] && typeof storedRecord[groupName] === 'object'
          ? (storedRecord[groupName] as Record<string, unknown>)
          : {}

      return [
        groupName,
        Object.fromEntries(
          Object.entries(defaults).map(([key, fallback]) => [
            key,
            typeof storedGroup[key] === 'string' ? storedGroup[key] : fallback,
          ]),
        ),
      ]
    }),
  ) as SiteCopyData
}
