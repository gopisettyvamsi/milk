import QuestionsContentClient from '@/components/admin/QuestionsContentClient'

type PageProps = {
  params?: Promise<{ [key: string]: any }>
  searchParams?: Promise<any>
}

export default async function Page({ params, searchParams }: PageProps) {
  const resolvedParams = params ? await params : undefined
  const resolvedSearch = searchParams ? await searchParams : undefined

  let eventId: string | null | undefined = undefined

  if (resolvedParams && typeof resolvedParams === 'object' && 'eventId' in resolvedParams) {
    eventId = (resolvedParams as any).eventId
  } else if (resolvedSearch) {
    if (typeof (resolvedSearch as any).get === 'function') {
      eventId = (resolvedSearch as URLSearchParams).get('eventId') || undefined
    } else if (typeof resolvedSearch === 'object') {
      eventId = (resolvedSearch as any).eventId
    }
  }

  return <QuestionsContentClient eventId={eventId ?? null} />
}
