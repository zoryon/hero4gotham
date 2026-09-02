# Editor dedicato ai testi del sito

## Obiettivo

Fornire agli utenti con ruolo `eventsManager` una pagina dedicata nel CMS dalla quale possano modificare e pubblicare tutto il testo visibile sul sito senza poter cambiare layout, colori, immagini, URL, formattazione o struttura dei contenuti.

La stessa pagina sarà disponibile anche agli amministratori. Le normali aree amministrative continueranno a funzionare come oggi e i relativi permessi non verranno ampliati implicitamente.

## Ambito editoriale

L'editor comprende il testo rivolto ai visitatori proveniente da:

- pagine e relativi hero, blocchi di contenuto e metadati SEO;
- header e footer;
- informativa privacy;
- moduli, messaggi di stato, etichette e testi di supporto;
- eventi, attività e articoli;
- testi comuni e stringhe oggi definite direttamente nei componenti frontend.

Sono escluse le stringhe dell'interfaccia amministrativa di Payload e tutti i valori tecnici non destinati alla lettura del visitatore.

## Esperienza utente

Il menu di Payload espone una voce `Testi del sito` agli amministratori e ai gestori eventi. La pagina usa una gerarchia compatta:

1. un selettore dell'area, come Pagine, Elementi comuni, Eventi, Attività, Articoli o Privacy;
2. quando necessario, un selettore del documento, per esempio la pagina Home o un singolo evento;
3. sezioni richiudibili corrispondenti alle parti comprensibili del contenuto, come Hero, Contenuto, Modulo e SEO;
4. controlli semplici costituiti soltanto da input testuali e textarea.

Ogni controllo ha un'etichetta leggibile e, quando utile, una breve indicazione del punto del sito in cui compare. L'editor non mostra JSON, nomi tecnici dei campi, pannelli grafici o controlli strutturali.

Gli elementi ripetuti già esistenti, come card, domande frequenti o voci di un elenco, espongono i propri testi ma non possono essere aggiunti, eliminati o riordinati. I link mostrano il testo modificabile ma non la destinazione.

La pagina non usa autosalvataggio. Un pulsante `Salva` sempre riconoscibile pubblica immediatamente tutte le modifiche del contenuto aperto. Dopo il salvataggio appare una conferma discreta. La navigazione con modifiche non salvate richiede conferma.

## Architettura

### Vista amministrativa dedicata

Una custom view di Payload, servita sotto la rotta amministrativa esistente, realizza l'interfaccia `Testi del sito`. La view recupera un modello editoriale normalizzato tramite endpoint autenticati e invia soltanto le modifiche testuali.

Il modello restituito alla UI contiene identificatori opachi, etichette, eventuali descrizioni, tipo di controllo e valore. Non espone percorsi interni liberamente modificabili dal client.

### Catalogo dei testi modificabili

Un catalogo server-side esplicito descrive le sorgenti ammesse e traduce ciascun identificatore opaco nel documento e nel campo Payload corrispondenti. Il catalogo include soltanto:

- campi Payload realmente testuali destinati al frontend;
- nodi testuali presenti nei contenuti rich text;
- stringhe frontend statiche migrate in una configurazione CMS dedicata.

Campi `select`, URL, email tecniche, slug, identificatori, classi CSS e valori di configurazione non diventano modificabili solo perché rappresentati internamente come stringhe. L'inclusione è intenzionale e basata sul significato del campo.

Il catalogo può enumerare gli elementi già presenti in array e blocchi, ma non accetta operazioni che ne cambino lunghezza, ordine, tipo o identificatori.

### Testi statici del frontend

Le stringhe rivolte ai visitatori che oggi vivono direttamente nel codice vengono censite e spostate in una Global Payload dedicata. I componenti frontend leggono la Global tramite una utility cache-aware e mantengono valori predefiniti nel codice per garantire un rendering sicuro durante migrazioni o dati mancanti.

La Global non viene mostrata direttamente al gestore eventi: i suoi campi vengono presentati dentro la medesima vista `Testi del sito`. Gli amministratori possono continuare ad avere accesso tecnico diretto se utile alla manutenzione.

### Testo formattato

Per Lexical e altri contenuti strutturati, l'editor espone esclusivamente il contenuto dei nodi testuali. Al salvataggio sostituisce il testo nei nodi originali conservando:

- tipo e gerarchia dei nodi;
- grassetto, corsivo e altre marcature;
- elenchi e paragrafi;
- link e relativi URL;
- riferimenti, allegati e blocchi incorporati.

Il gestore non può creare o rimuovere nodi rich text. Un nodo può ricevere anche una stringa vuota solo quando il campo Payload originale lo consente.

## Lettura e salvataggio

1. La custom view richiede l'elenco delle aree e dei documenti disponibili.
2. Alla selezione di un contenuto, il server legge il documento Payload e genera i controlli ammessi dal catalogo.
3. La risposta include la versione logica del documento, basata almeno sul suo `updatedAt`.
4. Il client invia gli identificatori dei testi modificati, i nuovi valori e la versione letta.
5. Il server ricostruisce le patch esclusivamente dal catalogo, ignora ogni percorso proposto dal client e verifica che struttura e versione siano ancora valide.
6. Il server aggiorna il documento originale come pubblicato, facendo eseguire validazioni, versioning, hook e revalidation già configurati.
7. La UI ricarica i dati salvati e mostra l'esito.

Se il documento è cambiato dopo la lettura, il server restituisce un conflitto senza applicare aggiornamenti. La UI chiede di ricaricare il contenuto, evitando una sovrascrittura silenziosa.

Il salvataggio di una schermata è atomico: o tutti i suoi testi validi vengono applicati, oppure nessuno viene pubblicato.

## Accesso e sicurezza

Gli endpoint della vista accettano soltanto utenti autenticati con ruolo `admin` o `eventsManager`. Il ruolo continua a essere letto dal campo salvato nel JWT secondo il modello esistente.

La collezione `pages` rimane amministrabile soltanto dagli admin attraverso le API generiche e le normali schermate Payload. Quando l'endpoint dedicato deve aggiornare una sorgente non accessibile al gestore tramite API generica, esegue un'operazione server privilegiata soltanto dopo aver:

- autenticato e autorizzato l'utente;
- risolto ogni identificatore tramite il catalogo server-side;
- rifiutato identificatori sconosciuti o duplicati;
- verificato il tipo e i limiti del valore;
- verificato versione e struttura del documento;
- costruito una patch che preserva tutti i dati non testuali.

Le validazioni dello schema Payload rimangono attive. L'endpoint non accetta documenti completi, percorsi arbitrari o operatori di aggiornamento inviati dal browser.

La risposta di lettura contiene soltanto i valori necessari alla UI. Informazioni protette, campi tecnici e dati non autorizzati non vengono serializzati.

## Gestione degli errori

- Errori di validazione: il campo interessato viene evidenziato con un messaggio leggibile e nulla viene pubblicato.
- Conflitto di versione o struttura: nessuna modifica viene applicata e l'utente viene invitato a ricaricare.
- Sessione scaduta o ruolo non valido: accesso negato e ritorno al login o alla dashboard secondo il comportamento Payload.
- Errore di rete o server: i valori digitati restano nella pagina e l'utente può riprovare.
- Testo statico non ancora migrato o dato CMS mancante: il frontend usa il valore predefinito presente nel codice.

## Compatibilità con il CMS esistente

- Gli admin conservano le schermate complete per modificare layout e configurazione.
- I gestori eventi conservano i permessi che possiedono già sulle altre collezioni; questa funzionalità non li riduce né li estende oltre l'editor testuale dedicato.
- Le versioni delle pagine rimangono abilitate. Il pulsante della vista dedicata salva direttamente una versione pubblicata, come richiesto.
- Gli hook di revalidation esistenti continuano a invalidare pagine e cache. La Global dei testi statici avrà un hook equivalente.
- I tipi Payload e l'import map dell'admin vengono rigenerati dopo le modifiche allo schema e alla custom view.

## Strategia di test

### Test unitari

- estrazione dei soli campi ammessi dal catalogo;
- applicazione di modifiche testuali senza alterare oggetti, array, nodi Lexical, formattazione e URL;
- rifiuto di identificatori e tipi non ammessi;
- rilevamento di cambiamenti di versione o struttura.

### Test di integrazione

- un gestore eventi legge e aggiorna i testi ammessi;
- un gestore eventi non modifica layout, colori, media, slug, URL o struttura tramite l'endpoint dedicato;
- un utente non autenticato o con ruolo non ammesso riceve un rifiuto;
- le API generiche di `pages` restano vietate al gestore;
- il salvataggio produce contenuto pubblicato ed esegue gli hook attesi;
- un aggiornamento non valido o concorrente non viene applicato parzialmente.

### Test end-to-end

- la voce `Testi del sito` è visibile ai ruoli previsti;
- area, documento e sezioni sono navigabili senza mostrare controlli grafici;
- modificare e salvare un testo aggiorna il frontend;
- uscire con modifiche pendenti mostra l'avviso;
- la UI rimane utilizzabile su viewport desktop e tablet con un numero rappresentativo di contenuti.

## Criteri di completamento

La funzionalità è completa quando ogni testo destinato ai visitatori è modificabile dalla vista dedicata, nessun dato non testuale può essere cambiato attraverso quella vista o il suo endpoint, il salvataggio pubblica immediatamente e la suite di test dimostra accesso, integrità dei dati e aggiornamento del frontend.
