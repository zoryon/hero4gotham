'use client'

import { CircleAlert, CircleCheck, X } from 'lucide-react'
import React, { type ReactNode, useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'

import { cn } from '@/utilities/ui'

type Props = {
  message: ReactNode
  onClose: () => void
  open: boolean
  status: 'error' | 'success'
}

export const FormResultModal = ({ message, onClose, open, status }: Props) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const titleId = useId()
  const messageId = useId()

  useEffect(() => {
    if (!open) return

    const previousFocusedElement =
      document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previousOverflow = document.body.style.overflow
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', closeOnEscape)
    window.setTimeout(() => closeButtonRef.current?.focus(), 0)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeOnEscape)
      previousFocusedElement?.focus()
    }
  }, [onClose, open])

  if (!open || typeof document === 'undefined') return null

  const isSuccess = status === 'success'

  return createPortal(
    <div
      aria-describedby={isSuccess ? undefined : messageId}
      aria-labelledby={titleId}
      aria-modal="true"
      className="fixed inset-0 z-[1000] grid place-items-center bg-black/60 p-4 backdrop-blur-[3px]"
      onClick={onClose}
      role="dialog"
    >
      <div
        className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-[#17181d] px-6 py-7 text-center text-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          aria-label="Chiudi popup"
          className="absolute right-3 top-3 grid size-9 place-items-center rounded-full text-white/65 transition hover:bg-white/10 hover:text-white"
          onClick={onClose}
          ref={closeButtonRef}
          type="button"
        >
          <X aria-hidden className="size-4" />
        </button>

        <div
          className={cn(
            'mx-auto mb-4 grid size-12 place-items-center rounded-full',
            isSuccess ? 'bg-emerald-400/12 text-emerald-300' : 'bg-red-400/12 text-red-300',
          )}
        >
          {isSuccess ? (
            <CircleCheck aria-hidden className="size-7" />
          ) : (
            <CircleAlert aria-hidden className="size-7" />
          )}
        </div>

        <h2 className="font-cinzel text-lg font-black uppercase" id={titleId}>
          {isSuccess ? 'Invio riuscito' : 'Invio non riuscito'}
        </h2>
        {!isSuccess ? (
          <div className="mt-3 text-sm leading-6 text-white/75" id={messageId}>
            {message}
          </div>
        ) : null}
        <button
          className="mt-6 min-h-10 rounded-full bg-white px-7 py-2 font-cinzel text-xs font-black uppercase text-[#17181d] transition hover:bg-white/85"
          onClick={onClose}
          type="button"
        >
          Chiudi
        </button>
      </div>
    </div>,
    document.body,
  )
}
