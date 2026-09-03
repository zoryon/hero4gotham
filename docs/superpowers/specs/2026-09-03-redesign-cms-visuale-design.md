# Redesign completo del CMS con editor visuale sincronizzato

## Stato del documento

Questa specifica descrive il lavoro da realizzare in una fase successiva. La sua creazione non modifica il comportamento attuale del CMS e non avvia il redesign.

## Obiettivo

Trasformare l'amministrazione Payload in un CMS editoriale semplice, coerente e riconoscibile, ispirato alla chiarezza operativa di WordPress ma costruito sull'identità di Hero 4 Gotham.

Il sistema deve offrire due esperienze diverse:

- il `gestore eventi` lavora con strumenti semplici e può modificare i testi statici guardando la pagina reale, gestire gli eventi e usare la libreria media;
- l'`admin` dispone della stessa esperienza semplificata, più gli strumenti completi per struttura delle pagine, layout, colori, configurazione, utenti e contenuti avanzati.

Il requisito centrale è eliminare dal lavoro quotidiano del cliente nomi tecnici, alberi di campi e controlli grafici. Il cliente deve riconoscere visivamente il punto del sito che vuole cambiare, selezionarlo, modificare il testo e pubblicarlo con un unico pulsante.

## Principi di prodotto

1. **La pagina è la mappa.** Per i contenuti statici si parte sempre dall'anteprima reale, non da un elenco astratto di campi.
2. **Un'azione primaria per schermata.** Il salvataggio o la pubblicazione sono evidenti; le azioni secondarie restano discrete.
3. **Complessità proporzionata al ruolo.** Il gestore non vede controlli che non può o non deve usare. L'admin può raggiungerli senza rendere più difficile il flusso semplice.
4. **Stessa grammatica visiva ovunque.** Dashboard, editor visuale, Eventi, Attività, Privacy, Media e schermate avanzate condividono navigazione, spaziature, superfici, stati e azioni.
5. **Nessuna falsa modifica.** Un elemento selezionabile nell'anteprima deve corrispondere a un campo realmente salvabile; ciò che non è modificabile non deve sembrare interattivo.
6. **Payload resta la fonte di verità.** Validazioni, access control, versioni, hook e revalidation esistenti non vengono aggirati.

## Architettura dei contenuti

### Contenuti statici con modifica visuale

L'editor visuale copre:

- tutte le pagine della collection `pages` che rappresentano pagine statiche;
- testi condivisi di Header e Footer;
- stringhe di interfaccia pubblica raccolte nella Global `SiteCopy`;
- metadati testuali pertinenti alla pagina, presentati in una sezione separata e comprensibile.

I testi hardcoded ancora presenti nei componenti frontend devono essere censiti e, se rivolti ai visitatori, trasferiti in `SiteCopy` o nel documento statico corretto. I fallback nel codice restano disponibili durante la migrazione e in caso di dati mancanti.

### Contenuti dinamici con editor dedicato

Non vengono modificati tramite selezione sull'anteprima:

- Eventi;
- Attività;
- Privacy Policy;
- Media;
- utenti e configurazioni tecniche;
- eventuali articoli o altre entità dinamiche.

Queste aree mantengono editor a form perché aggiunta, cancellazione, ordinamento, relazioni, date, immagini e contenuti ripetibili richiedono controlli espliciti. Le schermate vengono comunque ridisegnate con la stessa interfaccia del nuovo CMS.

### Struttura e design

La collection `pages`, i blocchi, gli hero, gli sfondi, i colori e le configurazioni di layout rimangono modificabili esclusivamente dagli admin. Il gestore eventi non deve poterli aggiornare né dalla UI né tramite API.

L'admin può aprire l'editor visuale per cambiare rapidamente i testi oppure usare `Struttura e design` per accedere al form Payload completo della pagina. L'accesso avanzato è presentato come un percorso separato, non come un pannello aggiunto al flusso del cliente.

## Ruoli e navigazione

### Gestore eventi

Navigazione primaria:

- Dashboard;
- Modifica il sito;
- Eventi;
- Media.

Non vede Pagine, Header, Footer, SiteCopy, Attività, Variabili, colori, sfondi, utenti o altre configurazioni tecniche. Le API generiche rispettano la stessa separazione.

### Admin

Navigazione primaria:

- Dashboard;
- Modifica il sito;
- Eventi;
- Media.

Gruppo `Struttura e design`:

- Pagine;
- Attività;
- Header e Footer;
- Colori e sfondi;
- testi/configurazioni condivise;
- Privacy Policy e altre entità editoriali avanzate.

Gruppo `Amministrazione`:

- Utenti;
- Variabili e configurazioni tecniche;
- eventuali strumenti di sistema.

Le voci non autorizzate vengono rimosse alla fonte tramite configurazione e access control, non soltanto nascoste con CSS.

## Direzione visiva

Il concept è **Editorial Control Room**: professionale, essenziale e leggermente editoriale, senza imitare letteralmente WordPress.

- fondo antracite profondo, superfici appena più chiare e contrasto leggibile;
- bianco caldo per testo e pannelli chiari quando serve una superficie di lavoro lunga;
- colore accento derivato dal brand Hero 4 Gotham, usato soltanto per selezione, stato attivo e azione primaria;
- tipografia con gerarchia netta, titoli compatti e testi di servizio sobri;
- bordi sottili, raggi moderati, ombre minime e ampio respiro verticale;
- icone semplici accompagnate da etichette, mai usate da sole per azioni importanti;
- animazioni brevi soltanto per selezione, apertura pannelli e conferma di salvataggio.

Il CMS non replica l'estetica pubblica del sito in ogni dettaglio: ne usa identità e tono, mantenendo una leggibilità da strumento di lavoro.

## Struttura generale dell'interfaccia

### Barra laterale

La sidebar è persistente su desktop e richiudibile. Contiene logo, navigazione dipendente dal ruolo, profilo e uscita. Le sezioni avanzate dell'admin sono raggruppate e inizialmente compatte.

Su tablet la sidebar diventa un drawer. Su mobile gli editor complessi restano utilizzabili, ma l'editor visuale mostra un passaggio esplicito tra `Anteprima` e `Testo` invece di comprimere due colonne inutilizzabili.

### Barra superiore

La top bar contestuale mostra:

- titolo della sezione o del documento;
- stato `Pubblicato`, `Bozza` o `Modifiche non salvate`;
- eventuale selettore di pagina o dispositivo;
- azione primaria `Salva e pubblica`;
- menu discreto per azioni rare.

### Feedback

- conferma di salvataggio breve e non invasiva;
- errore vicino al campo interessato e riepilogo nella barra superiore;
- stato di caricamento con skeleton, senza pagine vuote;
- avviso prima di uscire con modifiche non salvate;
- messaggi scritti in italiano semplice, senza codici tecnici.

## Dashboard

La dashboard è personalizzata e non è il riepilogo standard delle collection Payload.

### Dashboard del gestore eventi

La prima azione è una card ampia `Modifica il sito`, con miniature o collegamenti alle principali pagine statiche e pulsante `Apri editor visuale`.

Seguono:

- `Prossimi eventi`, con data, stato e azioni rapide per aprire o creare un evento;
- `Media recenti`, con accesso alla libreria;
- un piccolo riepilogo delle modifiche recenti, se disponibile senza introdurre una nuova infrastruttura di audit.

Non mostra metriche decorative o pannelli vuoti.

### Dashboard admin

Contiene gli stessi strumenti del gestore e aggiunge:

- accesso rapido a `Struttura e design`;
- contenuti in bozza o da controllare;
- collegamenti a utenti e configurazioni;
- eventuali segnalazioni operative reali, come errori di pubblicazione o dati obbligatori mancanti.

## Editor visuale sincronizzato

### Layout desktop

La schermata è divisa in:

- area principale a sinistra con anteprima reale del sito in iframe;
- pannello laterale destro di circa 380–420 px;
- barra superiore con selettore pagina, Desktop/Tablet/Mobile, stato e `Salva e pubblica`.

Il pannello non mostra tutti i testi contemporaneamente. Mostra il campo corrispondente all'elemento selezionato e, sotto, un elenco compatto delle sezioni della pagina per trovare rapidamente un contenuto.

### Selezione dalla pagina

I testi modificabili sono strumentati nel frontend con identificatori opachi e stabili. Al passaggio del mouse ricevono un contorno leggero; al click:

1. la navigazione normale dell'elemento viene sospesa in modalità editor;
2. l'elemento viene evidenziato con il colore accento;
3. il pannello laterale apre il controllo corretto;
4. viene mostrato un percorso umano, per esempio `Home / Hero / Titolo`;
5. il cursore entra nel campo di testo.

Per testi non visibili o difficili da selezionare, come SEO, messaggi di errore o label condizionali, il pannello offre la sezione `Altri testi della pagina`.

### Modifica sincronizzata

La digitazione aggiorna immediatamente l'anteprima locale senza pubblicare. La modifica deve preservare struttura, link, marcature e proprietà non testuali.

Il pannello espone soltanto:

- input o textarea adeguato alla lunghezza;
- indicazione del punto della pagina;
- conteggio caratteri quando esiste un limite utile;
- `Annulla modifica` per ripristinare il valore caricato;
- errore di validazione, se presente.

Non espone JSON, path Payload, ID tecnici, layout, colori, URL o controlli di ordinamento.

### Salvataggio

Un unico pulsante `Salva e pubblica` invia soltanto i campi testuali modificati del contenuto aperto. Il salvataggio è atomico e produce immediatamente la versione pubblicata richiesta dal cliente.

Il payload include una versione logica basata almeno su `updatedAt`. Se il documento è cambiato nel frattempo, il server rifiuta la scrittura e chiede di ricaricare, evitando sovrascritture silenziose.

L'admin vede inoltre il link secondario `Modifica struttura`, che apre il documento Payload completo in una nuova schermata. Il gestore non riceve né il link né l'autorizzazione sottostante.

### Comunicazione iframe

Anteprima e pannello comunicano con `postMessage` tramite un protocollo tipizzato e minimale:

- `editor:ready`;
- `editor:select-field`;
- `editor:update-field`;
- `editor:focus-field`;
- `editor:navigate`;
- `editor:content-refreshed`.

Ogni messaggio verifica origine, modalità preview, sessione e forma dei dati. Non vengono accettati percorsi arbitrari o comandi generici. Gli identificatori ricevuti sono sempre risolti da un catalogo server-side autorizzato.

La modalità editor viene abilitata esclusivamente da una preview autenticata e firmata. Il normale sito pubblico non mostra attributi sensibili, contorni o listener interattivi non necessari.

## Catalogo dei testi

Il catalogo server-side esistente viene evoluto come contratto centrale tra Payload, API, editor e frontend.

Per ogni testo definisce:

- identificatore opaco stabile;
- sorgente Payload e documento;
- etichetta e percorso umano;
- tipo di controllo;
- obbligatorietà e limiti;
- strategia di lettura e patch;
- eventuale identificatore da inserire nel markup dell'anteprima.

Il catalogo ammette soltanto contenuto editoriale. Slug, URL, email tecniche, colori, classi CSS, media, identificatori, relazioni, select e valori di configurazione non diventano modificabili perché rappresentati come stringhe.

Per Lexical e altri dati strutturati, la patch può cambiare soltanto il contenuto dei nodi testuali già presenti, conservando gerarchia, link, formattazione, allegati e blocchi. Gli array possono esporre testi degli elementi esistenti ma il gestore non può aggiungere, eliminare o riordinare righe dall'editor visuale.

## Editor dedicati

### Eventi

La lista usa colonne realmente operative: titolo, data, stato, attività, luogo e indicatore `In evidenza`. In alto compaiono ricerca, filtri essenziali e `Nuovo evento`.

Il form è organizzato in sezioni leggibili:

- Informazioni principali;
- Data e luogo;
- Descrizioni;
- Galleria;
- Programma;
- Artisti e ospiti;
- Informazioni utili;
- Impostazioni avanzate, visibili quando pertinenti al ruolo.

La barra di pubblicazione è sticky. Le etichette attualmente miste tra inglese e italiano vengono uniformate in italiano.

### Attività

La lista usa card o righe compatte con colore, immagine, nome breve, ordine e conteggio eventi quando ottenibile senza query costose. Il form separa identità, contenuto, media e dettagli. Colore generato e limite massimo vengono spiegati chiaramente.

L'area resta admin-only secondo la navigazione approvata; il gestore può usare l'attività come relazione negli eventi senza modificarne la definizione.

### Privacy Policy

Resta un editor dedicato, con contenuto principale ampio e strumenti di formattazione essenziali. Impostazioni di sfondo e SEO sono separate e admin-only. La schermata adotta la stessa top bar, stato e azione di salvataggio del resto del CMS.

### Media

La libreria mantiene cartelle, griglia/lista, ricerca e caricamento. Il redesign migliora gerarchia e selezione ma non riduce funzioni esistenti. Le cartelle protette e i relativi accessi restano invariati.

### Editor avanzato delle pagine

Il form completo di `pages` rimane disponibile agli admin. Hero, background, content blocks e SEO vengono raggruppati con tab più leggibili, titoli italiani coerenti, blocchi richiudibili e riepiloghi che permettano di riconoscerli senza aprirli tutti.

## Sicurezza e autorizzazione

- Tutti gli endpoint dell'editor visuale richiedono autenticazione e ruolo `admin` o `eventsManager`.
- Il catalogo viene risolto sul server; il browser non invia path Payload da applicare direttamente.
- Le API generiche di `pages`, Header, Footer e SiteCopy restano non aggiornabili dal gestore.
- L'endpoint privilegiato può operare per conto del gestore soltanto dopo aver validato sorgente, documento, campo, tipo, limite, versione e struttura.
- Le validazioni Payload, gli hook, il versioning e la revalidation restano attivi.
- Lettura e risposta espongono soltanto dati necessari all'editor.
- Ogni patch rifiuta identificatori sconosciuti, duplicati o non appartenenti al documento aperto.
- Il controllo degli origin per iframe e `postMessage` usa URL configurati lato server, non valori forniti liberamente dal client.

## Stati ed errori

- **Sessione scaduta:** ritorno al login conservando, quando possibile, la bozza locale nella sessione del browser.
- **Errore di rete:** testo digitato mantenuto, pulsante `Riprova` e nessuna falsa conferma.
- **Validazione:** campo selezionato evidenziato e messaggio concreto.
- **Conflitto:** nessun aggiornamento parziale; scelta di ricaricare la versione recente.
- **Anteprima non disponibile:** pannello con spiegazione e possibilità di riprovare, senza ricadere nell'editor tecnico per il gestore.
- **Testo non mappato:** elemento non interattivo e segnalazione diagnostica disponibile solo agli admin in sviluppo.

## Accessibilità e responsive

- contrasto minimo WCAG AA;
- focus visibile e ordine di tabulazione coerente;
- tutte le azioni disponibili da tastiera;
- selezione nell'anteprima annunciata al pannello con label accessibile;
- target interattivi di almeno 40–44 px;
- nessuna informazione affidata soltanto al colore;
- su schermi piccoli, switch tra anteprima e pannello mantenendo selezione e modifiche.

## Strategia di migrazione

1. Consolidare il catalogo dei testi e completare il censimento delle stringhe statiche.
2. Introdurre shell, navigazione e dashboard personalizzate senza cambiare gli accessi correnti.
3. Costruire il protocollo di preview e strumentare i renderer frontend.
4. Sostituire l'attuale pagina `Testi del sito` con il nuovo editor visuale, mantenendo temporaneamente una route di fallback disponibile soltanto agli admin durante il rollout.
5. Ridisegnare liste e form dedicati di Eventi, Attività, Privacy e Media.
6. Riordinare l'area avanzata admin e uniformare etichette italiane.
7. Rimuovere il vecchio editor e il fallback soltanto dopo verifica dei contenuti mappati.

Le modifiche di schema che richiedono database devono avere migrazioni Payload versionate. Nessuna migrazione di produzione viene eseguita automaticamente all'avvio dell'applicazione.

## Verifica prevista nella fase di implementazione

### Permessi

- il gestore vede soltanto Dashboard, Modifica il sito, Eventi e Media;
- l'admin vede anche Struttura e design e Amministrazione;
- il gestore non modifica layout o configurazioni tramite UI o API;
- accesso anonimo e ruoli non ammessi vengono rifiutati.

### Editor visuale

- ogni testo statico visibile e previsto dal catalogo è selezionabile;
- la selezione apre il campo corretto;
- digitazione e annullamento aggiornano l'anteprima locale;
- Desktop, Tablet e Mobile mantengono modifiche e selezione;
- `Salva e pubblica` aggiorna il sito senza alterare struttura o formattazione;
- conflitti e validazioni non producono salvataggi parziali;
- l'uscita con modifiche pendenti richiede conferma.

### Editor dedicati

- creazione e modifica eventi continuano a funzionare con galleria, programma, ospiti e informazioni utili;
- attività, privacy e media conservano comportamento e permessi;
- hook di revalidation e regole esistenti continuano a essere eseguiti;
- il redesign non nasconde funzioni necessarie già presenti.

### Qualità visiva

- dashboard e schermate principali sono coerenti a desktop e tablet;
- nessuna schermata presenta contenuto sovrapposto, tagliato o eccessivamente denso;
- stati vuoti, caricamento, successo ed errore hanno un trattamento uniforme;
- la UI italiana non contiene etichette operative miste in inglese salvo termini tecnici inevitabili.

## Criteri di completamento

Il redesign è completo quando:

- il gestore può individuare e pubblicare tutti i testi statici guardando la pagina reale;
- il gestore non può modificare layout, colori, struttura, URL o configurazioni;
- Eventi e Media restano pienamente gestibili dal cliente tramite schermate semplici;
- Attività, Privacy e tutte le aree avanzate previste hanno una veste coerente e mantengono i loro comportamenti;
- l'admin può modificare struttura e design tramite percorsi separati e completi;
- dashboard, navigazione, liste, form e feedback condividono lo stesso design system;
- access control, versioni, migrazioni, hook e revalidation Payload sono preservati;
- i controlli previsti dimostrano che nessuna modifica testuale altera dati non testuali.

## Fuori ambito

- page builder visuale libero per il gestore;
- modifica inline di colori, spaziature, immagini o disposizione dei blocchi da parte del cliente;
- sostituzione di Payload CMS;
- autosalvataggio che pubblica senza un'azione esplicita;
- redesign del sito pubblico, salvo gli attributi e i listener strettamente necessari alla modalità editor;
- modifica visuale delle entità dinamiche Eventi, Attività e Privacy Policy.

