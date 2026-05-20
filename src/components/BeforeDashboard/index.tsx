import { Banner } from '@payloadcms/ui/elements/Banner'
import React from 'react'

import { SeedButton } from './SeedButton'
import './index.scss'

const baseClass = 'before-dashboard'

const BeforeDashboard: React.FC = () => {
  return (
    <div className={baseClass}>
      <Banner className={`${baseClass}__banner`} type="success">
        <h4>Benvenuto nella dashboard.</h4>
      </Banner>
      Ecco cosa fare ora:
      <ul className={`${baseClass}__instructions`}>
        <li>
          <SeedButton />
          {' con alcune pagine, articoli e progetti per avviare il sito, poi '}
          <a href="/" target="_blank">
            visita il sito
          </a>
          {' per vedere il risultato.'}
        </li>
        <li>
          {'Modifica le '}
          <a
            href="https://payloadcms.com/docs/configuration/collections"
            rel="noopener noreferrer"
            target="_blank"
          >
            raccolte
          </a>
          {' e aggiungi altri '}
          <a
            href="https://payloadcms.com/docs/fields/overview"
            rel="noopener noreferrer"
            target="_blank"
          >
            campi
          </a>
          {' se servono. Se Payload e nuovo per te, dai anche uno sguardo alla guida '}
          <a
            href="https://payloadcms.com/docs/getting-started/what-is-payload"
            rel="noopener noreferrer"
            target="_blank"
          >
            per iniziare
          </a>
          {'.'}
        </li>
        <li>Fai commit e push delle modifiche per avviare una nuova pubblicazione del progetto.</li>
      </ul>
      {'Nota: questo blocco e un '}
      <a
        href="https://payloadcms.com/docs/custom-components/overview"
        rel="noopener noreferrer"
        target="_blank"
      >
        componente custom
      </a>
      , puoi rimuoverlo in qualsiasi momento aggiornando <strong>payload.config</strong>.
    </div>
  )
}

export default BeforeDashboard
