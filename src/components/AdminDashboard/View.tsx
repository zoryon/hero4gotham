import { DefaultTemplate } from '@payloadcms/next/templates'
import type { AdminViewServerProps } from 'payload'

import { AdminDashboard } from './Dashboard.client'

export default function AdminDashboardView(props: AdminViewServerProps) {
  return (
    <DefaultTemplate {...props} visibleEntities={props.initPageResult.visibleEntities}>
      <AdminDashboard />
    </DefaultTemplate>
  )
}
