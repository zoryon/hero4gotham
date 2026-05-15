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
        'group fixed bottom-4 right-4 z-50 grid size-12 place-items-center transition duration-200 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--theme-text-accent)] md:bottom-6 md:right-6 md:size-14',
        isVisible
          ? 'pointer-events-auto translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-3 opacity-0',
      )}
      onClick={() => window.scrollTo({ behavior: 'smooth', top: 0 })}
      type="button"
    >
      <span
        className="grid size-10 place-items-center bg-[color:var(--theme-text-green)] text-[#17120f] shadow-[0_3px_0_rgb(0_0_0_/_0.35),0_10px_24px_rgb(0_0_0_/_0.38)] transition duration-200 group-hover:bg-[color:var(--theme-text-secondary)] md:size-11"
        style={{
          clipPath: 'polygon(8% 4%, 96% 0, 91% 88%, 3% 100%)',
        }}
      >
        <ArrowUp aria-hidden className="size-5 md:size-6" strokeWidth={3} />
      </span>
    </button>
  )
}
