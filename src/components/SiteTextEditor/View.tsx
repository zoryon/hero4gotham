import { DefaultTemplate } from '@payloadcms/next/templates'
import { redirect } from 'next/navigation'
import type { AdminViewServerProps } from 'payload'

import { SiteTextEditor } from './Editor.client'

export default function SiteTextEditorView(props: AdminViewServerProps) {
  const user = props.initPageResult.req.user as { role?: string } | null
  if (user?.role !== 'admin' && user?.role !== 'eventsManager') {
    redirect(props.payload.config.routes.admin)
  }

  return (
    <DefaultTemplate {...props} visibleEntities={props.initPageResult.visibleEntities}>
      <SiteTextEditor />
    </DefaultTemplate>
  )
}
