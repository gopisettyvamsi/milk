import React, { Suspense } from 'react'
import AdminEventPanelClient from '@/components/admin/AdminEventPanelClient'

export default function Page() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading admin panel...</div>}>
      <AdminEventPanelClient />
    </Suspense>
  )
}