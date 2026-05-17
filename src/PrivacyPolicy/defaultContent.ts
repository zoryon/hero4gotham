const text = (value: string) => ({
  detail: 0,
  format: 0,
  mode: 'normal',
  style: '',
  text: value,
  type: 'text',
  version: 1,
})

const paragraph = (value: string) => ({
  children: [text(value)],
  direction: 'ltr',
  format: '',
  indent: 0,
  textFormat: 0,
  type: 'paragraph',
  version: 1,
})

const heading = (value: string, tag: 'h2' | 'h3' = 'h2') => ({
  children: [text(value)],
  direction: 'ltr',
  format: '',
  indent: 0,
  tag,
  type: 'heading',
  version: 1,
})

export const defaultPrivacyPolicyContent = {
  root: {
    children: [
      paragraph(
        'La presente informativa descrive come Hero 4 Gotham, associazione culturale, tratta i dati personali raccolti tramite questo sito web, i moduli di contatto, il modulo di candidatura all’associazione, le richieste di download documenti e gli strumenti tecnici necessari al funzionamento del sito.',
      ),
      paragraph(
        'Questa informativa è predisposta ai sensi degli articoli 12, 13 e 14 del Regolamento (UE) 2016/679 (“GDPR”), del D.lgs. 196/2003 come modificato dal D.lgs. 101/2018 e della normativa italiana applicabile in materia di protezione dei dati personali e comunicazioni elettroniche.',
      ),
      heading('1. Titolare del trattamento'),
      paragraph(
        'Il Titolare del trattamento è Hero 4 Gotham, associazione culturale. Per ogni richiesta relativa alla privacy è possibile scrivere a info@hero4gotham.it. Se l’associazione dispone di ulteriori dati identificativi, sede legale, codice fiscale, PEC o altri recapiti ufficiali, tali informazioni devono essere inserite e mantenute aggiornate in questa sezione.',
      ),
      paragraph(
        'Alla data di redazione della presente informativa non risulta nominato un Responsabile della Protezione dei Dati (DPO/RPD). Qualora venga nominato, i relativi recapiti saranno pubblicati in questa pagina.',
      ),
      heading('2. Tipologie di dati trattati'),
      paragraph(
        'Dati di navigazione e tecnici: indirizzo IP, informazioni sul browser e sul dispositivo, log tecnici, URL richiesti, data e ora della richiesta, informazioni necessarie alla sicurezza, alla consegna delle pagine e alla diagnosi di errori.',
      ),
      paragraph(
        'Dati forniti tramite il modulo di contatto: nome e cognome, indirizzo email, oggetto, messaggio, conferma di presa visione dell’informativa privacy e altri dati eventualmente inseriti liberamente dall’utente nel messaggio.',
      ),
      paragraph(
        'Dati forniti tramite il modulo di candidatura all’associazione: nome, cognome, data e luogo di nascita, indirizzo di residenza, email, telefono, tipo di richiesta, motivazione, aree di interesse, dichiarazioni rese dall’utente, consenso facoltativo all’uso di foto/video durante eventi, documenti caricati dall’utente come codice fiscale e carta d’identità in formato immagine.',
      ),
      paragraph(
        'Dati relativi ai download documentali: il sito può mostrare documenti informativi scaricabili, ad esempio informative privacy, regolamenti o documenti collegati ai moduli. Il download può comportare il normale trattamento tecnico dei dati di navigazione necessario a fornire il file richiesto.',
      ),
      paragraph(
        'Dati amministrativi e redazionali: per gli utenti autorizzati ad accedere al CMS possono essere trattati dati di account, credenziali, ruolo, log tecnici e attività necessarie alla gestione del sito.',
      ),
      heading('3. Finalità e basi giuridiche'),
      paragraph(
        'Rispondere ai messaggi inviati tramite il modulo di contatto. Base giuridica: esecuzione di misure precontrattuali o riscontro a una richiesta dell’interessato; in alcuni casi legittimo interesse del Titolare a gestire comunicazioni ricevute.',
      ),
      paragraph(
        'Gestire le candidature e le richieste di ammissione o partecipazione all’associazione. Base giuridica: esecuzione di misure precontrattuali o contrattuali richieste dall’interessato, adempimento di obblighi statutari, amministrativi e contabili, e legittimo interesse alla corretta gestione associativa.',
      ),
      paragraph(
        'Verificare l’identità del candidato e la correttezza dei dati forniti tramite documenti caricati. Base giuridica: esecuzione della richiesta dell’interessato, obblighi legali o statutari applicabili, legittimo interesse alla prevenzione di abusi, errori o richieste non autentiche.',
      ),
      paragraph(
        'Gestire eventuali consensi facoltativi per l’uso di immagini, foto o video raccolti durante eventi associativi. Base giuridica: consenso dell’interessato, revocabile in qualsiasi momento senza pregiudicare la liceità del trattamento svolto prima della revoca.',
      ),
      paragraph(
        'Garantire sicurezza, manutenzione, protezione da abusi, prevenzione di spam e continuità tecnica del sito. Base giuridica: legittimo interesse del Titolare alla sicurezza del sito e dei sistemi informatici.',
      ),
      paragraph(
        'Adempiere a obblighi di legge, fiscali, contabili, amministrativi o richieste delle autorità. Base giuridica: obbligo legale.',
      ),
      heading('4. Natura del conferimento'),
      paragraph(
        'I campi contrassegnati come obbligatori nei moduli sono necessari per inviare la richiesta, ricevere risposta o completare la candidatura. Il mancato conferimento dei dati obbligatori impedisce l’invio del modulo o la gestione della richiesta.',
      ),
      paragraph(
        'I dati facoltativi, compresi eventuali consensi non necessari al servizio richiesto, possono essere omessi senza impedire la fruizione delle funzionalità principali, salvo che siano necessari per specifiche attività richieste dall’interessato.',
      ),
      heading('5. Categorie particolari di dati'),
      paragraph(
        'Il sito non richiede intenzionalmente dati appartenenti a categorie particolari ai sensi dell’art. 9 GDPR, salvo quanto eventualmente desumibile dai documenti caricati o dalle informazioni inserite liberamente dall’utente. Si invita a non inserire nei messaggi dati sensibili non necessari. Qualora tali dati siano forniti spontaneamente, saranno trattati solo se pertinenti alla richiesta e nei limiti consentiti dalla normativa applicabile.',
      ),
      heading('6. Modalità del trattamento e sicurezza'),
      paragraph(
        'I dati sono trattati con strumenti informatici, telematici e, se necessario, organizzativi/manuali, adottando misure tecniche e organizzative adeguate a ridurre rischi di accesso non autorizzato, perdita, uso improprio, modifica o divulgazione non autorizzata.',
      ),
      paragraph(
        'Le candidature e i messaggi inviati tramite il sito possono essere trasmessi via email agli indirizzi configurati dall’associazione. I documenti caricati nella candidatura possono essere allegati alla comunicazione email inviata al Titolare o ai soggetti autorizzati alla gestione della richiesta.',
      ),
      heading('7. Destinatari dei dati'),
      paragraph(
        'I dati possono essere trattati da personale autorizzato dell’associazione, componenti degli organi associativi o collaboratori incaricati di gestire contatti, candidature, eventi, attività amministrative e tecniche.',
      ),
      paragraph(
        'I dati possono essere comunicati a fornitori tecnici e responsabili del trattamento, come hosting provider, servizi email/SMTP, manutentori del sito, piattaforme CMS, fornitori di sicurezza informatica, consulenti amministrativi, fiscali o legali quando necessario.',
      ),
      paragraph(
        'I dati non sono venduti. Non sono diffusi pubblicamente salvo consenso specifico dell’interessato o obbligo di legge. Eventuali immagini o contenuti relativi a eventi saranno pubblicati solo sulla base di consenso, liberatoria o altra idonea base giuridica.',
      ),
      heading('8. Trasferimenti extra UE'),
      paragraph(
        'Il Titolare privilegia fornitori e infrastrutture situati nello Spazio Economico Europeo. Qualora alcuni fornitori tecnici comportino trasferimenti di dati verso Paesi extra UE, tali trasferimenti saranno effettuati nel rispetto degli articoli 44 e seguenti del GDPR, ad esempio tramite decisioni di adeguatezza, clausole contrattuali standard o altre garanzie previste dalla normativa.',
      ),
      heading('9. Tempi di conservazione'),
      paragraph(
        'Messaggi di contatto: conservati per il tempo necessario a rispondere e gestire la richiesta, indicativamente fino a 24 mesi, salvo necessità di ulteriore conservazione per tutela di diritti, obblighi legali o rapporti in corso.',
      ),
      paragraph(
        'Candidature all’associazione: conservate per il tempo necessario alla valutazione e gestione della candidatura. In caso di ammissione, i dati necessari alla gestione del rapporto associativo saranno conservati per tutta la durata del rapporto e successivamente per i termini previsti da obblighi civilistici, fiscali, contabili o statutari. In caso di mancata ammissione o mancato perfezionamento, i dati e i documenti saranno conservati per il tempo strettamente necessario alla gestione della richiesta, indicativamente fino a 12 mesi, salvo obblighi o contenziosi.',
      ),
      paragraph(
        'Documenti di identità e codice fiscale caricati: conservati solo per il tempo necessario alla verifica e alla gestione della candidatura o del rapporto associativo, con accesso limitato ai soggetti autorizzati.',
      ),
      paragraph(
        'Log tecnici e dati di sicurezza: conservati per tempi proporzionati alle finalità di sicurezza, manutenzione e prevenzione abusi, salvo necessità di conservazione ulteriore in caso di incidenti, accertamenti o richieste delle autorità.',
      ),
      heading('10. Cookie e strumenti di tracciamento'),
      paragraph(
        'Il sito può usare cookie tecnici e strumenti analoghi necessari al funzionamento, alla sicurezza, alla gestione delle preferenze e alla corretta erogazione delle pagine richieste. Questi strumenti non richiedono consenso quando sono strettamente necessari.',
      ),
      paragraph(
        'Eventuali cookie analytics non tecnici, cookie di profilazione, strumenti di marketing, pixel, fingerprinting o tecnologie di terze parti non strettamente necessarie devono essere attivati solo previo consenso valido dell’utente, tramite apposito banner o meccanismo di gestione preferenze conforme alle Linee guida del Garante Privacy sui cookie e altri strumenti di tracciamento.',
      ),
      paragraph(
        'Se il sito non utilizza strumenti di tracciamento non tecnici, questa sezione deve indicarlo chiaramente. Se in futuro verranno aggiunti strumenti di analytics, mappe, video incorporati, social plugin, advertising o altri servizi terzi, questa informativa e l’eventuale cookie banner dovranno essere aggiornati.',
      ),
      heading('11. Diritti dell’interessato'),
      paragraph(
        'L’interessato può esercitare i diritti previsti dagli articoli 15-22 GDPR, tra cui accesso, rettifica, cancellazione, limitazione, opposizione, portabilità dei dati nei casi applicabili, revoca del consenso e diritto di non essere sottoposto a decisioni basate unicamente su trattamenti automatizzati, ove applicabile.',
      ),
      paragraph(
        'Le richieste possono essere inviate a info@hero4gotham.it. Il Titolare risponderà nei termini previsti dalla normativa. L’interessato ha inoltre diritto di proporre reclamo al Garante per la protezione dei dati personali tramite www.garanteprivacy.it.',
      ),
      heading('12. Minori'),
      paragraph(
        'Il sito e i moduli sono destinati a persone maggiorenni o a soggetti che agiscono con adeguata capacità e, se necessario, con il coinvolgimento di chi esercita la responsabilità genitoriale. Qualora l’associazione raccolga dati di minori per attività, eventi o iscrizioni, dovrà acquisire le autorizzazioni e informative specifiche richieste dalla normativa applicabile.',
      ),
      heading('13. Aggiornamenti'),
      paragraph(
        'Questa informativa può essere aggiornata per modifiche normative, tecniche, organizzative o per l’introduzione di nuove funzionalità del sito. La versione aggiornata sarà pubblicata in questa pagina.',
      ),
    ],
    direction: 'ltr',
    format: '',
    indent: 0,
    type: 'root',
    version: 1,
  },
}
