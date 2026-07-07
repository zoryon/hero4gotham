import type { Config, Plugin } from 'payload'

type EntityLabels = {
  plural: string
  singular: string
}

type MutableRecord = Record<string, unknown>

const entityLabels: Record<string, EntityLabels> = {
  activities: { plural: 'Attivita', singular: 'Attivita' },
  activitiesDetailGrid: {
    plural: 'Griglie dettagli attivita',
    singular: 'Griglia dettagli attivita',
  },
  activityChoiceCta: { plural: 'CTA scelta attivita', singular: 'CTA scelta attivita' },
  archive: { plural: 'Archivi', singular: 'Archivio' },
  arrow: { plural: 'Frecce', singular: 'Freccia' },
  callToAction: { plural: "Inviti all'azione", singular: "Invito all'azione" },
  categories: { plural: 'Categorie', singular: 'Categoria' },
  contactMessage: { plural: 'Messaggi di contatto', singular: 'Messaggio di contatto' },
  eventCalendar: { plural: 'Calendari eventi', singular: 'Calendario eventi' },
  eventFilters: { plural: 'Filtri eventi', singular: 'Filtri eventi' },
  eventGallery: { plural: 'Gallerie eventi', singular: 'Galleria eventi' },
  eventList: { plural: 'Liste eventi', singular: 'Lista eventi' },
  eventProposalCta: { plural: 'CTA proposta evento', singular: 'CTA proposta evento' },
  events: { plural: 'Eventi', singular: 'Evento' },
  faqAccordion: { plural: 'Accordion FAQ', singular: 'Accordion FAQ' },
  featureGrid: { plural: 'Griglie caratteristiche', singular: 'Griglia caratteristiche' },
  featuredEvent: { plural: 'Eventi in evidenza', singular: 'Evento in evidenza' },
  flexbox: { plural: 'Flexbox', singular: 'Flexbox' },
  footer: { plural: 'Pie di pagina', singular: 'Pie di pagina' },
  formBlock: { plural: 'Moduli', singular: 'Modulo' },
  forms: { plural: 'Moduli', singular: 'Modulo' },
  'form-submissions': { plural: 'Invii moduli', singular: 'Invio modulo' },
  header: { plural: 'Intestazione', singular: 'Intestazione' },
  media: { plural: 'Media', singular: 'Media' },
  membershipApplication: {
    plural: 'Domande di ammissione',
    singular: 'Domanda di ammissione',
  },
  membershipDocuments: { plural: 'Documenti', singular: 'Documenti' },
  pages: { plural: 'Pagine', singular: 'Pagina' },
  posts: { plural: 'Articoli', singular: 'Articolo' },
  'payload-folders': { plural: 'Cartelle', singular: 'Cartella' },
  'payload-jobs': { plural: 'Processi in background', singular: 'Processo in background' },
  'payload-kv': { plural: 'Chiavi Payload', singular: 'Chiave Payload' },
  'payload-locked-documents': { plural: 'Documenti bloccati', singular: 'Documento bloccato' },
  'payload-migrations': { plural: 'Migrazioni', singular: 'Migrazione' },
  'payload-preferences': { plural: 'Preferenze', singular: 'Preferenza' },
  privacyPolicy: { plural: 'Privacy policy', singular: 'Privacy policy' },
  processSteps: { plural: 'Passaggi processo', singular: 'Passaggio processo' },
  quoteBanner: { plural: 'Banner citazione', singular: 'Banner citazione' },
  redirects: { plural: 'Reindirizzamenti', singular: 'Reindirizzamento' },
  search: { plural: 'Ricerca', singular: 'Ricerca' },
  siteBackground: { plural: 'Sfondo sito', singular: 'Sfondo sito' },
  socialFollowCta: { plural: 'CTA social', singular: 'CTA social' },
  subtitle: { plural: 'Sottotitoli', singular: 'Sottotitolo' },
  textBackdrop: { plural: 'Testi con fondale', singular: 'Testo con fondale' },
  themeColors: { plural: 'Colori tema', singular: 'Colori tema' },
  threePanelShowcase: { plural: 'Vetrine a tre pannelli', singular: 'Vetrina a tre pannelli' },
  title: { plural: 'Titoli', singular: 'Titolo' },
  tornCards: { plural: 'Schede strappate', singular: 'Scheda strappata' },
  upcomingEvents: { plural: 'Prossimi eventi', singular: 'Prossimi eventi' },
  upcomingEventsCta: { plural: 'CTA prossimi eventi', singular: 'CTA prossimi eventi' },
  users: { plural: 'Utenti', singular: 'Utente' },
}

const fieldNameTranslations: Record<string, string> = {
  alt: 'Testo alternativo',
  applicationTitle: 'Titolo candidatura',
  ibanLabel: 'Etichetta IBAN / coordinate bancarie',
  artistsAndGuests: 'Artisti e ospiti',
  audience: 'Pubblico',
  authors: 'Autori',
  backgroundImage: 'Immagine di sfondo',
  banner: 'Banner',
  birthDateLabel: 'Etichetta data di nascita',
  birthPlaceLabel: 'Etichetta luogo di nascita',
  blockName: 'Nome blocco',
  blockType: 'Tipo blocco',
  caption: 'Didascalia',
  categories: 'Categorie',
  confirmationMessage: 'Messaggio di conferma',
  confirmationType: 'Tipo di conferma',
  content: 'Contenuto',
  createdAt: 'Creato il',
  cta: 'Etichetta CTA',
  ctaImage: 'Immagine fascia CTA',
  decorativeImage: 'Immagine decorativa',
  declarationsTitle: 'Titolo dichiarazioni',
  description: 'Descrizione',
  details: 'Dettagli',
  email: 'Email',
  emailLabel: 'Etichetta email',
  emails: 'Email',
  enableIntro: 'Abilita contenuto introduttivo',
  firstName: 'Nome',
  firstNameLabel: 'Etichetta nome',
  fiscalCodeLabel: 'Etichetta codice fiscale',
  gallery: 'Galleria',
  heading: 'Titolo',
  heroImage: 'Immagine hero',
  icon: 'Icona',
  image: 'Immagine',
  introContent: 'Contenuto introduttivo',
  introText: 'Testo introduttivo',
  label: 'Etichetta',
  lastName: 'Cognome',
  lastNameLabel: 'Etichetta cognome',
  layout: 'Contenuto',
  link: 'Link',
  longDescription: 'Descrizione lunga',
  meta: 'SEO',
  motivationLabel: 'Etichetta motivazione',
  name: 'Nome',
  navItems: 'Voci di navigazione',
  order: 'Ordine',
  personalDataTitle: 'Titolo dati personali',
  phoneLabel: 'Etichetta telefono',
  photo: 'Foto',
  populatedAuthors: 'Autori visualizzati',
  privacyDeclarationLabel: 'Etichetta privacy',
  publishedAt: 'Data di pubblicazione',
  relatedPosts: 'Articoli correlati',
  requestTypeLabel: 'Etichetta tipo di richiesta',
  requestTypes: 'Tipi di richiesta',
  residenceAddressLabel: 'Etichetta indirizzo di residenza',
  role: 'Ruolo',
  shortName: 'Nome breve',
  slug: 'Slug',
  submitButtonLabel: 'Etichetta pulsante invio',
  submitLabel: 'Etichetta invio',
  title: 'Titolo',
  updatedAt: 'Aggiornato il',
  usefulInfo: 'Informazioni utili',
  venue: 'Luogo',
  venueAddress: 'Indirizzo luogo',
}

const exactTranslations: Record<string, string> = {
  '2 columns': '2 colonne',
  '3 columns': '3 colonne',
  '4 columns': '4 colonne',
  'Accent color': 'Colore accento',
  'Accent text': 'Testo accento',
  Activities: 'Attivita',
  'Activities source': 'Sorgente attivita',
  Activity: 'Attivita',
  'Activity image': 'Immagine attivita',
  Admin: 'Amministratore',
  Align: 'Allineamento',
  'Align items': 'Allinea elementi',
  Archive: 'Archivio',
  Archives: 'Archivi',
  Arrow: 'Freccia',
  Arrows: 'Frecce',
  Audience: 'Pubblico',
  Auto: 'Automatico',
  'Automatic cards scribble border': 'Bordo disegnato schede automatiche',
  'Automatic from Activities collection': 'Automatico dalla raccolta Attivita',
  'Automatic image area (%)': 'Area immagine automatica (%)',
  'Automatic image position': 'Posizione immagine automatica',
  'Automatic limit': 'Limite automatico',
  'Automatic line breaks': 'Interruzioni di riga automatiche',
  'Automatic/manual shared typography': 'Tipografia condivisa automatica/manuale',
  'Automatic: next 2 by date': 'Automatico: prossimi 2 per data',
  'Automatic: next upcoming event': 'Automatico: prossimo evento',
  Background: 'Sfondo',
  'Background colors': 'Colori sfondo',
  'Background image': 'Immagine di sfondo',
  'Background image rendering': 'Rendering immagine di sfondo',
  Banner: 'Banner',
  Baseline: 'Linea di base',
  Black: 'Nero',
  Block: 'Blocco',
  'Block link': 'Link blocco',
  Bold: 'Grassetto',
  Border: 'Bordo',
  Bottom: 'Basso',
  'Bottom left': 'In basso a sinistra',
  'Bottom right': 'In basso a destra',
  Bounce: 'Rimbalzo',
  Brand: 'Brand',
  'Breathing room': 'Respiro',
  'By columns': 'Per colonne',
  'By rows': 'Per righe',
  'Call to Action': "Invito all'azione",
  'Calls to Action': "Inviti all'azione",
  Categories: 'Categorie',
  'Categories To Show': 'Categorie da mostrare',
  Center: 'Centro',
  'Center column (%)': 'Colonna centrale (%)',
  'Center padding (px)': 'Padding centrale (px)',
  'Center panel vintage border': 'Bordo vintage pannello centrale',
  'Center text': 'Testo centrale',
  'Centered fog': 'Nebbia centrata',
  Chevron: 'Chevron',
  'Chevron color': 'Colore chevron',
  Collection: 'Raccolta',
  'Collections To Show': 'Raccolte da mostrare',
  Color: 'Colore',
  Colors: 'Colori',
  'Color source': 'Sorgente colore',
  Column: 'Colonna',
  'Column desktop, row tablet, column mobile': 'Colonna desktop, riga tablet, colonna mobile',
  Columns: 'Colonne',
  Compact: 'Compatto',
  Container: 'Contenitore',
  Contained: 'Contenuto',
  Content: 'Contenuto',
  'Content gap': 'Spazio contenuto',
  'Content padding (px)': 'Padding contenuto (px)',
  'Contact Message Block': 'Messaggio di contatto',
  'Contact Message Blocks': 'Messaggi di contatto',
  'CTA background image': 'Immagine di sfondo CTA',
  'CTA button': 'Pulsante CTA',
  'CTA button background': 'Sfondo pulsante CTA',
  'CTA button text color': 'Colore testo pulsante CTA',
  'CTA decorative image': 'Immagine decorativa CTA',
  'CTA label': 'Etichetta CTA',
  'CTA link': 'Link CTA',
  'CTA link background image': 'Immagine sfondo link CTA',
  'CTA link fallback label': 'Etichetta fallback link CTA',
  'CTA panel background': 'Sfondo pannello CTA',
  'CTA strip image': 'Immagine fascia CTA',
  'CTA text': 'Testo CTA',
  'CTA text color': 'Colore testo CTA',
  'CTA title': 'Titolo CTA',
  Custom: 'Personalizzato',
  'Custom color': 'Colore personalizzato',
  'Custom image (optional)': 'Immagine personalizzata (opzionale)',
  'Custom max width': 'Larghezza massima personalizzata',
  'Custom text color': 'Colore testo personalizzato',
  'Custom title color': 'Colore titolo personalizzato',
  'Custom URL': 'URL personalizzato',
  Darkness: 'Scurimento',
  Date: 'Data',
  'Date border': 'Bordo data',
  'Date color': 'Colore data',
  'Date day': 'Giorno data',
  'Date label': 'Etichetta data',
  'Date month': 'Mese data',
  'Date year typography': 'Tipografia anno data',
  Default: 'Predefinito',
  Description: 'Descrizione',
  'Description line breaks': 'Interruzioni descrizione',
  Desktop: 'Computer',
  'Desktop background image': 'Immagine sfondo desktop',
  'Desktop columns': 'Colonne desktop',
  'Desktop height (px)': 'Altezza desktop (px)',
  'Desktop position': 'Posizione desktop',
  'Desktop size (px)': 'Dimensione desktop (px)',
  Direction: 'Direzione',
  'Display order': 'Ordine di visualizzazione',
  'Display venue': 'Luogo visualizzato',
  'Divider color': 'Colore divisore',
  'Document to link to': 'Documento da collegare',
  'Double chevron': 'Doppio chevron',
  Down: 'Giu',
  Email: 'Email',
  'Email placeholder': 'Segnaposto email',
  'Email subject prefix': 'Prefisso oggetto email',
  'Empty events text': 'Testo eventi vuoti',
  'Empty events title': 'Titolo eventi vuoti',
  'Empty state label': 'Etichetta stato vuoto',
  'Empty state typography': 'Tipografia stato vuoto',
  End: 'Fine',
  Error: 'Errore',
  'Error message': 'Messaggio di errore',
  emails: 'Email',
  'Event board columns': 'Colonne bacheca eventi',
  'Event Calendars': 'Calendari eventi',
  'Event date': 'Data evento',
  'Event description max characters': 'Numero massimo caratteri descrizione evento',
  'Event Filters': 'Filtri eventi',
  'Event Galleries': 'Gallerie eventi',
  'Event Gallery': 'Galleria eventi',
  'Event link': 'Link evento',
  'Event link color': 'Colore link evento',
  'Event link fallback label': 'Etichetta fallback link evento',
  'Event List': 'Lista eventi',
  'Event Lists': 'Liste eventi',
  'Event marker color': 'Colore indicatore evento',
  'Event row height (px)': 'Altezza riga evento (px)',
  'Event text': 'Testo evento',
  'Event text color': 'Colore testo evento',
  'Event title': 'Titolo evento',
  'Event title color': 'Colore titolo evento',
  'Event type': 'Tipo evento',
  'Event type typography': 'Tipografia tipo evento',
  Events: 'Eventi',
  'Events feature image': 'Immagine eventi in evidenza',
  'Events source': 'Sorgente eventi',
  'Extra large': 'Molto grande',
  'Extra small': 'Molto piccolo',
  'Extra wide': 'Molto largo',
  Extreme: 'Estremo',
  FAQ: 'FAQ',
  'FAQ Accordion': 'Accordion FAQ',
  'FAQ Accordions': 'Accordion FAQ',
  'FAQ item': 'Elemento FAQ',
  'FAQ items': 'Elementi FAQ',
  Feature: 'Caratteristica',
  'Feature Grid': 'Griglia caratteristiche',
  'Feature Grids': 'Griglie caratteristiche',
  Features: 'Caratteristiche',
  'Featured Event': 'Evento in evidenza',
  'Featured event source': 'Sorgente evento in evidenza',
  'Featured Events': 'Eventi in evidenza',
  'Field typography': 'Tipografia campi',
  fields: 'Campi',
  'Filter label': 'Etichetta filtro',
  Flexbox: 'Flexbox',
  Flexboxes: 'Flexbox',
  'Flex item': 'Elemento flex',
  'Flex items': 'Elementi flex',
  'Font family': 'Famiglia font',
  'Font size': 'Dimensione font',
  'Font size (px)': 'Dimensione font (px)',
  'Font style': 'Stile font',
  'Font weight': 'Peso font',
  'Form behavior': 'Comportamento form',
  'Form labels': 'Etichette form',
  Forms: 'Moduli',
  Full: 'Intero',
  'Full width': 'Larghezza piena',
  Gap: 'Spaziatura',
  'Gallery gap (px)': 'Spaziatura galleria (px)',
  'Global color': 'Colore globale',
  'Global theme': 'Tema globale',
  'Gotham dark': 'Gotham scuro',
  'Green text': 'Testo verde',
  Header: 'Intestazione',
  Heading: 'Titolo',
  'Heading background image': 'Immagine sfondo titolo',
  'Heading banner image': 'Immagine banner titolo',
  'Heading color': 'Colore titolo',
  'Heading horizontal padding (px)': 'Padding orizzontale titolo (px)',
  'Heading text': 'Testo titolo',
  'Heading typography': 'Tipografia titolo',
  'Heading vertical padding (px)': 'Padding verticale titolo (px)',
  Heavy: 'Pesante',
  'Height stretch': 'Compressione altezza',
  Hero: 'Testata',
  'High Impact': 'Alto impatto',
  Icon: 'Icona',
  'Icon background': 'Sfondo icona',
  'Icon label': 'Etichetta icona',
  'Icon size (px)': 'Dimensione icona (px)',
  'Icon text color': 'Colore testo icona',
  'Image above title': 'Immagine sopra il titolo',
  'Image area (%)': 'Area immagine (%)',
  'Image fade size (px)': 'Dimensione sfumatura immagine (px)',
  'Image position': 'Posizione immagine',
  'Image quality': 'Qualita immagine',
  'Image size': 'Dimensione immagine',
  Images: 'Immagini',
  Individual: 'Individuale',
  'Individual Selection': 'Selezione individuale',
  Info: 'Info',
  'Internal link': 'Link interno',
  'Intro Content': 'Contenuto introduttivo',
  'Intro text': 'Testo introduttivo',
  'Intro typography': 'Tipografia introduzione',
  Italic: 'Corsivo',
  'Item arrangement': 'Disposizione elementi',
  'Item sizing': 'Dimensionamento elementi',
  'Justify content': 'Giustifica contenuto',
  Label: 'Etichetta',
  Labels: 'Etichette',
  Large: 'Grande',
  Layout: 'Layout',
  Lead: 'In evidenza',
  Left: 'Sinistra',
  'Left column (%)': 'Colonna sinistra (%)',
  'Left fog': 'Nebbia sinistra',
  'Left image position': 'Posizione immagine sinistra',
  'Left panel scribble border': 'Bordo disegnato pannello sinistro',
  'Left panel text formats': 'Formati testo pannello sinistro',
  'Left panel vintage border': 'Bordo vintage pannello sinistro',
  'Letter height': 'Altezza lettere',
  'Letter spacing': 'Spaziatura lettere',
  'Letter spacing (em)': 'Spaziatura lettere (em)',
  'Light distress': 'Usura leggera',
  Limit: 'Limite',
  'Line break count': 'Numero interruzioni riga',
  'Line break rule': 'Regola interruzione riga',
  'Line break rules': 'Regole interruzioni riga',
  'Line height': 'Interlinea',
  Links: 'Link',
  'Load more label': 'Etichetta carica altro',
  'Logo mark': 'Marchio logo',
  Loose: 'Ampio',
  'Low Impact': 'Basso impatto',
  Manual: 'Manuale',
  'Manual activities in this block': 'Attivita manuali in questo blocco',
  'Manual events': 'Eventi manuali',
  'Manual featured event': 'Evento in evidenza manuale',
  'Manual margin (px)': 'Margine manuale (px)',
  'Manual selection': 'Selezione manuale',
  Massive: 'Enorme',
  'Max width (px)': 'Larghezza massima (px)',
  Media: 'Media',
  Medium: 'Medio',
  'Medium Impact': 'Medio impatto',
  'Membership Application Block': 'Domanda di ammissione',
  'Membership Application Blocks': 'Domande di ammissione',
  'Message placeholder': 'Segnaposto messaggio',
  Meta: 'Meta',
  Mobile: 'Telefono',
  'Mobile background image': 'Immagine sfondo mobile',
  'Mobile columns': 'Colonne mobile',
  'Mobile height (px)': 'Altezza mobile (px)',
  'Mobile image height (px)': 'Altezza immagine mobile (px)',
  'Mobile image panel height (px)': 'Altezza pannello immagine mobile (px)',
  'Mobile position': 'Posizione mobile',
  'Mobile size (px)': 'Dimensione mobile (px)',
  'Month offset': 'Scostamento mese',
  'Muted color': 'Colore attenuato',
  'Muted text': 'Testo attenuato',
  'Name placeholder': 'Segnaposto nome',
  Narrow: 'Stretto',
  Navigation: 'Navigazione',
  'No wrap': 'Non andare a capo',
  None: 'Nessuno',
  Normal: 'Normale',
  'Occurrence count': 'Numero occorrenze',
  'Offset X': 'Scostamento X',
  'Offset Y': 'Scostamento Y',
  Open: 'Aperto',
  'Open in new tab': 'Apri in nuova scheda',
  'Open cookie preferences instead of link': 'Apri preferenze cookie invece del link',
  Optional: 'Opzionale',
  'Optional content background color': 'Colore sfondo contenuto opzionale',
  'Optional divider color': 'Colore divisore opzionale',
  Outline: 'Contorno',
  Padding: 'Padding',
  'Padding bottom': 'Padding sotto',
  'Padding left': 'Padding sinistra',
  'Padding right': 'Padding destra',
  'Padding top': 'Padding sopra',
  'Panel background image': 'Immagine sfondo pannello',
  Panels: 'Pannelli',
  Photo: 'Foto',
  Photos: 'Foto',
  'Photos per load': 'Foto per caricamento',
  Poster: 'Poster',
  'Primary text': 'Testo primario',
  Privacy: 'Privacy',
  'Privacy label': 'Etichetta privacy',
  'Privacy Policy': 'Privacy policy',
  'Privacy trigger link URL': 'URL link privacy',
  Pulse: 'Pulsazione',
  'Purple text': 'Testo viola',
  'Quote Banner': 'Banner citazione',
  'Quote Banners': 'Banner citazione',
  'Quote gap (px)': 'Spazio citazione (px)',
  'Quote vertical offset (px)': 'Scostamento verticale citazione (px)',
  Regular: 'Regolare',
  Required: 'Obbligatorio',
  redirect: 'Reindirizzamento',
  Responsive: 'Responsive',
  'Responsive layout': 'Layout responsive',
  Right: 'Destra',
  'Right / social links': 'Link destra / social',
  'Right fog': 'Nebbia destra',
  'Right image position': 'Posizione immagine destra',
  'Right panel text formats': 'Formati testo pannello destro',
  'Right panel vintage border': 'Bordo vintage pannello destro',
  Row: 'Riga',
  'Row on desktop, column on mobile': 'Riga su desktop, colonna su mobile',
  Rows: 'Righe',
  'Scribble border': 'Bordo disegnato',
  Search: 'Ricerca',
  'Search border': 'Bordo ricerca',
  'Search placeholder': 'Segnaposto ricerca',
  Secondary: 'Secondario',
  'Secondary text': 'Testo secondario',
  Selection: 'Selezione',
  Semibold: 'Semibold',
  'Short Name': 'Nome breve',
  'Show media consent trigger link': 'Mostra link consenso media',
  'Show privacy trigger link': 'Mostra link privacy',
  'Show purpose declaration trigger link': 'Mostra link dichiarazione finalita',
  'Show quote marks': 'Mostra virgolette',
  'Show statute declaration trigger link': 'Mostra link dichiarazione statuto',
  'Show truth declaration trigger link': 'Mostra link dichiarazione veridicita',
  'Site Background': 'Sfondo sito',
  Size: 'Dimensione',
  Small: 'Piccolo',
  'Small label': 'Etichetta piccola',
  'Small labels': 'Etichette piccole',
  Social: 'Social',
  Soft: 'Morbido',
  Solid: 'Solido',
  'Space around': 'Spazio attorno',
  'Space between': 'Spazio tra',
  'Space between cards': 'Spazio tra le schede',
  'Space evenly': 'Spazio uniforme',
  Spacing: 'Spaziatura',
  Start: 'Inizio',
  'Status typography': 'Tipografia stato',
  Steps: 'Passaggi',
  Stretch: 'Estendi',
  Strong: 'Forte',
  Style: 'Stile',
  Submit: 'Invia',
  'Submit background image': 'Immagine sfondo invio',
  'Submit label': 'Etichetta invio',
  'Subject placeholder': 'Segnaposto oggetto',
  'Submit typography': 'Tipografia invio',
  Subtitle: 'Sottotitolo',
  Subtitles: 'Sottotitoli',
  Success: 'Successo',
  'Success green': 'Verde successo',
  'Success message': 'Messaggio di successo',
  Tablet: 'Tablet',
  'Tablet background image': 'Immagine sfondo tablet',
  'Tablet columns': 'Colonne tablet',
  'Tablet height (px)': 'Altezza tablet (px)',
  'Tablet position': 'Posizione tablet',
  Text: 'Testo',
  'Text accent': 'Testo accento',
  'Text align': 'Allineamento testo',
  'Text Backdrop': 'Testo con fondale',
  'Text Backdrops': 'Testi con fondale',
  'Text color': 'Colore testo',
  'Text color mode': 'Modalita colore testo',
  'Text colors': 'Colori testo',
  'Text green': 'Testo verde',
  'Text height stretch': 'Compressione altezza testo',
  'Text muted': 'Testo attenuato',
  'Text primary': 'Testo primario',
  'Text purple': 'Testo viola',
  'Text secondary': 'Testo secondario',
  'Text style': 'Stile testo',
  'Text transform': 'Trasformazione testo',
  'Theme color': 'Colore tema',
  'Theme Colors': 'Colori tema',
  'Theme text color': 'Colore testo tema',
  'Theme title color': 'Colore titolo tema',
  'Three Panel Showcase': 'Vetrina a tre pannelli',
  'Three Panel Showcases': 'Vetrine a tre pannelli',
  Tight: 'Stretto',
  Tiny: 'Minuscolo',
  Timestamp: 'Elemento programma',
  'Timestamps / programma': 'Programma evento',
  Timestamps: 'Programma',
  Title: 'Titolo',
  'Title color mode': 'Modalita colore titolo',
  'Title margin (px)': 'Margine titolo (px)',
  'Title/description gap': 'Spazio titolo/descrizione',
  Titles: 'Titoli',
  Top: 'Alto',
  'Top left': 'In alto a sinistra',
  'Top right': 'In alto a destra',
  Transparent: 'Trasparente',
  'Torn card': 'Scheda strappata',
  'Torn Cards': 'Schede strappate',
  'Type label': 'Etichetta tipo',
  Type: 'Tipo',
  Typography: 'Tipografia',
  'Typography setting': 'Impostazione tipografica',
  'Typography settings': 'Impostazioni tipografiche',
  Up: 'Su',
  Uppercase: 'Maiuscolo',
  'Venue address': 'Indirizzo luogo',
  'Venue border': 'Bordo luogo',
  'Venue label': 'Etichetta luogo',
  Viewport: 'Viewport',
  'Vintage border image': 'Immagine bordo vintage',
  Warning: 'Avviso',
  White: 'Bianco',
  Wide: 'Largo',
  'Wide wash': 'Lavaggio largo',
  Width: 'Larghezza',
  'Word or phrase': 'Parola o frase',
  Wrap: 'Vai a capo',
  Worn: 'Usurato',
  XXS: 'XXS',
}

const descriptionTranslations: Record<string, string> = {
  '0 is current month, 1 is next month, and so on.':
    '0 indica il mese corrente, 1 il mese successivo e cosi via.',
  '0 = every matching occurrence.': '0 = tutte le occorrenze trovate.',
  'Adds the optional vintage border to this single card.':
    'Aggiunge il bordo vintage opzionale a questa singola scheda.',
  'Default keeps cards joined. When spacing is enabled, each card gets its own vintage surface and border.':
    'Il default mantiene le schede unite. Se abiliti la spaziatura, ogni scheda riceve superficie e bordo vintage propri.',
  'Adds the reusable vintage border to this single activity.':
    'Aggiunge il bordo vintage riutilizzabile a questa singola attivita.',
  'Adds the reusable yellow hand-drawn border around this block.':
    'Aggiunge il bordo giallo disegnato riutilizzabile attorno a questo blocco.',
  'Any valid CSS color, e.g. #7dff2a or rgb(125 255 42).':
    'Qualsiasi colore CSS valido, ad esempio #7dff2a o rgb(125 255 42).',
  'Caps automatic fetches. The collection itself is also limited to 8.':
    'Limita i recuperi automatici. Anche la raccolta e limitata a 8 elementi.',
  'Choose how the link should be rendered.': 'Scegli come deve essere visualizzato il link.',
  'Choose the events to show. The block will render the first two selected.':
    'Scegli gli eventi da mostrare. Il blocco mostrera i primi due selezionati.',
  'CSS color, e.g. #90a434, white, or rgba(255,255,255,0.85).':
    'Colore CSS, ad esempio #90a434, white o rgba(255,255,255,0.85).',
  'CSS color, for example #2f1631, white, or rgba(0,0,0,0.8).':
    'Colore CSS, ad esempio #2f1631, white o rgba(0,0,0,0.8).',
  'CSS color, for example #93b51f or rgba(255,255,255,0.78).':
    'Colore CSS, ad esempio #93b51f o rgba(255,255,255,0.78).',
  'CSS color, for example #a3e635 or rgb(255 255 255 / 0.8).':
    'Colore CSS, ad esempio #a3e635 o rgb(255 255 255 / 0.8).',
  'CSS color, for example #a6bd17, white, or rgba(255,255,255,0.85).':
    'Colore CSS, ad esempio #a6bd17, white o rgba(255,255,255,0.85).',
  'Custom CSS color, for example #d9d0c2.': 'Colore CSS personalizzato, ad esempio #d9d0c2.',
  'Custom CSS color, for example #e8d5a0.': 'Colore CSS personalizzato, ad esempio #e8d5a0.',
  'Display venue used by event lists and filters.':
    'Luogo visualizzato nelle liste eventi e nei filtri.',
  'Image used by the optional Scribble border / cornice vintage style.':
    'Immagine usata dal bordo disegnato opzionale / stile cornice vintage.',
  'Leave empty for no hard-coded divider color.':
    'Lascia vuoto per non impostare un colore divisore fisso.',
  'Lower numbers appear first in automatic activity blocks.':
    'I numeri piu bassi appaiono prima nei blocchi attivita automatici.',
  'Optional CSS color for days that contain events.':
    'Colore CSS opzionale per i giorni che contengono eventi.',
  'Optional CSS color. Leave empty for no visible divider.':
    'Colore CSS opzionale. Lascia vuoto per non mostrare il divisore.',
  'Optional longer text shown in the event detail page.':
    'Testo piu lungo opzionale mostrato nella pagina dettaglio evento.',
  'Optional override for this card. If empty, the selected event gallery image is used.':
    "Override opzionale per questa scheda. Se vuoto, viene usata l'immagine della galleria evento selezionata.",
  'Optional practical information blocks shown in the event detail page.':
    'Blocchi informativi opzionali mostrati nella pagina dettaglio evento.',
  'Optional section for artists, hosts, speakers, and guests shown in the event detail page.':
    'Sezione opzionale per artisti, host, speaker e ospiti mostrata nella pagina dettaglio evento.',
  'Optional special banner used on the generated event detail page, between the hero text and event info bar.':
    'Banner speciale opzionale usato nella pagina dettaglio evento, tra testo hero e barra informazioni evento.',
  'Optional target for the arrow. Use internal or custom URL.':
    'Destinazione opzionale della freccia. Usa un link interno o un URL personalizzato.',
  'Optional text rendered near the arrow.': 'Testo opzionale visualizzato vicino alla freccia.',
  'Optional. Falls back to the desktop image if empty.':
    "Opzionale. Se vuoto usa l'immagine desktop.",
  'Optional. Falls back to the tablet or desktop image if empty.':
    "Opzionale. Se vuoto usa l'immagine tablet o desktop.",
  'Optional. If set, this custom CSS color overrides the theme color.':
    'Opzionale. Se impostato, questo colore CSS personalizzato sovrascrive il colore tema.',
  'Public/audience label shown on the generated event detail page.':
    'Etichetta pubblico mostrata nella pagina dettaglio evento.',
  'Short label used by event filter buttons.': 'Etichetta breve usata dai pulsanti filtro evento.',
  'Short summary used in event cards, previews, and the top of the event page.':
    'Breve riepilogo usato nelle card evento, nelle anteprime e in alto nella pagina evento.',
  'Small links shown on the bottom-right side of the footer.':
    'Piccoli link mostrati in basso a destra nel footer.',
  'Use rounded line endings and joins.': 'Usa estremita e giunzioni arrotondate.',
  'Used for accessibility when the arrow is interactive.':
    "Usato per l'accessibilita quando la freccia e interattiva.",
  'Venue address shown on the generated event detail page.':
    'Indirizzo luogo mostrato nella pagina dettaglio evento.',
  'You will need to rebuild the website when changing this field.':
    'Dopo aver modificato questo campo dovrai rigenerare il sito.',
}

const wordTranslations: Record<string, string> = {
  accent: 'accento',
  activity: 'attivita',
  activities: 'attivita',
  add: 'aggiungi',
  align: 'allineamento',
  all: 'tutti',
  around: 'attorno',
  arrow: 'freccia',
  automatic: 'automatico',
  background: 'sfondo',
  below: 'sotto',
  between: 'tra',
  block: 'blocco',
  blocks: 'blocchi',
  border: 'bordo',
  bottom: 'basso',
  button: 'pulsante',
  card: 'scheda',
  cards: 'schede',
  center: 'centro',
  centered: 'centrato',
  color: 'colore',
  colors: 'colori',
  column: 'colonna',
  columns: 'colonne',
  content: 'contenuto',
  custom: 'personalizzato',
  date: 'data',
  decorative: 'decorativa',
  default: 'predefinito',
  description: 'descrizione',
  desktop: 'desktop',
  detail: 'dettaglio',
  display: 'visualizzato',
  divider: 'divisore',
  document: 'documento',
  empty: 'vuoto',
  event: 'evento',
  events: 'eventi',
  extra: 'molto',
  fallback: 'fallback',
  family: 'famiglia',
  field: 'campo',
  fields: 'campi',
  filter: 'filtro',
  filters: 'filtri',
  font: 'font',
  form: 'form',
  full: 'piena',
  gallery: 'galleria',
  gap: 'spaziatura',
  global: 'globale',
  grid: 'griglia',
  heading: 'titolo',
  height: 'altezza',
  hero: 'testata',
  image: 'immagine',
  images: 'immagini',
  intro: 'introduzione',
  label: 'etichetta',
  labels: 'etichette',
  left: 'sinistra',
  letter: 'lettere',
  limit: 'limite',
  line: 'riga',
  link: 'link',
  links: 'link',
  list: 'lista',
  manual: 'manuale',
  margin: 'margine',
  max: 'massima',
  media: 'media',
  message: 'messaggio',
  mobile: 'mobile',
  mode: 'modalita',
  muted: 'attenuato',
  name: 'nome',
  optional: 'opzionale',
  padding: 'padding',
  panel: 'pannello',
  panels: 'pannelli',
  placeholder: 'segnaposto',
  position: 'posizione',
  primary: 'primario',
  privacy: 'privacy',
  regular: 'regolare',
  responsive: 'responsive',
  right: 'destra',
  row: 'riga',
  rows: 'righe',
  search: 'ricerca',
  secondary: 'secondario',
  selection: 'selezione',
  size: 'dimensione',
  social: 'social',
  source: 'sorgente',
  spacing: 'spaziatura',
  state: 'stato',
  style: 'stile',
  submit: 'invio',
  subject: 'oggetto',
  success: 'successo',
  tablet: 'tablet',
  text: 'testo',
  theme: 'tema',
  title: 'titolo',
  top: 'alto',
  transform: 'trasformazione',
  type: 'tipo',
  typography: 'tipografia',
  upcoming: 'prossimi',
  venue: 'luogo',
  vertical: 'verticale',
  vintage: 'vintage',
  width: 'larghezza',
}

const isRecord = (value: unknown): value is MutableRecord =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value)

const isLocalizedLabel = (value: unknown): value is Record<string, string> =>
  isRecord(value) && Object.values(value).every((entry) => typeof entry === 'string')

const capitalizeLike = (source: string, translation: string) => {
  if (!/^[A-Z]/.test(source)) return translation

  return translation.charAt(0).toUpperCase() + translation.slice(1)
}

const humanizeName = (name: string) =>
  name
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[-_]+/g, ' ')
    .trim()

const translateGeneratedLabel = (value: string) =>
  value.replace(/[A-Za-z]+/g, (word) => {
    const translated = wordTranslations[word.toLowerCase()]

    return translated ? capitalizeLike(word, translated) : word
  })

const translateString = (value: string) => {
  const trimmed = value.trim()

  if (!trimmed) return value

  return (
    exactTranslations[trimmed] ||
    descriptionTranslations[trimmed] ||
    fieldNameTranslations[trimmed] ||
    translateGeneratedLabel(value)
  )
}

const translateLabelValue = (value: unknown) => {
  if (typeof value === 'string') return translateString(value)

  if (isLocalizedLabel(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([locale, label]) => [locale, translateString(label)]),
    )
  }

  return value
}

const getFieldLabel = (name: string) =>
  fieldNameTranslations[name] || translateString(humanizeName(name))

const applyLabels = (target: MutableRecord, key: string | undefined) => {
  const labels = key ? entityLabels[key] : undefined

  if (labels) {
    target.labels = labels
    return
  }

  if (!isRecord(target.labels)) return

  target.labels = {
    ...target.labels,
    plural: translateLabelValue(target.labels.plural),
    singular: translateLabelValue(target.labels.singular),
  }
}

const translateAdmin = (target: MutableRecord) => {
  if (!isRecord(target.admin)) return

  if (typeof target.admin.description === 'string') {
    target.admin.description = translateString(target.admin.description)
  }

  if (typeof target.admin.group === 'string') {
    target.admin.group = translateString(target.admin.group)
  }
}

const translateOptions = (field: MutableRecord) => {
  if (!Array.isArray(field.options)) return

  field.options = field.options.map((option) => {
    if (typeof option === 'string') {
      return {
        label: translateString(option),
        value: option,
      }
    }

    if (!isRecord(option)) return option

    const translatedOption = { ...option }

    if ('label' in translatedOption) {
      translatedOption.label = translateLabelValue(translatedOption.label)
    } else if (typeof translatedOption.value === 'string') {
      translatedOption.label = translateString(translatedOption.value)
    }

    return translatedOption
  })
}

const translateTab = (tab: unknown) => {
  if (!isRecord(tab)) return

  const name = typeof tab.name === 'string' ? tab.name : undefined

  if ('label' in tab) {
    tab.label = translateLabelValue(tab.label)
  } else if (name) {
    tab.label = getFieldLabel(name)
  }

  translateAdmin(tab)

  if (Array.isArray(tab.fields)) {
    tab.fields.forEach(translateField)
  }
}

const translateBlock = (block: unknown) => {
  if (!isRecord(block)) return

  const slug = typeof block.slug === 'string' ? block.slug : undefined

  applyLabels(block, slug)

  if ('label' in block) {
    block.label = translateLabelValue(block.label)
  }

  translateAdmin(block)

  if (Array.isArray(block.fields)) {
    block.fields.forEach(translateField)
  }
}

const translateField = (field: unknown) => {
  if (!isRecord(field)) return

  const name = typeof field.name === 'string' ? field.name : undefined

  if ('label' in field) {
    field.label = translateLabelValue(field.label)
  } else if (name) {
    field.label = getFieldLabel(name)
  }

  applyLabels(field, undefined)
  translateAdmin(field)
  translateOptions(field)

  if (Array.isArray(field.fields)) {
    field.fields.forEach(translateField)
  }

  if (Array.isArray(field.blocks)) {
    field.blocks.forEach(translateBlock)
  }

  if (Array.isArray(field.tabs)) {
    field.tabs.forEach(translateTab)
  }
}

const translateEntity = (entity: unknown) => {
  if (!isRecord(entity)) return

  const slug = typeof entity.slug === 'string' ? entity.slug : undefined

  applyLabels(entity, slug)
  translateAdmin(entity)

  if (slug && entityLabels[slug]) {
    entity.label = entityLabels[slug].singular
  } else if ('label' in entity) {
    entity.label = translateLabelValue(entity.label)
  }

  if (Array.isArray(entity.fields)) {
    entity.fields.forEach(translateField)
  }
}

const translateLivePreviewBreakpoints = (config: Config) => {
  const admin = config.admin as MutableRecord | undefined
  const livePreview = admin?.livePreview

  if (!isRecord(livePreview) || !Array.isArray(livePreview.breakpoints)) return

  livePreview.breakpoints.forEach((breakpoint) => {
    if (!isRecord(breakpoint) || !('label' in breakpoint)) return

    breakpoint.label = translateLabelValue(breakpoint.label)
  })
}

export const italianAdminLabelsPlugin: Plugin = (config) => {
  config.collections?.forEach(translateEntity)
  config.globals?.forEach(translateEntity)
  translateLivePreviewBreakpoints(config)

  return config
}
