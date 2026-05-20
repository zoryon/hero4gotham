'use client'

import React, { Fragment, useCallback, useState } from 'react'
import { toast } from '@payloadcms/ui'

import './index.scss'

const SuccessMessage: React.FC = () => (
  <div>
    Database popolato. Ora puoi{' '}
    <a target="_blank" href="/">
      visitare il sito
    </a>
  </div>
)

export const SeedButton: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [seeded, setSeeded] = useState(false)
  const [error, setError] = useState<null | string>(null)

  const handleClick = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()

      if (seeded) {
        toast.info('Database gia popolato.')
        return
      }
      if (loading) {
        toast.info('Popolamento gia in corso.')
        return
      }
      if (error) {
        toast.error('Si e verificato un errore, aggiorna la pagina e riprova.')
        return
      }

      setLoading(true)

      try {
        toast.promise(
          new Promise((resolve, reject) => {
            try {
              fetch('/next/seed', { method: 'POST', credentials: 'include' })
                .then((res) => {
                  if (res.ok) {
                    resolve(true)
                    setSeeded(true)
                  } else {
                    reject('Errore durante il popolamento.')
                  }
                })
                .catch((error) => {
                  reject(error)
                })
            } catch (error) {
              reject(error)
            }
          }),
          {
            loading: 'Popolamento dati in corso...',
            success: <SuccessMessage />,
            error: 'Errore durante il popolamento.',
          },
        )
      } catch (err) {
        const error = err instanceof Error ? err.message : String(err)
        setError(error)
      }
    },
    [loading, seeded, error],
  )

  let message = ''
  if (loading) message = ' (popolamento...)'
  if (seeded) message = ' (fatto)'
  if (error) message = ` (errore: ${error})`

  return (
    <Fragment>
      <button className="seedButton" onClick={handleClick}>
        Popola il database
      </button>
      {message}
    </Fragment>
  )
}
