# Redesign CMS visuale - Implementation Plan

> **Execution:** inline nel repository corrente, come richiesto. Eccezione esplicita del cliente: al massimo due verifiche, entrambe alla fine.

**Goal:** sostituire l'esperienza Payload generica con una control room editoriale per ruolo e un editor dei testi con anteprima reale sincronizzata.

**Architecture:** Payload continua a gestire autenticazione, accessi e persistenza. Le custom view Dashboard e Modifica il sito forniscono i flussi semplificati; l'editor usa l'API `site-texts` esistente, arricchita con URL di anteprima, e sincronizza i campi con un iframe same-origin. Gli editor dinamici restano Payload ma ricevono una shell grafica e una struttura più leggibile.

**Tech Stack:** Next.js 16, React 19, Payload CMS 3.84, TypeScript, SCSS.

**Spec:** `docs/superpowers/specs/2026-09-03-redesign-cms-visuale-design.md`

## Global Constraints

- `eventsManager`: Dashboard, Modifica il sito, Eventi, Media.
- `admin`: stessa area semplice più Struttura e design e Amministrazione.
- Salvataggio visuale pubblicato e atomico tramite catalogo server-side.
- Nessun controllo di layout, colore, URL o struttura nell'editor del gestore.
- Eventi, Attività e Privacy restano editor dedicati.
- UI italiana, responsive e coerente.

### Task 1: Shell e dashboard editoriale

**Files:**
- Create: `src/components/AdminDashboard/View.tsx`
- Create: `src/components/AdminDashboard/Dashboard.client.tsx`
- Create: `src/components/AdminDashboard/index.scss`
- Modify: `src/payload.config.ts`
- Modify: `src/app/(payload)/custom.scss`

- [ ] Registrare una dashboard custom autorizzata e basata su `DefaultTemplate`.
- [ ] Mostrare azioni rapide diverse per `admin` e `eventsManager`.
- [ ] Applicare il design system Editorial Control Room a shell, nav, liste, form, card, tab e pulsanti.

### Task 2: Navigazione e permessi per ruolo

**Files:**
- Modify: `src/components/SiteTextEditor/NavLink.client.tsx`
- Modify: `src/Header/config.ts`
- Modify: `src/Footer/config.ts`
- Modify: `src/PrivacyPolicy/config.ts`
- Modify: `src/MembershipDocuments/config.ts`

- [ ] Rendere `Modifica il sito` la voce primaria e rinominarla in modo comprensibile.
- [ ] Nascondere e bloccare gli editor generici di contenuti condivisi al gestore.
- [ ] Conservare l'aggiornamento testuale controllato attraverso il servizio dedicato.

### Task 3: Indice dei soli contenuti statici

**Files:**
- Modify: `src/siteText/types.ts`
- Modify: `src/siteText/sources.ts`
- Modify: `src/siteText/service.ts`

- [ ] Limitare l'editor visuale a Pagine, Header, Footer e SiteCopy.
- [ ] Restituire per ogni sorgente un `previewPath` same-origin.
- [ ] Selezionare lo slug delle pagine senza esporre dati tecnici aggiuntivi.

### Task 4: Editor visuale sincronizzato

**Files:**
- Modify: `src/components/SiteTextEditor/Editor.client.tsx`
- Modify: `src/components/SiteTextEditor/index.scss`
- Modify: `src/components/SiteTextEditor/View.tsx`

- [ ] Costruire layout anteprima/pannello con pagina e dispositivo selezionabili.
- [ ] Indicizzare i nodi testuali dell'iframe e associarli ai controlli del catalogo.
- [ ] Selezionare il campo cliccando l'anteprima e riflettere la digitazione localmente.
- [ ] Mantenere salvataggio atomico, gestione conflitti e avviso modifiche pendenti.
- [ ] Aggiungere navigazione compatta delle sezioni e fallback per testi non visibili.

### Task 5: Editor dinamici e copy amministrativa

**Files:**
- Modify: `src/collections/Events.ts`
- Modify: `src/collections/Activities.ts`
- Modify: `src/PrivacyPolicy/config.ts`
- Modify: `src/app/(payload)/custom.scss`

- [ ] Uniformare etichette e descrizioni operative in italiano.
- [ ] Migliorare la leggibilità delle sezioni tramite gruppi, tab e stile globale senza cambiare i dati.
- [ ] Evidenziare stato, azioni primarie, tabelle, upload e blocchi ripetibili.

### Task 6: Generazione e verifiche finali

**Files:**
- Regenerate: `src/app/(payload)/control-room-h4g/importMap.js`

- [ ] Eseguire `pnpm generate:importmap`.
- [ ] Verifica 1: `pnpm exec tsc --noEmit`.
- [ ] Verifica 2: `pnpm lint` limitando eventuali correzioni ai file modificati.
- [ ] Controllare il diff e non includere modifiche estranee già presenti.

