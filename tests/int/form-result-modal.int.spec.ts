import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'

import { FormResultModal } from '@/components/FormResultModal'

describe('FormResultModal', () => {
  it('shows the submission result and lets the user close it', () => {
    const onClose = vi.fn()

    render(
      React.createElement(FormResultModal, {
        message: 'Messaggio inviato.',
        onClose,
        open: true,
        status: 'success',
      }),
    )

    expect(screen.getByRole('dialog').textContent).toContain('Messaggio inviato.')
    fireEvent.click(screen.getByRole('button', { name: 'Chiudi' }))
    expect(onClose).toHaveBeenCalledOnce()
  })
})
