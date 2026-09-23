'use client'

import { useEffect } from 'react'

export const ActivityTouchScrollGuard = () => {
  useEffect(() => {
    const allowNativeMenuScroll = (event: TouchEvent) => {
      const target = event.target

      if (
        target instanceof Element &&
        target.closest('.h4g-event-activity-field .rs__menu-list')
      ) {
        // Payload enables react-select's touch scroll capture. Its touch delta
        // is measured from the start of the gesture and repeatedly snaps the
        // list to an edge. Stop that handler while preserving native scrolling.
        event.stopPropagation()
      }
    }

    document.addEventListener('touchmove', allowNativeMenuScroll, {
      capture: true,
      passive: true,
    })

    return () => {
      document.removeEventListener('touchmove', allowNativeMenuScroll, true)
    }
  }, [])

  return null
}
