'use client'

import { ArrowUp } from 'lucide-react'
import React from 'react'

import { cn } from '@/utilities/ui'

export const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = React.useState(false)

  React.useEffect(() => {
    const updateVisibility = () => {
      setIsVisible(window.scrollY > 420)
    }

    updateVisibility()
    window.addEventListener('scroll', updateVisibility, { passive: true })

    return () => window.removeEventListener('scroll', updateVisibility)
  }, [])

  return (
    <button
      aria-label="Torna in alto"
      className={cn(
        'fixed bottom-4 right-4 z-50 grid size-10 place-items-center border border-[color:var(--theme-text-accent)]/55 bg-[#141317]/75 text-[color:var(--theme-text-accent)] shadow-[0_0_0_1px_rgb(0_0_0_/_0.35),0_8px_22px_rgb(0_0_0_/_0.35)] backdrop-blur-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[#1d1b20]/90 hover:text-[color:var(--theme-text-secondary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--theme-text-accent)] md:bottom-6 md:right-6 md:size-11',
        isVisible
          ? 'pointer-events-auto translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-3 opacity-0',
      )}
      onClick={() => window.scrollTo({ behavior: 'smooth', top: 0 })}
      type="button"
    >
      <ArrowUp aria-hidden className="size-4 md:size-5" strokeWidth={2.2} />
    </button>
  )
}
