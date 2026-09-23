'use client'

import { RelationshipField } from '@payloadcms/ui'
import type { ComponentProps } from 'react'
import { useEffect } from 'react'

type ActivityRelationshipFieldProps = ComponentProps<typeof RelationshipField>

export const ActivityRelationshipField = (props: ActivityRelationshipFieldProps) => {
  useEffect(() => {
    const keepTouchScrollInsideMenu = (event: TouchEvent) => {
      const target = event.target

      if (
        target instanceof Element &&
        target.closest('.h4g-event-activity-field .rs__menu-list')
      ) {
        // Payload forces react-select to capture touch moves. On mobile that
        // competes with native momentum scrolling and makes the list jump.
        event.stopPropagation()
      }
    }

    document.addEventListener('touchmove', keepTouchScrollInsideMenu, {
      capture: true,
      passive: true,
    })

    return () => {
      document.removeEventListener('touchmove', keepTouchScrollInsideMenu, true)
    }
  }, [])

  return <RelationshipField {...props} />
}
